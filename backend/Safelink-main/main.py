from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
from preprocess import extract_features # Ensure this file exists
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
model = joblib.load('phishing_model.pkl')

# Define Request Model
class URLRequest(BaseModel):
    url: str

@app.post("/predict")
def predict(request: URLRequest):
    if not request.url:
        raise HTTPException(status_code=400, detail="URL is required")

    try:
        features = extract_features(request.url)
        df = pd.DataFrame([features])
        prediction = model.predict(df)[0]
        result = 'phishing' if prediction == 1 else 'legitimate'
        return {'url': request.url, 'prediction': result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def home():
    return {"message": "Phishing Detector API is running"}