# MedRisk AI — Medical Risk Intelligence

A professional machine-learning web application for heart disease risk prediction using structured patient medical data and supervised classification techniques.

> **⚠️ Medical Disclaimer:** This is an **educational machine-learning project**, not a medical diagnostic system. All predictions are model-estimated probabilities for educational purposes only. **Consult a qualified healthcare professional for medical advice.**

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Medical Disclaimer](#medical-disclaimer)
4. [Technology Stack](#technology-stack)
5. [Dataset Information](#dataset-information)
6. [Dataset Setup](#dataset-setup)
7. [Installation](#installation)
8. [Model Training](#model-training)
9. [Model Evaluation](#model-evaluation)
10. [Running the Backend](#running-the-backend)
11. [Running the Frontend](#running-the-frontend)
12. [API Documentation](#api-documentation)
13. [Project Structure](#project-structure)
14. [Example Prediction](#example-prediction)
15. [Limitations](#limitations)
16. [Future Improvements](#future-improvements)

---

## Project Overview

MedRisk AI uses supervised machine-learning classification to estimate heart disease risk from 13 clinical features. The application trains multiple classification models, compares their performance using cross-validation, selects the best model, and provides predictions through a clean REST API consumed by a modern React frontend.

The complete ML pipeline:

```
Raw Medical Dataset → Data Validation → Missing Value Handling → Feature Preprocessing
→ Stratified Train/Test Split → Cross-Validation → Model Training → Evaluation
→ Best Model Selection → Save Complete Pipeline → Prediction API
```

---

## Features

- **Complete ML Pipeline**: Data loading, cleaning, preprocessing, training, evaluation, and prediction
- **Multiple Model Comparison**: Logistic Regression, Random Forest, and SVM compared using stratified cross-validation
- **Best Model Selection**: Automatically selects the model with the highest cross-validated ROC-AUC
- **Single Pipeline**: Preprocessing and model saved together as one `joblib` file for consistency
- **Real-Time Predictions**: FastAPI backend serves genuine model predictions with probabilities
- **Professional Dashboard**: React + TypeScript frontend with clean healthcare-grade UI
- **Model Metrics Display**: Real accuracy, precision, recall, F1, ROC-AUC, and confusion matrix
- **Feature Importance**: Actual model-derived feature importance visualization
- **Prediction History**: Browser-local history with no PII stored
- **Input Validation**: Both client-side and server-side validation
- **Medical Safety**: Prominent disclaimers throughout; no misleading medical claims

---

## Medical Disclaimer

This application is for **educational and demonstration purposes only**.

- Predictions are **model-estimated probabilities**, not medical diagnoses
- Results use terms like "Higher predicted risk" and "Lower predicted risk"
- The model has **not been clinically validated**
- **Always consult a qualified healthcare professional** for medical decisions
- Do not use this application to make real medical decisions

---

## Technology Stack

### Backend
| Technology | Purpose |
|---|---|
| Python 3.10+ | Core language |
| FastAPI | REST API framework |
| scikit-learn | ML models and preprocessing |
| Pandas | Data manipulation |
| NumPy | Numerical computation |
| joblib | Model serialization |
| Pydantic | Input validation |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool |
| Tailwind CSS | Utility-first styling |
| Recharts | Data visualization |
| Lucide React | Icon library |

---

## Dataset Information

### Source
**UCI Heart Disease Dataset — Cleveland Subset**
- Source: [UCI Machine Learning Repository](https://archive.ics.uci.edu/ml/datasets/heart+disease)
- Creator: Cleveland Clinic Foundation (Robert Detrano, M.D., Ph.D.)
- Records: 303 patient records
- Features: 13 clinical attributes + 1 target variable

### Features Used

| # | Feature | UCI Name | Type | Description |
|---|---------|----------|------|-------------|
| 1 | Age | `age` | Numeric | Patient age in years |
| 2 | Sex | `sex` | Binary | 0 = Female, 1 = Male |
| 3 | Chest Pain Type | `cp` | Categorical | 0–3 (Typical Angina to Asymptomatic) |
| 4 | Resting Blood Pressure | `trestbps` | Numeric | mmHg on admission |
| 5 | Cholesterol | `chol` | Numeric | Serum cholesterol in mg/dl |
| 6 | Fasting Blood Sugar | `fbs` | Binary | >120 mg/dl (0=No, 1=Yes) |
| 7 | Resting ECG | `restecg` | Categorical | 0–2 |
| 8 | Max Heart Rate | `thalach` | Numeric | Maximum heart rate achieved |
| 9 | Exercise-Induced Angina | `exang` | Binary | 0=No, 1=Yes |
| 10 | ST Depression | `oldpeak` | Numeric | ST depression induced by exercise |
| 11 | ST Slope | `slope` | Categorical | 0=Upsloping, 1=Flat, 2=Downsloping |
| 12 | Major Vessels | `ca` | Numeric | Number of major vessels (0–4) colored by fluoroscopy |
| 13 | Thalassemia | `thal` | Categorical | 0=Normal, 1=Fixed Defect, 2=Reversible Defect, 3=Other |

### Missing Value Handling
The Cleveland dataset contains `?` characters for missing values, primarily in the `ca` (major vessels) and `thal` (thalassemia) columns. These are handled using:
- Numeric features: Median imputation
- Categorical features: Most-frequent value imputation

Missing values are handled within the sklearn Pipeline, ensuring consistent treatment during both training and prediction.

### Target Transformation
The original UCI dataset target variable contains disease severity values 0–4:
- `0` = No disease detected
- `1–4` = Disease present (varying severity)

For binary classification, the target is transformed:
```
0 → 0 (Lower/no detected disease)
1, 2, 3, 4 → 1 (Disease present)
```

This is a standard transformation used in heart disease prediction literature.

---

## Dataset Setup

The training script **automatically downloads** the dataset. No manual setup required.

The dataset is downloaded from:
```
https://archive.ics.uci.edu/ml/machine-learning-databases/heart-disease/processed.cleveland.data
```

and saved to:
```
backend/data/heart_disease.csv
```

If you prefer manual setup, place the Cleveland processed dataset in `backend/data/heart_disease.csv`.

---

## Installation

### Prerequisites
- Python 3.10 or higher
- Node.js 18 or higher
- npm 9 or higher

### Backend Setup

```cmd
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### Frontend Setup

```cmd
cd frontend
npm install
```

---

## Model Training

Run the training script from the `backend` directory:

```cmd
cd backend
python train.py
```

This will:
1. Download the UCI Heart Disease Cleveland dataset (if not already present)
2. Clean the data and handle missing values
3. Binarize the target variable (0 vs 1–4)
4. Split data into 80% training / 20% test (stratified)
5. Train three classification models:
   - Logistic Regression
   - Random Forest
   - Support Vector Machine (SVM)
6. Evaluate each model using 5-fold stratified cross-validation
7. Select the best model based on cross-validated ROC-AUC
8. Save the complete preprocessing + model pipeline to `trained_models/heart_disease_pipeline.joblib`
9. Save evaluation metrics to `metrics/model_metrics.json`

### Output Files

```
backend/
├── data/
│   └── heart_disease.csv           # Downloaded dataset
├── trained_models/
│   └── heart_disease_pipeline.joblib  # Complete saved pipeline
└── metrics/
    └── model_metrics.json           # Evaluation metrics
```

---

## Model Evaluation

After training, the console output shows metrics for all models. Example:

```
=== MODEL TRAINING AND EVALUATION ===

--- Logistic Regression ---
  Accuracy:     0.8361
  Precision:    0.8485
  Recall:       0.8485
  F1-Score:     0.8485
  ROC-AUC:      0.9079
  CV ROC-AUC:   0.8645 (±0.0523)

--- Random Forest ---
  Accuracy:     0.8361
  Precision:    0.8235
  Recall:       0.8485
  F1-Score:     0.8358
  ROC-AUC:      0.9152
  CV ROC-AUC:   0.8833 (±0.0412)

--- Support Vector Machine ---
  ...

BEST MODEL: Random Forest (CV ROC-AUC: 0.8833)
```

*Note: Actual values depend on the random seed and data split.*

Models are compared using:
- **Accuracy** — Overall correct predictions
- **Precision** — True positives / (True positives + False positives)
- **Recall** — True positives / (True positives + False negatives)
- **F1-Score** — Harmonic mean of precision and recall
- **ROC-AUC** — Area under the Receiver Operating Characteristic curve
- **Confusion Matrix** — True/false positive/negative counts

The best model is selected by **cross-validated ROC-AUC**, not test accuracy alone.

---

## Running the Backend

Start the FastAPI server from the `backend` directory:

```cmd
cd backend
python -m uvicorn app.main:app --reload
```

The API will be available at:
- API: `http://localhost:8000`
- Swagger Docs: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

## Running the Frontend

Start the development server from the `frontend` directory:

```cmd
cd frontend
npm run dev
```

The frontend will be available at:
- `http://localhost:5173`

The Vite dev server proxies `/api/*` requests to `http://localhost:8000/*`.

---

## API Documentation

### `GET /health`
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "model_name": "Random Forest"
}
```

### `POST /predict`
Generate a risk prediction.

**Request Body:**
```json
{
  "age": 52,
  "sex": 1,
  "chest_pain": 2,
  "resting_bp": 130,
  "cholesterol": 250,
  "fasting_blood_sugar": 0,
  "resting_ecg": 1,
  "max_heart_rate": 145,
  "exercise_angina": 0,
  "st_depression": 1.2,
  "st_slope": 1,
  "num_major_vessels": 0,
  "thal": 2
}
```

**Response:**
```json
{
  "prediction": 1,
  "risk_probability": 0.68,
  "risk_category": "Higher predicted risk",
  "model": "Random Forest",
  "disclaimer": "Educational prediction only — this result is not a medical diagnosis. Consult a qualified healthcare professional for medical advice.",
  "feature_contributions": null
}
```

### `GET /metrics`
Retrieve model evaluation metrics.

### `GET /model-info`
Retrieve model metadata (name, features, training date, dataset).

### Error Responses
- `422`: Validation error (invalid input)
- `503`: Model not trained

---

## Project Structure

```
CodeAlpha_Disease-Prediction-ML/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                    # FastAPI application
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── prediction.py          # POST /predict
│   │   │   └── metrics.py             # GET /metrics, /model-info
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── prediction_service.py  # Model loading & prediction
│   │   │   └── preprocessing.py       # Feature mappings
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   └── prediction.py          # Pydantic models
│   │   └── models/
│   │       └── __init__.py
│   ├── data/                          # Dataset directory
│   ├── trained_models/                # Saved model pipeline
│   ├── metrics/                       # Saved evaluation metrics
│   ├── train.py                       # ML training script
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DisclaimerBanner.tsx
│   │   │   ├── PatientForm.tsx
│   │   │   ├── RiskResult.tsx
│   │   │   ├── ProbabilityChart.tsx
│   │   │   ├── ModelMetrics.tsx
│   │   │   ├── FeatureImportance.tsx
│   │   │   └── PredictionHistory.tsx
│   │   ├── pages/
│   │   │   └── Dashboard.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── utils/
│   │       └── validation.ts
│   ├── package.json
│   ├── vite.config.ts
│   └── index.html
│
├── README.md
├── .gitignore
└── .env.example
```

---

## Example Prediction

### Input
A 52-year-old male with non-anginal chest pain, resting BP of 130 mmHg, cholesterol of 250 mg/dl, normal fasting blood sugar, ST-T wave abnormality on ECG, max heart rate of 145, no exercise-induced angina, ST depression of 1.2, flat ST slope, 0 major vessels colored, and reversible thalassemia defect.

### API Call
```cmd
curl -X POST http://localhost:8000/predict -H "Content-Type: application/json" -d "{\"age\":52,\"sex\":1,\"chest_pain\":2,\"resting_bp\":130,\"cholesterol\":250,\"fasting_blood_sugar\":0,\"resting_ecg\":1,\"max_heart_rate\":145,\"exercise_angina\":0,\"st_depression\":1.2,\"st_slope\":1,\"num_major_vessels\":0,\"thal\":2}"
```

### Response
```json
{
  "prediction": 1,
  "risk_probability": 0.68,
  "risk_category": "Higher predicted risk",
  "model": "Random Forest",
  "disclaimer": "Educational prediction only — ..."
}
```

*Note: Actual values will vary based on the trained model.*

---

## Limitations

1. **Not a medical device**: This application has not undergone clinical validation
2. **Small dataset**: The Cleveland dataset contains only 303 records
3. **Limited features**: Only 13 clinical features are used; real diagnosis considers many more factors
4. **Population bias**: The dataset may not represent all populations equally
5. **Binary classification**: Disease severity (1–4) is collapsed to a single "disease present" category
6. **No temporal data**: The model does not consider changes over time
7. **Missing values**: Some records have missing `ca` and `thal` values that are imputed

---

## Future Improvements

1. **Additional Datasets**: Integrate diabetes prediction (Pima Indians) and breast cancer datasets
2. **More Models**: Add XGBoost, Gradient Boosting, and neural network classifiers
3. **Hyperparameter Tuning**: Implement GridSearchCV or RandomizedSearchCV
4. **SHAP Explainability**: Add SHAP values for individual prediction explanations
5. **User Authentication**: Add optional user accounts for saving assessments
6. **PDF Reports**: Generate downloadable risk assessment reports
7. **Larger Datasets**: Train on combined multi-center heart disease data
8. **Model Versioning**: Track model versions and allow rollback
9. **Docker Deployment**: Containerize backend and frontend
10. **CI/CD Pipeline**: Automated testing and deployment

---


## Acknowledgments

- UCI Machine Learning Repository for the Heart Disease dataset
- Cleveland Clinic Foundation (Robert Detrano, M.D., Ph.D.) for the original data collection
