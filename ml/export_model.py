"""
Export Student Model for Backend Deployment.

Extracts the student model's weights and biases as plain numpy arrays,
along with the polynomial activation coefficients. This makes it possible
to evaluate the model under HE without needing PyTorch at inference time.

Also exports the scaler parameters so the backend preprocessing can
normalize inputs identically to training.
"""

import os
import json
import numpy as np
import torch
import pickle

from train_teacher import TeacherModel, DEVICE
from distillation import StudentModel

MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "saved_models")
EXPORT_DIR = os.path.join(os.path.dirname(__file__), "..", "backend", "app", "he", "model_weights")


def export_student(activation_name: str = "poly2"):
    """Export a trained student model's weights for HE inference."""

    # Determine input_dim from scaler
    scaler_path = os.path.join(MODEL_DIR, "scaler.pkl")
    with open(scaler_path, "rb") as f:
        scaler = pickle.load(f)
    input_dim = scaler.n_features_in_

    # Load model
    model_path = os.path.join(MODEL_DIR, f"student_{activation_name}.pth")
    student = StudentModel(input_dim, activation_name=activation_name)
    student.load_state_dict(torch.load(model_path, map_location="cpu", weights_only=True))
    student.eval()

    print(f"Exporting student_{activation_name} (input_dim={input_dim})")

    os.makedirs(EXPORT_DIR, exist_ok=True)

    # Extract layer weights and biases
    weights = {}
    for name, param in student.named_parameters():
        arr = param.detach().cpu().numpy()
        key = name.replace(".", "_")
        weights[key] = arr.tolist()
        print(f"  {name}: {arr.shape}")

    # Save weights as JSON (easy to load without PyTorch)
    weights_path = os.path.join(EXPORT_DIR, f"student_{activation_name}_weights.json")
    with open(weights_path, "w") as f:
        json.dump(weights, f)
    print(f"\nWeights saved to: {weights_path}")

    # Also save as numpy arrays for faster loading
    np_dir = os.path.join(EXPORT_DIR, f"student_{activation_name}_np")
    os.makedirs(np_dir, exist_ok=True)
    for name, param in student.named_parameters():
        arr = param.detach().cpu().numpy()
        filename = name.replace(".", "_") + ".npy"
        np.save(os.path.join(np_dir, filename), arr)
    print(f"Numpy weights saved to: {np_dir}")

    # Export scaler parameters
    scaler_export = {
        "mean": scaler.mean_.tolist(),
        "scale": scaler.scale_.tolist(),
        "n_features": int(scaler.n_features_in_),
    }
    scaler_export_path = os.path.join(EXPORT_DIR, "scaler_params.json")
    with open(scaler_export_path, "w") as f:
        json.dump(scaler_export, f)
    print(f"Scaler params saved to: {scaler_export_path}")

    # Export model architecture summary
    architecture = {
        "activation": activation_name,
        "input_dim": input_dim,
        "layers": [
            {"name": "fc1", "in": input_dim, "out": 32},
            {"name": "act1", "type": activation_name},
            {"name": "fc2", "in": 32, "out": 16},
            {"name": "act2", "type": activation_name},
            {"name": "fc3", "in": 16, "out": 1},
        ],
    }
    arch_path = os.path.join(EXPORT_DIR, "architecture.json")
    with open(arch_path, "w") as f:
        json.dump(architecture, f, indent=2)
    print(f"Architecture saved to: {arch_path}")

    print("\nExport complete.")


def main():
    # Export the best polynomial student (default: poly2)
    # You can change this after reviewing evaluate.py results
    export_student("poly2")


if __name__ == "__main__":
    main()
