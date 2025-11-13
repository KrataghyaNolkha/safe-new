import sys
import pandas as pd
import joblib
from preprocess import extract_features

def predict_url(url, model_file='phishing_model.pkl'):
    model = joblib.load(model_file)
    features = extract_features(url)
    df = pd.DataFrame([features])
    prediction = model.predict(df)[0]
    if prediction == 1:
        print(f"The URL '{url}' is predicted as a PHISHING website.")
    else:
        print(f"The URL '{url}' is predicted as a LEGITIMATE website.")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python predict.py <url>")
        sys.exit(1)
    url = sys.argv[1]
    predict_url(url)
