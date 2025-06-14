#!/bin/bash

# Create and activate virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
pip install -r requirements.txt

# Initialize database
echo "Initializing database..."
python -m app.init_db

# Start backend server in the background
echo "Starting backend server..."
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd ../frontend
npm install

# Start frontend development server
echo "Starting frontend server..."
npm start

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT 