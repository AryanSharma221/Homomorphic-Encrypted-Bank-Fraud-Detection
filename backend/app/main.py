from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import transactions, fraud
from app.api.dashboard.metrics import router as dashboard_router
from app.database import models, database


# Create database tables
models.Base.metadata.create_all(bind=database.engine)


# Create FastAPI application
app = FastAPI(
    title="Privacy-Preserving Bank Fraud Detection API",
    description=(
        "Backend for analyzing bank transactions using "
        "Homomorphic Encryption and Knowledge Distillation."
    ),
    version="1.0.0",
)


# Allow requests from the Next.js frontend during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# API routers
app.include_router(
    transactions.router,
    prefix="/api/transactions",
    tags=["Transactions"],
)

app.include_router(
    fraud.router,
    prefix="/api/fraud",
    tags=["Fraud Alerts"],
)

app.include_router(
    dashboard_router,
    prefix="/api/dashboard",
    tags=["Dashboard"],
)


# Health-check endpoint
@app.get("/")
def read_root():
    return {
        "message": "Privacy-Preserving Bank Fraud Detection API is running"
    }