# preprocess.py
import re
from urllib.parse import urlparse, quote
import numpy as np
import pandas as pd

SUSPICIOUS_WORDS = {
    "login", "secure", "bank", "verify", "update", "account",
    "confirm", "webscr", "signin", "paypal", "billing", "admin",
    "user", "wp-content", "auth", "transaction", "verify", "credential"
}


_ip_regex = re.compile(
    r"(?:(?:http[s]?://)?)(?P<ip>(?:\d{1,3}\.){3}\d{1,3})(?:[:/]|$)"
)

def has_ip(url: str) -> bool:
    return bool(_ip_regex.search(url))

def _safe_urlparse(raw_url: str):
    """
    Try to parse URL. If urlparse raises ValueError (e.g. invalid IPv6),
    do light sanitization (percent-encode '[' and ']') and try again.
    """
    if raw_url is None:
        raw_url = ""
    raw_url = str(raw_url).strip()
    try:
        return urlparse(raw_url if raw_url.startswith(("http://", "https://")) else "http://" + raw_url)
    except ValueError:
        # common culprit: unencoded '[' or ']' in URL -> percent-encode them
        sanitized = raw_url.replace('[', '%5B').replace(']', '%5D')
        try:
            return urlparse(sanitized if sanitized.startswith(("http://", "https://")) else "http://" + sanitized)
        except Exception:
            # Last-resort: parse minimal structure by forcing scheme blank and netloc/path heuristics
            # return a dummy ParseResult-like object (namedtuple would be ideal, but simple dict access below)
            class Dummy:
                def __init__(self, netloc, path, scheme):
                    self.netloc = netloc
                    self.path = path
                    self.scheme = scheme
            # naive split: everything up to first '/' is netloc-ish
            parts = sanitized.split('/', 1)
            netloc = parts[0]
            path = '/' + parts[1] if len(parts) > 1 else ''
            return Dummy(netloc=netloc, path=path, scheme='')

def extract_features(url: str) -> dict:
    """
    Robust lexical feature extractor that handles malformed URLs gracefully.
    """
    if url is None:
        url = ""
    url = str(url).strip()
    parsed = _safe_urlparse(url)
    # parsed may be a `ParseResult` or our Dummy above.
    netloc = parsed.netloc if getattr(parsed, "netloc", "") else parsed.path
    path = parsed.path if getattr(parsed, "path", "") else ""
    scheme = parsed.scheme if getattr(parsed, "scheme", "") else ""

    url_len = len(url)
    netloc_len = len(netloc)
    path_len = len(path)
    num_dots = url.count('.')
    num_hyphens = url.count('-')
    num_digits = sum(c.isdigit() for c in url)
    num_letters = sum(c.isalpha() for c in url)
    num_slashes = url.count('/')
    num_q = url.count('?')
    has_at = 1 if '@' in url else 0
    has_https = 1 if scheme == 'https' or url.lower().startswith('https') else 0
    has_ip_addr = 1 if has_ip(url) else 0
    suspicious_count = sum(1 for w in SUSPICIOUS_WORDS if w in url.lower())
    subdomain_count = max(0, netloc.count('.') - 1)

    return {
        "url": url,
        "url_length": url_len,
        "netloc_length": netloc_len,
        "path_length": path_len,
        "num_dots": num_dots,
        "num_hyphens": num_hyphens,
        "num_digits": num_digits,
        "num_letters": num_letters,
        "num_slashes": num_slashes,
        "num_question_marks": num_q,
        "has_at": has_at,
        "has_https": has_https,
        "has_ip": has_ip_addr,
        "suspicious_words": suspicious_count,
        "subdomain_count": subdomain_count
    }


def generate_explanation(features: dict, prediction_label: str) -> str:
    """
    Build a human-readable explanation from features and final label.
    prediction_label: 'phishing' or 'legitimate'
    """
    reasons = []

    if features.get("has_https", 0) == 0:
        reasons.append("No HTTPS scheme detected (insecure).")

    if features.get("url_length", 0) > 75:
        reasons.append(f"URL is long ({features['url_length']} characters).")

    if features.get("num_dots", 0) > 3:
        reasons.append("Excessive number of dots (possible deceptive subdomains).")

    if features.get("num_digits", 0) > 5:
        reasons.append("Many numerical characters in URL (often suspicious).")

    if features.get("suspicious_words", 0) > 0:
        reasons.append("Contains suspicious keywords (e.g., login, secure, account).")

    if features.get("has_ip", 0) == 1:
        reasons.append("Contains an IP address instead of a domain.")

    if features.get("num_hyphens", 0) > 5:
        reasons.append("Many hyphens in URL (sometimes used to obfuscate).")

    if features.get("subdomain_count", 0) > 2:
        reasons.append("Multiple subdomain levels (could hide the real domain).")

    if prediction_label == "phishing":
        if not reasons:
            return "Flagged as PHISHING based on learned patterns in URL substrings and structure."
        return "PHISHING: " + " ".join(reasons)
    else:
        if reasons:
            return "LEGITIMATE (but suspicious traits found): " + " ".join(reasons)
        return "LEGITIMATE: URL structure and tokens appear normal."

def normalize_label(val) -> int:
    """
    Map various label formats to 0 (legit) / 1 (phishing)
    """
    s = str(val).strip().lower()
    if s in {"1","1.0","true","t","yes","y","phish","phishing","bad","malicious"}:
        return 1
    if s in {"0","0.0","false","f","no","n","good","legit","benign","safe"}:
        return 0
    try:
        return int(float(s))
    except:
        # default to 0 if unknown
        return 0

def load_and_prepare_csv(path: str) -> pd.DataFrame:
    """
    Read CSV and return DataFrame with 'url' and 'label' (0/1).
    Detects common column names. Raises error if not found.
    """
    df = pd.read_csv(path)
    colmap = {c.lower(): c for c in df.columns}
    url_col = None
    label_col = None

    for candidate in ("url","link","website"):
        if candidate in colmap:
            url_col = colmap[candidate]
            break
    if url_col is None:
        # fallback: choose first column that looks like URLs
        for c in df.columns:
            sample = str(df[c].dropna().astype(str).iloc[0]) if len(df[c].dropna())>0 else ""
            if "/" in sample or "." in sample:
                url_col = c
                break
    if url_col is None:
        url_col = df.columns[0]

    for candidate in ("label","class","target"):
        if candidate in colmap:
            label_col = colmap[candidate]
            break
    if label_col is None:
        # fallback: pick second column if present
        if len(df.columns) > 1:
            label_col = [c for c in df.columns if c != url_col][0]
        else:
            raise ValueError("Could not detect label column in CSV.")

    df = df[[url_col, label_col]].rename(columns={url_col: "url", label_col: "label"})
    df['label'] = df['label'].apply(normalize_label)
    df['url'] = df['url'].astype(str)
    return df

