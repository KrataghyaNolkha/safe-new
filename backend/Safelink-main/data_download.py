import requests
import pandas as pd
import os

# URL to a public phishing dataset (example: Phishing Websites Dataset from UCI)
# Note: This is a placeholder; replace with actual dataset URL if needed
DATASET_URL = 'https://archive.ics.uci.edu/ml/machine-learning-databases/00327/Training%20Dataset.arff'
# Actually, UCI has ARFF, but for CSV, let's use a different one.

# Better: Use a CSV dataset. Let's use one from GitHub or similar.
# For example, a dataset from https://github.com/shreyagopal/Phishing-Website-Detection-by-Machine-Learning-Techniques
# But to make it work, I'll create a sample dataset for demonstration.

def download_dataset():
    # For this example, we'll create a sample dataset since direct download might require authentication.
    # In real scenario, use a public CSV.

    # Sample data
    data = {
        'url': [
            'http://example.com',
            'http://phishing-site.com/login',
            'https://secure-bank.com',
            'http://fake-bank.net',            'https://google.com',
            'http://malicious-site.org'
        ],
        'label': [0, 1, 0, 1, 0, 1]  # 0: legitimate, 1: phishing
    }
    df = pd.DataFrame(data)
    df.to_csv('phishing_dataset.csv', index=False)
    print("Sample dataset created: phishing_dataset.csv")

if __name__ == "__main__":
    download_dataset()
