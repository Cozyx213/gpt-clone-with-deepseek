#!/bin/bash

# Activate the virtual environment
source venv/scripts/activate

# Start the backend
python3 app.py &

# Change to the frontend directory
cd frontend

# Start the frontend
npm run dev
