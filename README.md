# FraudShield - Real-time Credit Card Fraud Detection System

FraudShield is a full-stack web application that uses machine learning to detect and flag potentially fraudulent credit card transactions in real-time. The system analyzes transaction patterns and provides risk scores with explanations for suspicious activities.

## Features

- Real-time transaction monitoring and fraud detection
- Machine learning models for pattern recognition
- Interactive dashboard with visualizations
- Risk scoring and explanation of predictions
- Transaction history and audit logging
- Role-based access control
- Batch processing capabilities

## Tech Stack

### Backend
- C++
- FastAPI (Python web framework)
- Scikit-learn, XGBoost (Machine Learning)
- PostgreSQL (Database)
- SQLAlchemy (ORM)

### Frontend
- React.js
- Tailwind CSS
- Chart.js
- Axios

## Project Structure

```
fraudshield/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── utils/
│   │   └── data/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── styles/
│   └── package.json
└── docs/
```

## Setup Instructions

### Backend Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run the backend server:
```bash
uvicorn app.main:app --reload
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm start
```

## API Documentation

Once the backend server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
