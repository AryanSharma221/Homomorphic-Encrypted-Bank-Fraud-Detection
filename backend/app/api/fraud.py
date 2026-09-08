from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import database, models


router = APIRouter()


@router.get("/alerts")
def get_fraud_alerts(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(database.get_db),
):
    """
    Return fraud predictions for the fraud alerts dashboard.

    Results are ordered from newest to oldest.
    """

    alerts = (
        db.query(models.FraudPrediction)
        .order_by(models.FraudPrediction.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    return alerts