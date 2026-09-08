"""
Train the Teacher Neural Network for Fraud Detection.

The teacher is a larger, high-accuracy model trained on plaintext data.
It uses standard ReLU activations and does not need to be HE-compatible.
Its purpose is to produce soft probability outputs that guide the
student model during Knowledge Distillation.

Dataset: Credit Card Fraud Detection (Kaggle)
- 284,807 transactions, 492 fraudulent (0.17%)
- 30 features (V1-V28 from PCA, Time, Amount)
- Binary classification: 0 = legitimate, 1 = fraud
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
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    average_precision_score,
    classification_report,
)
import pickle

# ──────────────────────────────────────────────
# Configuration
# ──────────────────────────────────────────────
DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "creditcard.csv")
MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "saved_models")
BATCH_SIZE = 256
EPOCHS = 30
LR = 1e-3
RANDOM_SEED = 42
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ──────────────────────────────────────────────
# Teacher Model Definition
# ──────────────────────────────────────────────
class TeacherModel(nn.Module):
    """
    Larger neural network: 30 → 128 → 64 → 32 → 1
    Uses ReLU activations and Batch Normalization.
    """

    def __init__(self, input_dim: int):
        super().__init__()
        self.network = nn.Sequential(
            nn.Linear(input_dim, 128),
            nn.BatchNorm1d(128),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(128, 64),
            nn.BatchNorm1d(64),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(64, 32),
            nn.BatchNorm1d(32),
            nn.ReLU(),
            nn.Linear(32, 1),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.network(x)


# ──────────────────────────────────────────────
# Data Loading
# ──────────────────────────────────────────────
def load_data():
    """Load and preprocess the credit card fraud dataset."""
    import pandas as pd

    print(f"Loading data from: {os.path.abspath(DATA_PATH)}")
    df = pd.read_csv(DATA_PATH)
    print(f"Dataset shape: {df.shape}")
    print(f"Fraud distribution:\n{df['Class'].value_counts()}")
    print(f"Fraud ratio: {df['Class'].mean():.4%}")

    X = df.drop("Class", axis=1).values
    y = df["Class"].values

    # Train/val/test split: 70/15/15
    X_train, X_temp, y_train, y_temp = train_test_split(
        X, y, test_size=0.30, random_state=RANDOM_SEED, stratify=y
    )
    X_val, X_test, y_val, y_test = train_test_split(
        X_temp, y_temp, test_size=0.50, random_state=RANDOM_SEED, stratify=y_temp
    )

    # Normalize
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_val = scaler.transform(X_val)
    X_test = scaler.transform(X_test)

    print(f"\nSplits — Train: {len(X_train)}, Val: {len(X_val)}, Test: {len(X_test)}")

    return X_train, X_val, X_test, y_train, y_val, y_test, scaler


def make_dataloader(X, y, batch_size=BATCH_SIZE, shuffle=True):
    """Create a PyTorch DataLoader from numpy arrays."""
    dataset = TensorDataset(
        torch.FloatTensor(X),
        torch.FloatTensor(y).unsqueeze(1),
    )
    return DataLoader(dataset, batch_size=batch_size, shuffle=shuffle)


# ──────────────────────────────────────────────
# Training
# ──────────────────────────────────────────────
def train_teacher(model, train_loader, val_loader, pos_weight):
    """Train the teacher model with class-weighted BCE loss."""
    criterion = nn.BCEWithLogitsLoss(pos_weight=torch.tensor([pos_weight]).to(DEVICE))
    optimizer = optim.Adam(model.parameters(), lr=LR)
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, patience=3, factor=0.5)

    best_val_auc = 0.0
    best_state = None

    for epoch in range(EPOCHS):
        # ── Train ──
        model.train()
        train_loss = 0.0
        for X_batch, y_batch in train_loader:
            X_batch, y_batch = X_batch.to(DEVICE), y_batch.to(DEVICE)
            optimizer.zero_grad()
            logits = model(X_batch)
            loss = criterion(logits, y_batch)
            loss.backward()
            optimizer.step()
            train_loss += loss.item() * X_batch.size(0)
        train_loss /= len(train_loader.dataset)

        # ── Validate ──
        model.eval()
        val_preds, val_targets = [], []
        val_loss = 0.0
        with torch.no_grad():
            for X_batch, y_batch in val_loader:
                X_batch, y_batch = X_batch.to(DEVICE), y_batch.to(DEVICE)
                logits = model(X_batch)
                loss = criterion(logits, y_batch)
                val_loss += loss.item() * X_batch.size(0)
                probs = torch.sigmoid(logits)
                val_preds.extend(probs.cpu().numpy().flatten())
                val_targets.extend(y_batch.cpu().numpy().flatten())
        val_loss /= len(val_loader.dataset)

        val_auc = roc_auc_score(val_targets, val_preds)
        val_pr_auc = average_precision_score(val_targets, val_preds)
        scheduler.step(val_loss)

        print(
            f"Epoch {epoch+1:02d}/{EPOCHS} | "
            f"Train Loss: {train_loss:.4f} | "
            f"Val Loss: {val_loss:.4f} | "
            f"Val ROC-AUC: {val_auc:.4f} | "
            f"Val PR-AUC: {val_pr_auc:.4f}"
        )

        if val_auc > best_val_auc:
            best_val_auc = val_auc
            best_state = model.state_dict().copy()

    # Restore best weights
    model.load_state_dict(best_state)
    print(f"\nBest Val ROC-AUC: {best_val_auc:.4f}")
    return model


# ──────────────────────────────────────────────
# Evaluation
# ──────────────────────────────────────────────
def evaluate_model(model, test_loader, label="Teacher"):
    """Evaluate a trained model on the test set."""
    model.eval()
    all_preds, all_targets = [], []

    with torch.no_grad():
        for X_batch, y_batch in test_loader:
            X_batch = X_batch.to(DEVICE)
            logits = model(X_batch)
            probs = torch.sigmoid(logits)
            all_preds.extend(probs.cpu().numpy().flatten())
            all_targets.extend(y_batch.numpy().flatten())

    all_preds = np.array(all_preds)
    all_targets = np.array(all_targets)
    binary_preds = (all_preds > 0.5).astype(int)

    metrics = {
        "accuracy": accuracy_score(all_targets, binary_preds),
        "precision": precision_score(all_targets, binary_preds, zero_division=0),
        "recall": recall_score(all_targets, binary_preds, zero_division=0),
        "f1": f1_score(all_targets, binary_preds, zero_division=0),
        "roc_auc": roc_auc_score(all_targets, all_preds),
        "pr_auc": average_precision_score(all_targets, all_preds),
    }

    print(f"\n{'='*50}")
    print(f"  {label} Model — Test Set Results")
    print(f"{'='*50}")
    for k, v in metrics.items():
        print(f"  {k:>12s}: {v:.4f}")
    print(f"{'='*50}")
    print(classification_report(all_targets, binary_preds, target_names=["Legit", "Fraud"]))

    return metrics


# ──────────────────────────────────────────────
# Main
# ──────────────────────────────────────────────
def main():
    torch.manual_seed(RANDOM_SEED)
    np.random.seed(RANDOM_SEED)

    # Load data
    X_train, X_val, X_test, y_train, y_val, y_test, scaler = load_data()
    input_dim = X_train.shape[1]

    # Compute class weight for imbalanced data
    n_legit = (y_train == 0).sum()
    n_fraud = (y_train == 1).sum()
    pos_weight = n_legit / n_fraud
    print(f"Class weight (pos_weight): {pos_weight:.2f}")

    # DataLoaders
    train_loader = make_dataloader(X_train, y_train)
    val_loader = make_dataloader(X_val, y_val, shuffle=False)
    test_loader = make_dataloader(X_test, y_test, shuffle=False)

    # Build & train
    model = TeacherModel(input_dim).to(DEVICE)
    print(f"\nTeacher architecture:\n{model}")
    total_params = sum(p.numel() for p in model.parameters())
    print(f"Total parameters: {total_params:,}\n")

    model = train_teacher(model, train_loader, val_loader, pos_weight)

    # Evaluate
    metrics = evaluate_model(model, test_loader, label="Teacher")

    # Save
    os.makedirs(MODEL_DIR, exist_ok=True)
    teacher_path = os.path.join(MODEL_DIR, "teacher_model.pth")
    torch.save(model.state_dict(), teacher_path)
    print(f"\nTeacher model saved to: {teacher_path}")

    scaler_path = os.path.join(MODEL_DIR, "scaler.pkl")
    with open(scaler_path, "wb") as f:
        pickle.dump(scaler, f)
    print(f"Scaler saved to: {scaler_path}")

    metrics_path = os.path.join(MODEL_DIR, "teacher_metrics.json")
    with open(metrics_path, "w") as f:
        json.dump(metrics, f, indent=2)
    print(f"Metrics saved to: {metrics_path}")

    return model, scaler, metrics


if __name__ == "__main__":
    main()
