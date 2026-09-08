from pydantic import BaseModel
from pydantic import BaseModel, ConfigDict


class TransactionBase(BaseModel):
    amount: float
    transaction_type: str
    merchant_category: str
    location: str
    time: str


class TransactionCreate(TransactionBase):
    pass


class TransactionResponse(TransactionBase):
    id: int
    transaction_id: str

    model_config = ConfigDict(from_attributes=True)
    

class FraudAnalysisResponse(BaseModel):
    transaction_id: str
    fraud_score: float
    risk_level: str
    decision: str
