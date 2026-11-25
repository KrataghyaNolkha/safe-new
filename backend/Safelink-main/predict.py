import sys
import joblib
import pandas as pd
import numpy as np
from urllib.parse import urlparse
from preprocess import extract_features, generate_explanation
from scipy.sparse import hstack

# 1. Define a Whitelist for immediate safety
# These domains will bypass the model entirely to prevent false positives.
WHITELIST_DOMAINS = {
    'google.com', 'www.google.com', 'youtube.com', 'www.youtube.com',
    'facebook.com', 'www.facebook.com', 'amazon.com', 'www.amazon.com',
    'wikipedia.org', 'www.wikipedia.org', 'instagram.com', 'www.instagram.com',
    'linkedin.com', 'www.linkedin.com', 'twitter.com', 'www.twitter.com'
}

def url_lexical_matrix_single(url):
    # NOTE: This [1:] slice assumes your extract_features() returns 
    # the URL string as the very first value. If it only returns numbers, 
    # remove the [1:] slice.
    feats = list(extract_features(url).values())[1:] 
    return np.array(feats, dtype=float).reshape(1, -1)

def predict_url(url, model_file='phishing_pipeline.pkl'):
    # --- STEP 1: Whitelist Check (The Fix) ---
    try:
        domain = urlparse(url).netloc.lower()
        # Handle cases like "google.com" vs "www.google.com"
        if domain in WHITELIST_DOMAINS:
            print(f"URL: {url}")
            print("Prediction: legitimate")
            print("Explanation: This URL is on the global whitelist of trusted domains.")
            return # Stop here, do not run the model
    except Exception:
        pass # If url parsing fails, fall through to the model

    # --- STEP 2: Model Prediction ---
    try:
        package = joblib.load(model_file)
        tfidf = package['tfidf']
        clf = package['clf']

        # tfidf vector
        X_tfidf = tfidf.transform([url])
        
        # lexical numeric vector
        X_lex = url_lexical_matrix_single(url)
        
        # combine
        X_comb = hstack([X_tfidf, X_lex])
        
        pred = clf.predict(X_comb)[0]
        label = 'phishing' if pred == 1 else 'legitimate'
        
        # --- STEP 3: Explanation ---
        features = extract_features(url)
        explanation = generate_explanation(features, label)
        
        print(f"URL: {url}")
        print(f"Prediction: {label}")
        print(f"Explanation: {explanation}")

    except FileNotFoundError:
        print(f"Error: Could not find model file '{model_file}'.")
        print("Please ensure you have trained the model and saved it as a dictionary containing 'clf' and 'tfidf'.")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python predict.py <url>")
        sys.exit(1)
    predict_url(sys.argv[1])