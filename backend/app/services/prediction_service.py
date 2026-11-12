import joblib
import json
import os
import pathlib
from ..schemas.prediction import PredictionInput

BASE_DIR = pathlib.Path(__file__).resolve().parent.parent.parent
MODEL_PATH = BASE_DIR / 'trained_models' / 'heart_disease_pipeline.joblib'
METRICS_PATH = BASE_DIR / 'metrics' / 'model_metrics.json'

class PredictionService:
    def __init__(self):
        self.pipeline = None
        self.metrics_data = None
        self.model_name = None
        self._load_model()
        self._load_metrics()

    def _load_model(self):
        if MODEL_PATH.exists():
            self.pipeline = joblib.load(MODEL_PATH)

    def _load_metrics(self):
        if METRICS_PATH.exists():
            with open(METRICS_PATH) as f:
                self.metrics_data = json.load(f)
                self.model_name = self.metrics_data.get('best_model', 'Unknown')

    @property
    def model_loaded(self) -> bool:
        return self.pipeline is not None

    def predict(self, input_data: PredictionInput) -> dict:
        if not self.model_loaded:
            raise RuntimeError('Model not trained. Run python train.py first.')
        
        from .preprocessing import input_to_dataframe
        df = input_to_dataframe(input_data)
        
        prediction = int(self.pipeline.predict(df)[0])
        
        proba = None
        if hasattr(self.pipeline, 'predict_proba'):
            probas = self.pipeline.predict_proba(df)[0]
            proba = float(probas[1])
        else:
            proba = float(prediction)
            
        risk_category = 'Higher predicted risk' if proba >= 0.5 else 'Lower predicted risk'
        
        return {
            'prediction': prediction,
            'risk_probability': round(proba, 4),
            'risk_category': risk_category,
            'model': self.model_name or 'Unknown',
        }

    def get_metrics(self) -> dict | None:
        return self.metrics_data

    def get_model_info(self) -> dict | None:
        if not self.metrics_data:
            return None
        return {
            'model_name': self.metrics_data.get('best_model', 'Unknown'),
            'model_type': self.metrics_data.get('best_model', 'Unknown'),
            'features': self.metrics_data.get('features_used', []),
            'training_date': self.metrics_data.get('training_date', 'Unknown'),
            'dataset': self.metrics_data.get('dataset', 'UCI Heart Disease (Cleveland)'),
            'disclaimer': 'Educational prediction only — this result is not a medical diagnosis.',
        }

    def get_feature_importance(self) -> list[dict] | None:
        if self.metrics_data:
            return self.metrics_data.get('feature_importance')
        return None
