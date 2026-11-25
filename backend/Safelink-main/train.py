import argparse
import joblib
import pandas as pd
import numpy as np
import time
from scipy.sparse import hstack
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

# Ensure preprocess.py is in the same folder
try:
    from preprocess import extract_features
except ImportError:
    print("Error: 'preprocess.py' not found. Please ensure it exists.")
    exit(1)

def load_and_normalize_data(data_path):
    """
    Loads data and normalizes column names and labels.
    Handles 'URL' vs 'url' and 'good'/'bad' vs 0/1.
    """
    print(f"📖 Reading {data_path}...")
    try:
        df = pd.read_csv(data_path)
    except Exception as e:
        print(f"❌ Error reading CSV: {e}")
        exit(1)

    # 1. Normalize Column Names (lowercase everything)
    df.columns = [c.lower().strip() for c in df.columns]
    
    # Check if we have the right columns
    if 'url' not in df.columns or 'label' not in df.columns:
        print(f"❌ Error: Dataset must contain 'URL' and 'Label' columns.")
        print(f"   Found columns: {df.columns.tolist()}")
        exit(1)

    # 2. Map Labels (good -> 0, bad -> 1)
    # We check the first few rows to see if mapping is needed
    unique_labels = df['label'].unique()
    print(f"🔎 Found labels: {unique_labels}")
    
    if 'good' in unique_labels or 'bad' in unique_labels:
        print("🔄 Mapping 'good'/'bad' text labels to 0/1...")
        label_map = {'good': 0, 'bad': 1, 'legitimate': 0, 'phishing': 1}
        df['label'] = df['label'].map(label_map)
        
        # Drop rows where label conversion failed (e.g. headers inside data)
        if df['label'].isnull().any():
            print(f"⚠️ Warning: Dropped {df['label'].isnull().sum()} rows with unknown labels.")
            df = df.dropna(subset=['label'])
            df['label'] = df['label'].astype(int)

    # 3. Drop Duplicates
    initial_len = len(df)
    df.drop_duplicates(subset='url', inplace=True)
    if len(df) < initial_len:
        print(f"🧹 Removed {initial_len - len(df)} duplicate URLs.")

    return df

def get_feature_names_dynamic():
    dummy_url = "http://google.com"
    features = extract_features(dummy_url)
    return sorted([k for k in features.keys() if k != 'url'])

def url_lexical_matrix(urls, feature_order):
    print("➡️ Extracting lexical features...")
    time_start = time.time()
    rows = []
    total = len(urls)
    
    for i, u in enumerate(urls):
        try:
            feats = extract_features(u)
            row = [feats.get(k, 0) for k in feature_order]
            rows.append(row)
        except Exception:
            # Fallback for empty/malformed URLs
            rows.append([0] * len(feature_order))

        if (i + 1) % 10000 == 0:
            print(f"   Processed {i+1}/{total} URLs...")

    print(f"✔️ Lexical feature extraction complete in {time.time() - time_start:.2f}s")
    return np.array(rows, dtype=float)

def train_and_save(data_path, model_path, test_size=0.2, random_state=42):
    print("\n========================")
    print("📂 PREPARING DATA")
    print("========================")

    df = load_and_normalize_data(data_path)
    print(f"✔️ Final dataset: {len(df)} rows")
    
    X_urls = df['url'].tolist()
    y = df['label'].values

    print("\n========================")
    print("🧠 TF-IDF VECTORIZATION")
    print("========================")

    tfidf = TfidfVectorizer(analyzer='char_wb', ngram_range=(3,5), max_features=5000)
    t0 = time.time()
    X_tfidf = tfidf.fit_transform(X_urls)
    print(f"✔️ TF-IDF fit complete in {time.time() - t0:.2f}s")

    print("\n==============================")
    print("🔣 GENERATING LEXICAL FEATURES")
    print("==============================")

    feature_names = get_feature_names_dynamic()
    X_lex = url_lexical_matrix(X_urls, feature_names)

    print("\n========================")
    print("🔗 COMBINING FEATURES")
    print("========================")

    X_all = hstack([X_tfidf, X_lex]).tocsr()
    print(f"✔️ Feature matrix: {X_all.shape}")

    print("\n========================")
    print("🏋️ TRAINING MODEL")
    print("========================")

    indices = list(range(X_all.shape[0]))
    train_idx, test_idx, y_train, y_test = train_test_split(
        indices, y, test_size=test_size, random_state=random_state, stratify=y
    )
    
    X_train, X_test = X_all[train_idx], X_all[test_idx]

    clf = RandomForestClassifier(n_estimators=100, random_state=random_state, n_jobs=-1)
    
    t0 = time.time()
    clf.fit(X_train, y_train)
    print(f"✔️ Training complete in {time.time() - t0:.2f}s")

    print("\n========================")
    print("📊 EVALUATION")
    print("========================")
    y_pred = clf.predict(X_test)
    print(f"✔️ Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print(classification_report(y_test, y_pred, target_names=['Legitimate', 'Phishing'], digits=4))

    print("\n========================")
    print("💾 SAVING PIPELINE")
    print("========================")
    
    joblib.dump({
        "tfidf": tfidf,
        "clf": clf,
        "feature_names": feature_names
    }, model_path)
    print(f"✔️ Saved to {model_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", "-d", default="phishing_dataset.csv") 
    parser.add_argument("--out", "-o", default="phishing_pipeline.pkl")
    args = parser.parse_args()

    train_and_save(args.data, args.out)
    