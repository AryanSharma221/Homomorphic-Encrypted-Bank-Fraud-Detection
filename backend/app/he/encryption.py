"""
CKKS Homomorphic Encryption Layer.

This module currently provides a simulation of CKKS encryption/decryption.
The interface is designed so that it can later be replaced with TenSEAL.
"""

from dataclasses import dataclass, field
from typing import Optional

import numpy as np


@dataclass
class CKKSContext:
    """Simulated CKKS encryption context."""

    poly_modulus_degree: int = 8192

    coeff_mod_bit_sizes: list[int] = field(
        default_factory=lambda: [60, 40, 40, 60]
    )

    global_scale: float = 2**40

    # Simulated CKKS approximation noise
    noise_magnitude: float = 1e-7

    def __post_init__(self):
        self._secret_key = np.random.RandomState(42).bytes(32)


_context: Optional[CKKSContext] = None


def get_context() -> CKKSContext:
    """Get or create the global CKKS context."""

    global _context

    if _context is None:
        _context = CKKSContext()

    return _context


@dataclass
class EncryptedVector:
    """
    Simulated CKKS ciphertext.

    The plaintext is stored internally only because this is a simulation.
    A real HE implementation would store an actual ciphertext instead.
    """

    _data: np.ndarray
    _noise: np.ndarray
    is_encrypted: bool = True
    scheme: str = "CKKS"
    size: int = 0

    @property
    def data_with_noise(self) -> np.ndarray:
        """Return the simulated ciphertext value."""
        return self._data + self._noise


def encrypt_features(features: list[float]) -> EncryptedVector:
    """
    Convert plaintext features into a simulated CKKS ciphertext.
    """

    ctx = get_context()

    data = np.asarray(features, dtype=np.float64)

    noise = np.random.normal(
        loc=0.0,
        scale=ctx.noise_magnitude,
        size=data.shape,
    )

    return EncryptedVector(
        _data=data,
        _noise=noise,
        is_encrypted=True,
        scheme="CKKS",
        size=len(features),
    )


def decrypt_vector(enc_vec: EncryptedVector) -> list[float]:
    """
    Decrypt a simulated CKKS ciphertext back into plaintext.
    """

    if not enc_vec.is_encrypted:
        raise ValueError("Input is not an encrypted vector.")

    result = enc_vec.data_with_noise

    return result.tolist()