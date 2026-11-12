import pandas as pd
from ..schemas.prediction import PredictionInput

FEATURE_NAMES = ['age', 'sex', 'chest_pain', 'resting_bp', 'cholesterol', 'fasting_blood_sugar', 'resting_ecg', 'max_heart_rate', 'exercise_angina', 'st_depression', 'st_slope', 'num_major_vessels', 'thal']

DATASET_COLUMNS = ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal']

API_TO_DATASET_MAP = {
    'age': 'age',
    'sex': 'sex',
    'chest_pain': 'cp',
    'resting_bp': 'trestbps',
    'cholesterol': 'chol',
    'fasting_blood_sugar': 'fbs',
    'resting_ecg': 'restecg',
    'max_heart_rate': 'thalach',
    'exercise_angina': 'exang',
    'st_depression': 'oldpeak',
    'st_slope': 'slope',
    'num_major_vessels': 'ca',
    'thal': 'thal'
}

FEATURE_DISPLAY_NAMES = {
    'age': 'Age',
    'sex': 'Sex',
    'cp': 'Chest Pain Type',
    'trestbps': 'Resting Blood Pressure',
    'chol': 'Cholesterol',
    'fbs': 'Fasting Blood Sugar',
    'restecg': 'Resting ECG',
    'thalach': 'Max Heart Rate',
    'exang': 'Exercise-Induced Angina',
    'oldpeak': 'ST Depression',
    'slope': 'ST Slope',
    'ca': 'Major Vessels (Fluoroscopy)',
    'thal': 'Thalassemia'
}

def input_to_dataframe(prediction_input: PredictionInput) -> pd.DataFrame:
    data_dict = prediction_input.model_dump()
    mapped_data = {API_TO_DATASET_MAP[k]: [v] for k, v in data_dict.items() if k in API_TO_DATASET_MAP}
    df = pd.DataFrame(mapped_data)
    # Ensure correct column order matching training pipeline
    return df[DATASET_COLUMNS]
