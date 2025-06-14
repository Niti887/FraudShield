from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from typing import Optional, List, Dict
import logging
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from .models.database import get_db, Transaction, Prediction
from sqlalchemy import func

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="FraudShield API",
    description="Real-time credit card fraud detection system",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class Transaction(BaseModel):
    amount: float
    timestamp: str
    merchant_id: str
    card_number: str
    transaction_type: str
    location: Optional[str] = None
    additional_data: Optional[dict] = None

class FraudPrediction(BaseModel):
    transaction_id: str
    fraud_probability: float
    is_fraud: bool
    risk_score: float
    explanation: List[str]

class DashboardStats(BaseModel):
    totalTransactions: int
    fraudCount: int
    legitimateCount: int
    averageRiskScore: float

class Alert(BaseModel):
    id: int
    transaction_id: str
    amount: float
    timestamp: datetime
    is_fraud: bool
    risk_score: float
    explanation: List[str]

@app.get("/")
async def root():
    return {"message": "Welcome to FraudShield API"}

@app.post("/api/check-transaction", response_model=FraudPrediction)
async def check_transaction(transaction: Transaction, db: Session = Depends(get_db)):
    try:
        # TODO: Implement fraud detection logic
        # This is a placeholder response
        prediction = FraudPrediction(
            transaction_id="123",
            fraud_probability=0.05,
            is_fraud=False,
            risk_score=0.05,
            explanation=["Transaction amount is within normal range"]
        )
        
        # Store transaction and prediction in database
        db_transaction = Transaction(
            transaction_id=prediction.transaction_id,
            amount=transaction.amount,
            timestamp=datetime.fromisoformat(transaction.timestamp),
            merchant_id=transaction.merchant_id,
            card_number=transaction.card_number,
            transaction_type=transaction.transaction_type,
            location=transaction.location,
            additional_data=transaction.additional_data
        )
        
        db_prediction = Prediction(
            transaction_id=prediction.transaction_id,
            fraud_probability=prediction.fraud_probability,
            is_fraud=prediction.is_fraud,
            risk_score=prediction.risk_score,
            explanation=prediction.explanation
        )
        
        db.add(db_transaction)
        db.add(db_prediction)
        db.commit()
        
        return prediction
    except Exception as e:
        logger.error(f"Error processing transaction: {str(e)}")
        raise HTTPException(status_code=500, detail="Error processing transaction")

@app.get("/api/dashboard-stats", response_model=DashboardStats)
async def get_dashboard_stats(db: Session = Depends(get_db)):
    try:
        # Get total transactions
        total_transactions = db.query(Transaction).count()
        
        # Get fraud count
        fraud_count = db.query(Prediction).filter(Prediction.is_fraud == True).count()
        
        # Get legitimate count
        legitimate_count = db.query(Prediction).filter(Prediction.is_fraud == False).count()
        
        # Calculate average risk score
        avg_risk_score = db.query(Prediction).with_entities(
            func.avg(Prediction.risk_score)
        ).scalar() or 0.0
        
        return DashboardStats(
            totalTransactions=total_transactions,
            fraudCount=fraud_count,
            legitimateCount=legitimate_count,
            averageRiskScore=avg_risk_score
        )
    except Exception as e:
        logger.error(f"Error fetching dashboard stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching dashboard stats")

@app.get("/api/alerts", response_model=List[Alert])
async def get_alerts(db: Session = Depends(get_db)):
    try:
        # Get recent predictions with their associated transactions
        recent_predictions = (
            db.query(Prediction, Transaction)
            .join(Transaction, Prediction.transaction_id == Transaction.transaction_id)
            .order_by(Prediction.created_at.desc())
            .limit(50)
            .all()
        )
        
        alerts = []
        for prediction, transaction in recent_predictions:
            alerts.append(Alert(
                id=prediction.id,
                transaction_id=prediction.transaction_id,
                amount=transaction.amount,
                timestamp=transaction.timestamp,
                is_fraud=prediction.is_fraud,
                risk_score=prediction.risk_score,
                explanation=prediction.explanation
            ))
        
        return alerts
    except Exception as e:
        logger.error(f"Error fetching alerts: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching alerts")

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 