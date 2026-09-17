from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os
import uuid

app = FastAPI()

# Allow requests from your deployed Render frontend & local testing
origins = [
    "https://data-mining-1.onrender.com",  # Your Render frontend URL
    "http://localhost:5173",               # Vite local dev
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMP_DIR = "/tmp/data_mining"
os.makedirs(TEMP_DIR, exist_ok=True)

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        session_id = str(uuid.uuid4())
        file_path = os.path.join(TEMP_DIR, f"{session_id}.csv")
        
        df = pd.read_csv(file.file)
        df.to_csv(file_path, index=False)
        
        return {"status": "success", "session_id": session_id, "filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/clean")
async def clean_data(data: dict):
    session_id = data.get("session_id")
    if not session_id:
        raise HTTPException(status_code=400, detail="session_id is required")
        
    file_path = os.path.join(TEMP_DIR, f"{session_id}.csv")
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Dataset not found. Please re-upload your file.")
        
    df = pd.read_csv(file_path)
    
    # Perform your data cleaning operations on `df` here
    # Example: df.fillna(0, inplace=True)
    
    df.to_csv(file_path, index=False)
    return {"status": "success", "message": "Data cleaned successfully"}