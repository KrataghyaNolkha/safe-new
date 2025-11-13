import pandas as pd
from urllib.parse import urlparse
import re

def extract_features(url):
    features = {}
    parsed = urlparse(url)
    features['url_length'] = len(url)
    features['num_dots'] = url.count('.')
    features['num_slashes'] = url.count('/')
    features['has_https'] = 1 if parsed.scheme == 'https' else 0
    features['domain_length'] = len(parsed.netloc)
    features['num_hyphens'] = url.count('-')
    features['num_digits'] = sum(c.isdigit() for c in url)
    features['num_special_chars'] = len(re.findall(r'[^a-zA-Z0-9]', url))
    suspicious_words = ['login', 'secure', 'account', 'update', 'bank', 'password', 'verify']
    features['suspicious_words'] = sum(1 for word in suspicious_words if word in url.lower())
    return features

def preprocess_data(input_file='phishing_dataset.csv', output_file='processed_dataset.csv'):
    df = pd.read_csv(input_file)
    feature_list = []
    for url in df['url']:
        features = extract_features(url)
        feature_list.append(features)
    features_df = pd.DataFrame(feature_list)
    processed_df = pd.concat([features_df, df['label']], axis=1)
    processed_df.to_csv(output_file, index=False)
    print(f"Processed data saved to {output_file}")

if __name__ == "__main__":
    preprocess_data()
