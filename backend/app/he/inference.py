"""
Encrypted Neural Network Inference.

Evaluates the exported student model on encrypted
(simulated CKKS) vectors using HE-compatible operations.

Architecture:
Input → Dense(32) → Poly2 → Dense(16) → Poly2 → Dense(1) → Sigmoid
"""

import json
import os

import numpy as np

from app.he.encryption import EncryptedVector, get_context


WEIGHTS_DIR = os.path.join(
    os.path.dirname(__file__),
    "model_weights",
)

_model_weights: dict = {}
_model_loaded: bool = False


def _init_random_weights(input_dim: int = 30):
    """Initialize fallback weights matching the student architecture."""

    global _model_weights

    rng = np.random.RandomState(42)

    _model_weights = {
        "fc1_weight": rng.randn(32, input_dim).astype(np.float64) * 0.05,
        "fc1_bias": np.zeros(32, dtype=np.float64),
        "act1_a0": np.float64(0.50),
        "act1_a1": np.float64(0.50),
        "act1_a2": np.float64(0.10),
        "fc2_weight": rng.randn(16, 32).astype(np.float64) * 0.05,
        "fc2_bias": np.zeros(16, dtype=np.float64),
        "act2_a0": np.float64(0.50),
        "act2_a1": np.float64(0.50),
        "act2_a2": np.float64(0.10),
        "fc3_weight": rng.randn(1, 16).astype(np.float64) * 0.05,
        "fc3_bias": np.zeros(1, dtype=np.float64),
    }


def load_model_weights():
    """Load exported student model weights from JSON."""

    global _model_weights, _model_loaded

    weights_path = os.path.join(
        WEIGHTS_DIR,
        "student_poly2_weights.json",
    )

    if not os.path.exists(weights_path):
        print(
            f"[HE Inference] WARNING: No weights found at "
            f"{weights_path}. Using random fallback."
        )

        _init_random_weights()
        _model_loaded = False
        return

    try:
        with open(weights_path, "r") as file:
            raw_weights = json.load(file)

        _model_weights = {
            key: np.asarray(value, dtype=np.float64)
            for key, value in raw_weights.items()
        }

        _model_loaded = True

        print(
            f"[HE Inference] Loaded model weights from "
            f"{weights_path}"
        )
        print(
            f"[HE Inference] Keys: "
            f"{list(_model_weights.keys())}"
        )

    except Exception as exc:
        print(
            f"[HE Inference] WARNING: Failed to load model weights: "
            f"{exc}. Using random fallback."
        )

        _init_random_weights()
        _model_loaded = False


load_model_weights()


def _encrypted_linear(
    x: np.ndarray,
    weight: np.ndarray,
    bias: np.ndarray,
) -> np.ndarray:
    """
    HE-compatible linear layer:

        y = W @ x + b
    """

    return weight @ x + bias


def _encrypted_poly2_activation(
    x: np.ndarray,
    a0,
    a1,
    a2,
) -> np.ndarray:
    """
    Polynomial activation:

        P(x) = a0 + a1*x + a2*x²
    """

    a0 = float(a0)
    a1 = float(a1)
    a2 = float(a2)

    return a0 + a1 * x + a2 * (x * x)


def _sigmoid(x: np.ndarray) -> np.ndarray:
    """Numerically stable sigmoid."""

    x = np.clip(x, -500, 500)

    return np.where(
        x >= 0,
        1.0 / (1.0 + np.exp(-x)),
        np.exp(x) / (1.0 + np.exp(x)),
    )


def run_encrypted_inference(
    enc_input: EncryptedVector,
) -> EncryptedVector:
    """
    Run the student neural network on the encrypted input.

    Pipeline:
        Encrypted Input
            ↓
        Dense(32)
            ↓
        Poly2
            ↓
        Dense(16)
            ↓
        Poly2
            ↓
        Dense(1)
            ↓
        Sigmoid
    """

    if not enc_input.is_encrypted:
        raise ValueError("Input must be encrypted.")

    ctx = get_context()

    x = enc_input.data_with_noise.copy()

    # Layer 1
    x = _encrypted_linear(
        x,
        _model_weights["fc1_weight"],
        _model_weights["fc1_bias"],
    )

    x = _encrypted_poly2_activation(
        x,
        _model_weights.get("act1_a0", 0.5),
        _model_weights.get("act1_a1", 0.5),
        _model_weights.get("act1_a2", 0.1),
    )

    # Layer 2
    x = _encrypted_linear(
        x,
        _model_weights["fc2_weight"],
        _model_weights["fc2_bias"],
    )

    x = _encrypted_poly2_activation(
        x,
        _model_weights.get("act2_a0", 0.5),
        _model_weights.get("act2_a1", 0.5),
        _model_weights.get("act2_a2", 0.1),
    )

    # Layer 3
    x = _encrypted_linear(
        x,
        _model_weights["fc3_weight"],
        _model_weights["fc3_bias"],
    )

    # Sigmoid output
    score = _sigmoid(x)

    # Simulated CKKS approximation noise
    noise = np.random.normal(
        0,
        ctx.noise_magnitude,
        size=score.shape,
    )

    return EncryptedVector(
        _data=score,
        _noise=noise,
        is_encrypted=True,
        scheme="CKKS",
        size=len(score),
    )


def decrypt_prediction(
    enc_prediction: EncryptedVector,
) -> float:
    """
    Decrypt the encrypted fraud prediction.

    Returns a score between 0 and 1.
    """

    if not enc_prediction.is_encrypted:
        raise ValueError("Prediction is not encrypted.")

    result = enc_prediction.data_with_noise.flatten()

    score = float(
        np.clip(result[0], 0.0, 1.0)
    )

    return round(score, 4)