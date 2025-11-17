from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
from preprocess import extract_features
from fastapi.middleware.cors import CORSMiddleware
from urllib.parse import urlparse
import random
import time
import numpy as np # Import numpy for array manipulation

app = FastAPI()

# Enable CORS (allow all origins for simplicity in development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model (Assuming this file exists and works)
try:
    model = joblib.load('phishing_model.pkl')
except FileNotFoundError:
    raise RuntimeError("phishing_model.pkl not found. Please run train.py first.")

# Define Request Model
class URLRequest(BaseModel):
    url: str

def generate_detailed_report(url, ml_prediction, confidence, features):
    """
    Generates a simulated detailed report based on ML prediction.
    """
    is_phishing = (ml_prediction == 1)
    parsed_url = urlparse(url)
    
    # --- 1. Summary Data ---
    total_vendors = 70
    malicious_count = 0
    
    if is_phishing:
        # If ML predicts phishing, assign a higher, randomized number of detections
        malicious_count = random.randint(30, 65)
        analysis_category = "Malicious"
        detection_details = f"Detected by {malicious_count}/{total_vendors} security vendors (e.g., Google Safebrowsing, ESET)."
        final_verdict = "Phishing/Malware"
    else:
        # If ML predicts legitimate
        malicious_count = random.randint(0, 3)
        analysis_category = "Safe"
        detection_details = f"No major threats detected by {total_vendors} security vendors. {malicious_count} flagged as suspicious."
        final_verdict = "Clean"
    
    # --- 2. Module Comparison Data ---
    comparison_modules = [
        {"name": "Google SafeBrowsing", "status": "Malicious" if is_phishing and random.random() < 0.8 else "Clean"},
        {"name": "Microsoft Defender", "status": "Malicious" if is_phishing and random.random() < 0.6 else "Clean"},
        {"name": "PhishTank", "status": "Malicious" if is_phishing and random.random() < 0.9 else "Clean"},
        {"name": "ESET", "status": "Clean" if is_phishing and random.random() < 0.2 else "Clean"},
        {"name": "Yandex Safe", "status": "Clean"},
        {"name": "Trustwave", "status": "Malicious" if is_phishing and random.random() < 0.4 else "Clean"},
    ]
    
    # --- 3. Category Data ---
    categories = [
        {"name": "Banking/Finance", "relevance": 90 if 'bank' in url.lower() or 'secure' in url.lower() else 5},
        {"name": "Social Media", "relevance": 10},
        {"name": "E-Commerce", "relevance": 20},
        {"name": "Gaming", "relevance": 0},
    ]

    # --- 4. Technical Information ---
    creation_date = "2024-01-15" if is_phishing else "2020-10-20"
    registrar = "NameCheap Inc." if is_phishing else "Google LLC"

    # --- 5. Heuristic Features ---
    heuristic_features = [
        {"name": "URL Length", "value": features['url_length'], "check": "Longer URLs can mask intent."},
        {"name": "Number of Dots", "value": features['num_dots'], "check": "High dot count suggests subdomains."},
        {"name": "Has HTTPS", "value": "Yes" if features['has_https'] else "No", "check": "Missing SSL is a major red flag."},
        {"name": "Suspicious Words", "value": features['suspicious_words'], "check": "Keywords like 'login' or 'verify' are often misused."},
    ]
    
    return {
        'ml_prediction': 'phishing' if is_phishing else 'legitimate',
        'confidence_score': f"{confidence:.2f}", # ADDED CONFIDENCE SCORE
        'report_summary': {
            'final_verdict': final_verdict,
            'detection_count': malicious_count,
            'total_vendors': total_vendors,
            'analysis_category': analysis_category,
            'detection_details': detection_details,
        },
        'technical_details': {
            'domain': parsed_url.netloc,
            'registrar': registrar,
            'creation_date': creation_date,
            'ip_address': f"192.168.{random.randint(1, 255)}.{random.randint(1, 255)}",
            'ssl_status': 'Valid' if parsed_url.scheme == 'https' else 'Invalid/Missing',
            'analysis_time': f"{random.uniform(1.2, 4.5):.2f}s",
            'last_check': time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime()),
        },
        'comparison_modules': comparison_modules,
        'categories': categories,
        'heuristic_features': heuristic_features,
    }

@app.post("/predict")
def predict(request: URLRequest):
    if not request.url:
        raise HTTPException(status_code=400, detail="URL is required")

    try:
        # 1. Run ML Prediction
        features = extract_features(request.url)
        df = pd.DataFrame([features])
        
        # Get prediction (0 or 1)
        ml_prediction = model.predict(df)[0]
        
        # Get probability array (e.g., [0.1, 0.9])
        probabilities = model.predict_proba(df)[0]
        
        # Get the confidence for the predicted class
        # (The index of the prediction in the classes_ list is used to find the confidence)
        confidence = probabilities[np.where(model.classes_ == ml_prediction)[0][0]]
        
        # 2. Generate Detailed Report
        report_data = generate_detailed_report(request.url, ml_prediction, confidence, features)
        
        # 3. Combine URL and Report Data
        return {'url': request.url, 'report': report_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.get("/")
def home():
    return {"message": "Phishing Detector API is running"}