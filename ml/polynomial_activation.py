"""
Polynomial Activation Functions for HE-Compatible Neural Networks.

Standard activations like ReLU use comparisons (max(0, x)) which are
expensive or infeasible under Homomorphic Encryption. Polynomial
activations can be evaluated using only additions and multiplications,
making them naturally compatible with HE schemes like CKKS.
"""

import torch
import torch.nn as nn


class SquareActivation(nn.Module):
    """
    Simplest HE-compatible activation: f(x) = x^2
    Only requires one multiplication — minimal multiplicative depth.
    """

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return x * x


class Poly2Activation(nn.Module):
    """
    Degree-2 polynomial activation: f(x) = a0 + a1*x + a2*x^2
    Initialized to approximate ReLU around [-5, 5].
    Coefficients are learnable so the network can fine-tune them during training.
    """

    def __init__(self):
        super().__init__()
        # Least-squares fit of ReLU on [-5, 5]
        self.a0 = nn.Parameter(torch.tensor(0.50))
        self.a1 = nn.Parameter(torch.tensor(0.50))
        self.a2 = nn.Parameter(torch.tensor(0.10))

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.a0 + self.a1 * x + self.a2 * x * x


class Poly3Activation(nn.Module):
    """
    Degree-3 polynomial activation: f(x) = a0 + a1*x + a2*x^2 + a3*x^3
    Higher degree allows a closer approximation of ReLU but increases
    multiplicative depth under HE (x^3 = x * x * x requires depth 2).
    """

    def __init__(self):
        super().__init__()
        self.a0 = nn.Parameter(torch.tensor(0.00))
        self.a1 = nn.Parameter(torch.tensor(0.50))
        self.a2 = nn.Parameter(torch.tensor(0.125))
        self.a3 = nn.Parameter(torch.tensor(0.02))

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x2 = x * x
        x3 = x2 * x
        return self.a0 + self.a1 * x + self.a2 * x2 + self.a3 * x3


class Poly4Activation(nn.Module):
    """
    Degree-4 polynomial activation.
    Even closer ReLU approximation, but multiplicative depth of 2
    (x^4 = (x^2)^2 can be computed in depth 2 via squaring).
    """

    def __init__(self):
        super().__init__()
        self.a0 = nn.Parameter(torch.tensor(0.10))
        self.a1 = nn.Parameter(torch.tensor(0.50))
        self.a2 = nn.Parameter(torch.tensor(0.10))
        self.a3 = nn.Parameter(torch.tensor(0.01))
        self.a4 = nn.Parameter(torch.tensor(0.005))

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x2 = x * x
        x3 = x2 * x
        x4 = x2 * x2  # depth-efficient: (x^2)^2
        return self.a0 + self.a1 * x + self.a2 * x2 + self.a3 * x3 + self.a4 * x4


# Registry for easy access
ACTIVATIONS = {
    "relu": nn.ReLU,
    "square": SquareActivation,
    "poly2": Poly2Activation,
    "poly3": Poly3Activation,
    "poly4": Poly4Activation,
}


def get_activation(name: str) -> nn.Module:
    """Get an activation module by name."""
    if name not in ACTIVATIONS:
        raise ValueError(f"Unknown activation '{name}'. Choose from: {list(ACTIVATIONS.keys())}")
    return ACTIVATIONS[name]()
