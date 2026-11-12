from pydantic import BaseModel, Field

class PredictionInput(BaseModel):
    age: int = Field(..., ge=1, le=120, description="Patient age in years")
    sex: int = Field(..., ge=0, le=1, description="Sex (0=Female, 1=Male)")
    chest_pain: int = Field(..., ge=0, le=3, description="Chest pain type (0=Typical Angina, 1=Atypical Angina, 2=Non-Anginal Pain, 3=Asymptomatic)")
    resting_bp: int = Field(..., ge=60, le=250, description="Resting blood pressure in mmHg")
    cholesterol: int = Field(..., ge=50, le=600, description="Serum cholesterol in mg/dl")
    fasting_blood_sugar: int = Field(..., ge=0, le=1, description="Fasting blood sugar > 120 mg/dl (0=No, 1=Yes)")
    resting_ecg: int = Field(..., ge=0, le=2, description="Resting ECG results (0=Normal, 1=ST-T Wave Abnormality, 2=Left Ventricular Hypertrophy)")
    max_heart_rate: int = Field(..., ge=50, le=250, description="Maximum heart rate achieved")
    exercise_angina: int = Field(..., ge=0, le=1, description="Exercise-induced angina (0=No, 1=Yes)")
    st_depression: float = Field(..., ge=0.0, le=10.0, description="ST depression induced by exercise relative to rest")
    st_slope: int = Field(..., ge=0, le=2, description="Slope of peak exercise ST segment (0=Upsloping, 1=Flat, 2=Downsloping)")
    num_major_vessels: int = Field(..., ge=0, le=4, description="Number of major vessels colored by fluoroscopy (0-4)")
    thal: int = Field(..., ge=0, le=3, description="Thalassemia (0=Normal, 1=Fixed Defect, 2=Reversible Defect, 3=Other)")

class PredictionResponse(BaseModel):
    prediction: int
    risk_probability: float
    risk_category: str
    model: str
    disclaimer: str = "Educational prediction only — this result is not a medical diagnosis. Consult a qualified healthcare professional for medical advice."
    feature_contributions: dict | None = None

class ModelInfoResponse(BaseModel):
    model_name: str
    model_type: str
    features: list[str]
    training_date: str
    dataset: str
    disclaimer: str

class MetricsResponse(BaseModel):
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    roc_auc: float
    confusion_matrix: list[list[int]]
    model_comparison: list[dict]
    feature_importance: list[dict] | None = None
