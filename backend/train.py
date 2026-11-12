"""
MedRisk AI — Heart Disease Prediction Model Training

Downloads the UCI Heart Disease Cleveland dataset, trains multiple
classification models, evaluates them using stratified cross-validation,
selects the best model, and saves a complete preprocessing+model pipeline.

Dataset: UCI Heart Disease (Cleveland)
Source: https://archive.ics.uci.edu/ml/machine-learning-databases/heart-disease/processed.cleveland.data
Features: 13 clinical attributes
Target: Binary (0 = no disease, 1 = disease present)
  Original target has values 0-4; we binarize: 0 stays 0, 1-4 become 1.
"""
import os
import json
import warnings
from datetime import datetime
from pathlib import Path

import requests
import numpy as np
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix
)

warnings.filterwarnings('ignore')

# Paths
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / 'data'
MODEL_DIR = BASE_DIR / 'trained_models'
METRICS_DIR = BASE_DIR / 'metrics'

DATASET_URL = 'https://archive.ics.uci.edu/ml/machine-learning-databases/heart-disease/processed.cleveland.data'
DATASET_PATH = DATA_DIR / 'heart_disease.csv'
MODEL_PATH = MODEL_DIR / 'heart_disease_pipeline.joblib'
METRICS_PATH = METRICS_DIR / 'model_metrics.json'

COLUMN_NAMES = ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg',
                'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal', 'target']

FEATURE_COLUMNS = ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg',
                   'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal']

NUMERIC_FEATURES = ['age', 'trestbps', 'chol', 'thalach', 'oldpeak']
CATEGORICAL_FEATURES = ['sex', 'cp', 'fbs', 'restecg', 'exang', 'slope', 'ca', 'thal']

FEATURE_DISPLAY = {
    'age': 'Age', 'sex': 'Sex', 'cp': 'Chest Pain Type',
    'trestbps': 'Resting Blood Pressure', 'chol': 'Cholesterol',
    'fbs': 'Fasting Blood Sugar', 'restecg': 'Resting ECG',
    'thalach': 'Max Heart Rate', 'exang': 'Exercise-Induced Angina',
    'oldpeak': 'ST Depression', 'slope': 'ST Slope',
    'ca': 'Major Vessels (Fluoroscopy)', 'thal': 'Thalassemia'
}


def download_dataset():
    """Download UCI Heart Disease Cleveland dataset if not present."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if DATASET_PATH.exists():
        print(f'Dataset already exists: {DATASET_PATH}')
        return
    print(f'Downloading dataset from {DATASET_URL}...')
    response = requests.get(DATASET_URL, timeout=30)
    response.raise_for_status()
    with open(DATASET_PATH, 'w') as f:
        f.write(response.text)
    print(f'Dataset saved to {DATASET_PATH}')


def load_and_clean_data():
    """Load dataset, handle missing values, binarize target."""
    print('\nLoading and cleaning dataset...')
    df = pd.read_csv(DATASET_PATH, names=COLUMN_NAMES, na_values='?')
    print(f'Raw dataset shape: {df.shape}')
    print(f'Missing values per column:\n{df.isnull().sum()}')

    for col in df.columns:
        df[col] = pd.to_numeric(df[col], errors='coerce')

    df['target'] = (df['target'] > 0).astype(int)
    print(f'\nTarget distribution after binarization:')
    print(df['target'].value_counts())
    print(f'Dataset shape after cleaning: {df.shape}')
    return df


def build_preprocessor():
    """Build a ColumnTransformer for preprocessing."""
    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])
    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent'))
    ])
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, NUMERIC_FEATURES),
            ('cat', categorical_transformer, CATEGORICAL_FEATURES)
        ]
    )
    return preprocessor


def train_and_evaluate():
    """Train multiple models, evaluate, select best, save."""
    download_dataset()
    df = load_and_clean_data()

    X = df[FEATURE_COLUMNS]
    y = df['target']

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f'\nTrain set: {X_train.shape[0]} samples')
    print(f'Test set: {X_test.shape[0]} samples')

    preprocessor = build_preprocessor()

    classifiers = {
        'Logistic Regression': LogisticRegression(max_iter=1000, random_state=42),
        'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
        'Support Vector Machine': SVC(probability=True, random_state=42, kernel='rbf'),
    }

    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

    results = []
    pipelines = {}
    best_cv_auc = -1
    best_model_name = None

    print('\n' + '=' * 60)
    print('MODEL TRAINING AND EVALUATION')
    print('=' * 60)

    for name, clf in classifiers.items():
        print(f'\n--- {name} ---')
        pipeline = Pipeline([
            ('preprocessor', preprocessor),
            ('classifier', clf)
        ])

        pipeline.fit(X_train, y_train)

        y_pred = pipeline.predict(X_test)
        y_proba = pipeline.predict_proba(X_test)[:, 1]

        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, zero_division=0)
        rec = recall_score(y_test, y_pred, zero_division=0)
        f1 = f1_score(y_test, y_pred, zero_division=0)
        auc = roc_auc_score(y_test, y_proba)
        cm = confusion_matrix(y_test, y_pred)

        cv_auc_scores = cross_val_score(pipeline, X_train, y_train, cv=cv, scoring='roc_auc')
        cv_auc = cv_auc_scores.mean()

        print(f'  Accuracy:     {acc:.4f}')
        print(f'  Precision:    {prec:.4f}')
        print(f'  Recall:       {rec:.4f}')
        print(f'  F1-Score:     {f1:.4f}')
        print(f'  ROC-AUC:      {auc:.4f}')
        print(f'  CV ROC-AUC:   {cv_auc:.4f} (±{cv_auc_scores.std():.4f})')
        print(f'  Confusion Matrix: {cm.tolist()}')

        model_result = {
            'name': name,
            'accuracy': round(acc, 4),
            'precision': round(prec, 4),
            'recall': round(rec, 4),
            'f1_score': round(f1, 4),
            'roc_auc': round(auc, 4),
            'cv_roc_auc': round(cv_auc, 4),
            'confusion_matrix': cm.tolist(),
        }
        results.append(model_result)
        pipelines[name] = pipeline

        if cv_auc > best_cv_auc:
            best_cv_auc = cv_auc
            best_model_name = name

    print(f'\n{"=" * 60}')
    print(f'BEST MODEL: {best_model_name} (CV ROC-AUC: {best_cv_auc:.4f})')
    print(f'{"=" * 60}')

    best_pipeline = pipelines[best_model_name]
    best_result = next(r for r in results if r['name'] == best_model_name)

    feature_importance = None
    best_classifier = best_pipeline.named_steps['classifier']
    if hasattr(best_classifier, 'feature_importances_'):
        importances = best_classifier.feature_importances_
        ordered_features = NUMERIC_FEATURES + CATEGORICAL_FEATURES
        feature_importance = [
            {
                'feature': feat,
                'display_name': FEATURE_DISPLAY.get(feat, feat),
                'importance': round(float(imp), 4)
            }
            for feat, imp in sorted(
                zip(ordered_features, importances),
                key=lambda x: x[1],
                reverse=True
            )
        ]
    elif hasattr(best_classifier, 'coef_'):
        coefs = np.abs(best_classifier.coef_[0])
        ordered_features = NUMERIC_FEATURES + CATEGORICAL_FEATURES
        feature_importance = [
            {
                'feature': feat,
                'display_name': FEATURE_DISPLAY.get(feat, feat),
                'importance': round(float(imp), 4)
            }
            for feat, imp in sorted(
                zip(ordered_features, coefs),
                key=lambda x: x[1],
                reverse=True
            )
        ]

    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(best_pipeline, MODEL_PATH)
    print(f'\nModel pipeline saved: {MODEL_PATH}')

    METRICS_DIR.mkdir(parents=True, exist_ok=True)
    metrics = {
        'best_model': best_model_name,
        'accuracy': best_result['accuracy'],
        'precision': best_result['precision'],
        'recall': best_result['recall'],
        'f1_score': best_result['f1_score'],
        'roc_auc': best_result['roc_auc'],
        'confusion_matrix': best_result['confusion_matrix'],
        'model_comparison': results,
        'feature_importance': feature_importance,
        'features_used': FEATURE_COLUMNS,
        'training_date': datetime.now().isoformat(),
        'dataset': 'UCI Heart Disease (Cleveland)',
        'samples_total': len(df),
        'samples_train': len(X_train),
        'samples_test': len(X_test),
    }
    with open(METRICS_PATH, 'w') as f:
        json.dump(metrics, f, indent=2)
    print(f'Metrics saved: {METRICS_PATH}')
    print('\nTraining complete!')


if __name__ == '__main__':
    train_and_evaluate()
