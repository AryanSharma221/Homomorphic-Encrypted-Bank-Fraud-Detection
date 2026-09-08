from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import database, models


router = APIRouter()


@router.get("/metrics")
def get_dashboard_metrics(
    db: Session = Depends(database.get_db),
):
    total_transactions = (
        db.query(models.Transaction).count()
    )

    transactions_analyzed = (
        db.query(models.FraudPrediction).count()
    )

    fraud_detected = (
        db.query(models.FraudPrediction)
        .filter(
            models.FraudPrediction.risk_level.in_(
                ["MEDIUM", "HIGH"]
            )
        )
        .count()
    )

    high_risk_transactions = (
        db.query(models.FraudPrediction)
        .filter(
            models.FraudPrediction.risk_level == "HIGH"
        )
        .count()
    )

    return {
        "totalTransactions": total_transactions,
        "transactionsAnalyzed": transactions_analyzed,
        "fraudDetected": fraud_detected,
        "highRiskTransactions": high_risk_transactions,
    }