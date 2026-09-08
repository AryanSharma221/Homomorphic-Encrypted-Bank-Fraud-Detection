"""
Model Evaluation and Comparison.

Loads all saved models (teacher + student variants) and produces a
unified comparison table and classification reports on the test set.
"""

import os
import json
import numpy as np
import torch
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    average_precision_score,
    confusion_matrix,
    classification_report,
)

from train_teacher import TeacherModel, load_data, make_dataloader, DEVICE, RANDOM_SEED
from distillation import StudentModel

MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "saved_models")
BATCH_SIZE = 256


def evaluate_on_test(model, test_loader):
    """Run model on test set and return metrics + raw predictions."""
    model.eval()
    all_preds, all_targets = [], []

    with torch.no_grad():
        for X_batch, y_batch in test_loader:
            X_batch = X_batch.to(DEVICE)
            logits = model(X_batch)
            probs = torch.sigmoid(logits)
            all_preds.extend(probs.cpu().numpy().flatten())
            all_targets.extend(y_batch.numpy().flatten())

    preds = np.array(all_preds)
    targets = np.array(all_targets)
    binary = (preds > 0.5).astype(int)

    return {
        "accuracy": accuracy_score(targets, binary),
        "precision": precision_score(targets, binary, zero_division=0),
        "recall": recall_score(targets, binary, zero_division=0),
        "f1": f1_score(targets, binary, zero_division=0),
        "roc_auc": roc_auc_score(targets, preds),
        "pr_auc": average_precision_score(targets, preds),
    }, targets, preds


def main():
    torch.manual_seed(RANDOM_SEED)
    np.random.seed(RANDOM_SEED)

    X_train, X_val, X_test, y_train, y_val, y_test, scaler = load_data()
    input_dim = X_train.shape[1]
    test_loader = make_dataloader(X_test, y_test, BATCH_SIZE, shuffle=False)

    all_results = {}

    # ── Teacher ──
    teacher = TeacherModel(input_dim).to(DEVICE)
    teacher_path = os.path.join(MODEL_DIR, "teacher_model.pth")
    if os.path.exists(teacher_path):
        teacher.load_state_dict(torch.load(teacher_path, map_location=DEVICE, weights_only=True))
        metrics, _, _ = evaluate_on_test(teacher, test_loader)
        teacher_params = sum(p.numel() for p in teacher.parameters())
        metrics["parameters"] = teacher_params
        all_results["Teacher (ReLU)"] = metrics
        print(f"Teacher: {teacher_params:,} params")
    else:
        print(f"WARNING: Teacher model not found at {teacher_path}")

    # ── Students ──
    activation_names = ["relu", "square", "poly2", "poly3", "poly4"]
    for act_name in activation_names:
        model_path = os.path.join(MODEL_DIR, f"student_{act_name}.pth")
        if not os.path.exists(model_path):
            print(f"Skipping student_{act_name} (not found)")
            continue

        student = StudentModel(input_dim, activation_name=act_name).to(DEVICE)
        student.load_state_dict(torch.load(model_path, map_location=DEVICE, weights_only=True))
        metrics, targets, preds = evaluate_on_test(student, test_loader)

        student_params = sum(p.numel() for p in student.parameters())
        metrics["parameters"] = student_params
        label = f"Student-KD ({act_name})"
        all_results[label] = metrics

        # Print confusion matrix
        binary = (preds > 0.5).astype(int)
        cm = confusion_matrix(targets, binary)
        print(f"\n{label}: {student_params:,} params")
        print(f"  Confusion Matrix:\n  {cm}")

    # ── Summary Table ──
    print(f"\n{'='*90}")
    print(f"  MODEL COMPARISON — TEST SET")
    print(f"{'='*90}")
    header = f"{'Model':<25} {'Params':>8} {'Acc':>8} {'Prec':>8} {'Rec':>8} {'F1':>8} {'ROC':>8} {'PR':>8}"
    print(header)
    print("-" * 90)

    for name, m in all_results.items():
        print(
            f"{name:<25} {m['parameters']:>8,} {m['accuracy']:>8.4f} "
            f"{m['precision']:>8.4f} {m['recall']:>8.4f} {m['f1']:>8.4f} "
            f"{m['roc_auc']:>8.4f} {m['pr_auc']:>8.4f}"
        )

    # Save
    output_path = os.path.join(MODEL_DIR, "evaluation_results.json")
    with open(output_path, "w") as f:
        json.dump(all_results, f, indent=2)
    print(f"\nResults saved to: {output_path}")


if __name__ == "__main__":
    main()
