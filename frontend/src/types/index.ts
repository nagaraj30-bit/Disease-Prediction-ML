export interface PredictionInput {
  age: number;
  sex: number;
  chest_pain: number;
  resting_bp: number;
  cholesterol: number;
  fasting_blood_sugar: number;
  resting_ecg: number;
  max_heart_rate: number;
  exercise_angina: number;
  st_depression: number;
  st_slope: number;
  num_major_vessels: number;
  thal: number;
}

export interface PredictionResponse {
  prediction: number;
  risk_probability: number;
  risk_category: string;
  model: string;
  disclaimer: string;
  feature_contributions: Record<string, number> | null;
}

export interface ModelInfo {
  model_name: string;
  model_type: string;
  features: string[];
  training_date: string;
  dataset: string;
  disclaimer: string;
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
  confusion_matrix: number[][];
  model_comparison: ModelComparison[];
  feature_importance: FeatureImportance[] | null;
}

export interface ModelComparison {
  name: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
  cv_roc_auc: number;
}

export interface FeatureImportance {
  feature: string;
  display_name: string;
  importance: number;
}

export interface PredictionHistoryItem {
  id: string;
  timestamp: string;
  prediction: number;
  risk_probability: number;
  risk_category: string;
  model: string;
}

export interface ValidationError {
  field: string;
  message: string;
}
