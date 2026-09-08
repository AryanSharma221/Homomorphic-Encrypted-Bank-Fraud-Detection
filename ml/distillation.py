"""
Knowledge Distillation: Teacher → Student.

The student model is deliberately smaller and uses polynomial activations
so that it can run under Homomorphic Encryption. It learns from the
teacher's soft probability outputs rather than only hard 0/1 labels,
which helps it retain more of the teacher's predictive capability.
"""

import os
import json
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import roc_auc_score, average_precision_score
import pickle

from polynomial_activation import get_activation
from train_teacher import TeacherModel, load_data, make_dataloader, evaluate_model, DEVICE, RANDOM_SEED

# ──────────────────────────────────────────────
# Configuration
# ──────────────────────────────────────────────
MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "saved_models")
BATCH_SIZE = 256
EPOCHS = 40
LR = 1e-3
TEMPERATURE = 4.0       # Softens teacher probabilities
ALPHA = 0.3             # Weight for hard-label loss (1-ALPHA = KD loss weight)


# ──────────────────────────────────────────────
# Student Model Definition
# ──────────────────────────────────────────────
class StudentModel(nn.Module):
    """
    Lightweight neural network: input_dim → 32 → activation → 16 → activation → 1
    Uses polynomial activations for HE compatibility.
    No BatchNorm (hard to evaluate under HE), no Dropout at inference.
    """

    def __init__(self, input_dim: int, activation_name: str = "poly2"):
        super().__init__()
        self.activation_name = activation_name
        self.fc1 = nn.Linear(input_dim, 32)
        self.act1 = get_activation(activation_name)
        self.fc2 = nn.Linear(32, 16)
        self.act2 = get_activation(activation_name)
        self.fc3 = nn.Linear(16, 1)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.act1(self.fc1(x))
        x = self.act2(self.fc2(x))
        x = self.fc3(x)
        return x


# ──────────────────────────────────────────────
# Knowledge Distillation Loss
# ──────────────────────────────────────────────
def distillation_loss(student_logits, teacher_logits, targets, temperature, alpha):
    """
    Combined loss:
      L = alpha * BCE(student, hard_labels) + (1-alpha) * T^2 * KL(student_soft || teacher_soft)

    The temperature softens the probability distributions, exposing more
    information about the teacher's uncertainty across classes.
    """
    # Hard-label loss (standard BCE)
    hard_loss = nn.functional.binary_cross_entropy_with_logits(student_logits, targets)

    # Soft-label loss (KL divergence on tempered probabilities)
    teacher_soft = torch.sigmoid(teacher_logits / temperature)
    student_soft = torch.sigmoid(student_logits / temperature)

    # KL divergence for binary classification (Bernoulli KL)
    soft_loss = (
        teacher_soft * torch.log((teacher_soft + 1e-8) / (student_soft + 1e-8))
        + (1 - teacher_soft) * torch.log((1 - teacher_soft + 1e-8) / (1 - student_soft + 1e-8))
    ).mean()

    return alpha * hard_loss + (1 - alpha) * (temperature ** 2) * soft_loss


# ──────────────────────────────────────────────
# Training Loop
# ──────────────────────────────────────────────
def train_student_with_kd(student, teacher, train_loader, val_loader):
    """Train student model using knowledge distillation from teacher."""
    teacher.eval()  # Teacher is frozen
    optimizer = optim.Adam(student.parameters(), lr=LR)
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, patience=5, factor=0.5)

    best_val_auc = 0.0
    best_state = None

    for epoch in range(EPOCHS):
        # ── Train ──
        student.train()
        epoch_loss = 0.0
        for X_batch, y_batch in train_loader:
            X_batch, y_batch = X_batch.to(DEVICE), y_batch.to(DEVICE)

            optimizer.zero_grad()

            student_logits = student(X_batch)
            with torch.no_grad():
                teacher_logits = teacher(X_batch)

            loss = distillation_loss(
                student_logits, teacher_logits, y_batch, TEMPERATURE, ALPHA
            )
            loss.backward()
            optimizer.step()
            epoch_loss += loss.item() * X_batch.size(0)

        epoch_loss /= len(train_loader.dataset)

        # ── Validate ──
        student.eval()
        val_preds, val_targets = [], []
        with torch.no_grad():
            for X_batch, y_batch in val_loader:
                X_batch = X_batch.to(DEVICE)
                logits = student(X_batch)
                probs = torch.sigmoid(logits)
                val_preds.extend(probs.cpu().numpy().flatten())
                val_targets.extend(y_batch.numpy().flatten())

        val_auc = roc_auc_score(val_targets, val_preds)
        val_pr_auc = average_precision_score(val_targets, val_preds)
        scheduler.step(-val_auc)

        print(
            f"Epoch {epoch+1:02d}/{EPOCHS} | "
            f"Loss: {epoch_loss:.4f} | "
            f"Val ROC-AUC: {val_auc:.4f} | "
            f"Val PR-AUC: {val_pr_auc:.4f}"
        )

        if val_auc > best_val_auc:
            best_val_auc = val_auc
            best_state = student.state_dict().copy()

    student.load_state_dict(best_state)
    print(f"\nBest Val ROC-AUC: {best_val_auc:.4f}")
    return student


# ──────────────────────────────────────────────
# Main
# ──────────────────────────────────────────────
def main():
    torch.manual_seed(RANDOM_SEED)
    np.random.seed(RANDOM_SEED)

    # Load data
    X_train, X_val, X_test, y_train, y_val, y_test, scaler = load_data()
    input_dim = X_train.shape[1]

    train_loader = make_dataloader(X_train, y_train, BATCH_SIZE)
    val_loader = make_dataloader(X_val, y_val, BATCH_SIZE, shuffle=False)
    test_loader = make_dataloader(X_test, y_test, BATCH_SIZE, shuffle=False)

    # Load trained teacher
    teacher = TeacherModel(input_dim).to(DEVICE)
    teacher_path = os.path.join(MODEL_DIR, "teacher_model.pth")
    teacher.load_state_dict(torch.load(teacher_path, map_location=DEVICE, weights_only=True))
    teacher.eval()
    print("Teacher model loaded.\n")

    # Train students with different activations
    results = {}
    for act_name in ["relu", "square", "poly2", "poly3", "poly4"]:
        print(f"\n{'='*60}")
        print(f"  Training Student with activation: {act_name}")
        print(f"{'='*60}\n")

        student = StudentModel(input_dim, activation_name=act_name).to(DEVICE)
        total_params = sum(p.numel() for p in student.parameters())
        print(f"Student parameters: {total_params:,}\n")

        student = train_student_with_kd(student, teacher, train_loader, val_loader)
        metrics = evaluate_model(student, test_loader, label=f"Student-{act_name}")

        # Save
        os.makedirs(MODEL_DIR, exist_ok=True)
        model_path = os.path.join(MODEL_DIR, f"student_{act_name}.pth")
        torch.save(student.state_dict(), model_path)
        print(f"Saved to: {model_path}")

        results[act_name] = metrics

    # Save comparison
    results_path = os.path.join(MODEL_DIR, "distillation_results.json")
    with open(results_path, "w") as f:
        json.dump(results, f, indent=2)
    print(f"\nAll results saved to: {results_path}")

    # Summary
    print(f"\n{'='*70}")
    print(f"  DISTILLATION COMPARISON SUMMARY")
    print(f"{'='*70}")
    print(f"{'Activation':<12} {'Accuracy':>10} {'Precision':>10} {'Recall':>10} {'F1':>10} {'ROC-AUC':>10} {'PR-AUC':>10}")
    print("-" * 70)
    for act, m in results.items():
        print(
            f"{act:<12} {m['accuracy']:>10.4f} {m['precision']:>10.4f} "
            f"{m['recall']:>10.4f} {m['f1']:>10.4f} {m['roc_auc']:>10.4f} {m['pr_auc']:>10.4f}"
        )


if __name__ == "__main__":
    main()
