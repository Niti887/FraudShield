from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost/fraudshield")

# Create SQLAlchemy engine and session
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String, unique=True, index=True)
    amount = Column(Float)
    timestamp = Column(DateTime)
    merchant_id = Column(String)
    card_number = Column(String)
    transaction_type = Column(String)
    location = Column(String, nullable=True)
    additional_data = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String, unique=True, index=True)
    fraud_probability = Column(Float)
    is_fraud = Column(Boolean)
    risk_score = Column(Float)
    explanation = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create tables
def create_tables():
    Base.metadata.create_all(bind=engine) 