import traceback
import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import database, models
from app.he.encryption import encrypt_features
from app.he.inference import decrypt_prediction, run_encrypted_inference
from app.models import schemas
from app.preprocessing.features import extract_features


router = APIRouter()


def evaluate_risk(score: float):
    """
    Map the fraud score to a risk level and decision.
    """
    if score > 0.7:
        return "HIGH", "FLAGGED"
    elif score > 0.3:
        return "MEDIUM", "REVIEW"

    return "LOW", "APPROVED"


@router.post(
    "/analyze",
    response_model=schemas.FraudAnalysisResponse,
)
def analyze_transaction(
    txn: schemas.TransactionCreate,
    db: Session = Depends(database.get_db),
):
    """
    Run the complete privacy-preserving fraud detection pipeline:

    Raw Transaction
        ↓
    Feature Extraction
        ↓
    Homomorphic Encryption
        ↓
    Encrypted ML Inference
        ↓
    Decryption
        ↓
    Risk Evaluation
        ↓
    Database Storage
    """

    transaction_id = f"TXN-{uuid.uuid4().hex[:8].upper()}"

    # ---------------------------------------------------------
    # 1. Feature extraction
    # ---------------------------------------------------------
    try:
        features = extract_features(txn.model_dump())
    except Exception as exc:
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=f"Feature extraction failed: {str(exc)}",
        )

    # ---------------------------------------------------------
    # 2. Homomorphic encryption
    # ---------------------------------------------------------
    try:
        encrypted_features = encrypt_features(features)
    except Exception as exc:
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=f"Feature encryption failed: {str(exc)}",
        )

    # ---------------------------------------------------------
    # 3. Encrypted ML inference
    # ---------------------------------------------------------
    try:
        encrypted_score = run_encrypted_inference(encrypted_features)
    except Exception as exc:
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=f"Encrypted inference failed: {str(exc)}",
        )

    # ---------------------------------------------------------
    # 4. Decrypt prediction
    # ---------------------------------------------------------
    try:
        fraud_score = float(decrypt_prediction(encrypted_score))
    except Exception as exc:
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=f"Prediction decryption failed: {str(exc)}",
        )

    # ---------------------------------------------------------
    # 5. Evaluate fraud risk
    # ---------------------------------------------------------
    risk_level, decision = evaluate_risk(fraud_score)

    # ---------------------------------------------------------
    # 6. Store transaction and prediction
    # ---------------------------------------------------------
    try:
        db_transaction = models.Transaction(
            transaction_id=transaction_id,
            amount=txn.amount,
            transaction_type=txn.transaction_type,
            merchant_category=txn.merchant_category,
            location=txn.location,
            time=txn.time,
        )

        db_prediction = models.FraudPrediction(
            transaction_id=transaction_id,
            fraud_score=fraud_score,
            risk_level=risk_level,
            decision=decision,
        )

        db.add(db_transaction)
        db.add(db_prediction)

        db.commit()

    except Exception as exc:
        db.rollback()
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=f"Database commit failed: {str(exc)}",
        )

    # ---------------------------------------------------------
    # 7. Return result to frontend
    # ---------------------------------------------------------
    return {
        "transaction_id": transaction_id,
        "fraud_score": fraud_score,
        "risk_level": risk_level,
        "decision": decision,
    }


@router.get(
    "/",
    response_model=list[schemas.TransactionResponse],
)
def get_transactions(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(database.get_db),
):
    """
    Retrieve stored transactions.
    """

    transactions = (
        db.query(models.Transaction)
        .offset(skip)
        .limit(limit)
        .all()
    )

    return transactions