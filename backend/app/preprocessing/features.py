"""
Feature preprocessing for fraud detection.

The trained model expects 30 features:
- Index 0: Time
- Index 1-28: V1-V28
- Index 29: Amount

The API receives raw transaction fields, so risk-informed synthetic
features are constructed for V1-V28.
"""

import json
import math
import os
from typing import Optional

import numpy as np


# Scaler parameters
WEIGHTS_DIR = os.path.join(
    os.path.dirname(__file__),
    "..",
    "he",
    "model_weights",
)

_scaler_mean: Optional[np.ndarray] = None
_scaler_scale: Optional[np.ndarray] = None
_n_features: int = 30


def _load_scaler():
    """Load scaler parameters exported by the ML pipeline."""
    global _scaler_mean, _scaler_scale, _n_features

    scaler_path = os.path.join(WEIGHTS_DIR, "scaler_params.json")

    if os.path.exists(scaler_path):
        with open(scaler_path, "r") as file:
            params = json.load(file)

        _scaler_mean = np.array(params["mean"])
        _scaler_scale = np.array(params["scale"])
        _n_features = params["n_features"]
    else:
        _scaler_mean = np.zeros(_n_features)
        _scaler_scale = np.ones(_n_features)


_load_scaler()


# Risk signals
MERCHANT_RISK = {
    "electronics": 0.7,
    "jewelry": 0.8,
    "travel": 0.5,
    "entertainment": 0.3,
    "fashion": 0.4,
    "fuel": 0.2,
    "grocery": 0.1,
    "restaurant": 0.15,
    "healthcare": 0.1,
    "utilities": 0.05,
    "education": 0.05,
    "other": 0.3,
}

TRANSACTION_TYPE_RISK = {
    "online": 0.6,
    "transfer": 0.5,
    "atm": 0.3,
    "pos": 0.1,
    "other": 0.3,
}

LOCATION_RISK = {
    "mumbai": 0.2,
    "delhi": 0.25,
    "bangalore": 0.15,
    "chennai": 0.2,
    "hyderabad": 0.15,
    "kolkata": 0.2,
    "pune": 0.15,
    "ahmedabad": 0.15,
    "jaipur": 0.2,
    "other": 0.3,
}


def _parse_hour(time_str: str) -> float:
    """Extract hour from formats such as '02:17 AM' or '14:30'."""
    time_str = time_str.strip().upper()

    try:
        is_pm = "PM" in time_str
        is_am = "AM" in time_str

        parts = (
            time_str.replace("AM", "")
            .replace("PM", "")
            .strip()
            .split(":")
        )

        hour = int(parts[0])
        minute = int(parts[1]) if len(parts) > 1 else 0

        if is_pm and hour != 12:
            hour += 12
        elif is_am and hour == 12:
            hour = 0

        return hour + minute / 60.0

    except (ValueError, IndexError):
        return 12.0


def _time_risk(hour: float) -> float:
    """Late-night and early-morning transactions are riskier."""
    if hour < 5 or hour >= 23:
        return 0.8
    elif hour < 7 or hour >= 21:
        return 0.4

    return 0.1


def _amount_risk(amount: float) -> float:
    """Calculate amount risk using a soft sigmoid curve."""
    return 1.0 / (1.0 + math.exp(-(amount - 20000) / 10000))


def extract_features(transaction: dict) -> list[float]:
    """
    Convert a raw transaction into a 30-dimensional feature vector.
    """

    amount = float(transaction.get("amount", 0.0))

    merchant = str(
        transaction.get("merchant_category", "other")
    ).lower()

    txn_type = str(
        transaction.get("transaction_type", "other")
    ).lower()

    location = str(
        transaction.get("location", "other")
    ).lower()

    time_str = str(transaction.get("time", "12:00"))

    hour = _parse_hour(time_str)

    # Risk signals
    merchant_risk = MERCHANT_RISK.get(merchant, 0.3)
    txn_type_risk = TRANSACTION_TYPE_RISK.get(txn_type, 0.3)
    location_risk = LOCATION_RISK.get(location, 0.3)
    time_risk = _time_risk(hour)
    amt_risk = _amount_risk(amount)

    combined_risk = (
        0.25 * merchant_risk
        + 0.20 * txn_type_risk
        + 0.10 * location_risk
        + 0.25 * time_risk
        + 0.20 * amt_risk
    )

    # Build 30-dimensional vector
    features = np.zeros(_n_features, dtype=np.float64)

    # Time
    features[0] = hour * 3600

    # Amount
    features[29] = amount

    # Synthetic V1-V28 features
    if _scaler_scale is not None:
        for i in range(1, 29):

            if i % 5 == 1:
                signal = combined_risk * 2 - 1

            elif i % 5 == 2:
                signal = (amt_risk - 0.5) * 2

            elif i % 5 == 3:
                signal = (time_risk - 0.3) * 2

            elif i % 5 == 4:
                signal = (merchant_risk - 0.3) * 1.5

            else:
                signal = (txn_type_risk - 0.3) * 1.5

            features[i] = (
                _scaler_mean[i]
                + signal * _scaler_scale[i]
            )

    # Apply training scaler
    if _scaler_mean is not None and _scaler_scale is not None:
        safe_scale = np.where(
            _scaler_scale == 0,
            1.0,
            _scaler_scale,
        )

        features = (
            features - _scaler_mean
        ) / safe_scale

    return features.tolist()