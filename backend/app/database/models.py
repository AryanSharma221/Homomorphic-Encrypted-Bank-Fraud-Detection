from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func

from app.database.database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String, unique=True, index=True, nullable=False)
    amount = Column(Float, nullable=False)
    transaction_type = Column(String, nullable=False)
    merchant_category = Column(String, nullable=False)
    location = Column(String, nullable=False)
    time = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class FraudPrediction(Base):
    __tablename__ = "fraud_predictions"

    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String, index=True, nullable=False)
    fraud_score = Column(Float, nullable=False)
    risk_level = Column(String, nullable=False)
    decision = Column(String, nullable=False)
    model_version = Column(String, default="v1.0-student-poly")
    created_at = Column(DateTime(timezone=True), server_default=func.now())