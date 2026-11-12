import type { PredictionInput, ValidationError } from '../types';

export function validateInput(input: Partial<PredictionInput>): ValidationError[] {
  const errors: ValidationError[] = [];

  const checkRequired = (field: keyof PredictionInput, name: string) => {
    if (input[field] === undefined || input[field] === null || Number.isNaN(input[field])) {
      errors.push({ field, message: `${name} is required.` });
      return false;
    }
    return true;
  };

  if (checkRequired('age', 'Age')) {
    if (input.age! < 1 || input.age! > 120) errors.push({ field: 'age', message: 'Age must be between 1 and 120.' });
  }

  if (checkRequired('sex', 'Sex')) {
    if (input.sex !== 0 && input.sex !== 1) errors.push({ field: 'sex', message: 'Sex must be 0 or 1.' });
  }

  if (checkRequired('chest_pain', 'Chest Pain Type')) {
    if (input.chest_pain! < 0 || input.chest_pain! > 3) errors.push({ field: 'chest_pain', message: 'Invalid chest pain type.' });
  }

  if (checkRequired('resting_bp', 'Resting Blood Pressure')) {
    if (input.resting_bp! < 60 || input.resting_bp! > 250) errors.push({ field: 'resting_bp', message: 'BP must be between 60 and 250.' });
  }

  if (checkRequired('cholesterol', 'Cholesterol')) {
    if (input.cholesterol! < 50 || input.cholesterol! > 600) errors.push({ field: 'cholesterol', message: 'Cholesterol must be between 50 and 600.' });
  }

  if (checkRequired('fasting_blood_sugar', 'Fasting Blood Sugar')) {
    if (input.fasting_blood_sugar !== 0 && input.fasting_blood_sugar !== 1) errors.push({ field: 'fasting_blood_sugar', message: 'Must be 0 or 1.' });
  }

  if (checkRequired('resting_ecg', 'Resting ECG')) {
    if (input.resting_ecg! < 0 || input.resting_ecg! > 2) errors.push({ field: 'resting_ecg', message: 'Invalid resting ECG.' });
  }

  if (checkRequired('max_heart_rate', 'Maximum Heart Rate')) {
    if (input.max_heart_rate! < 50 || input.max_heart_rate! > 250) errors.push({ field: 'max_heart_rate', message: 'Heart rate must be between 50 and 250.' });
  }

  if (checkRequired('exercise_angina', 'Exercise-Induced Angina')) {
    if (input.exercise_angina !== 0 && input.exercise_angina !== 1) errors.push({ field: 'exercise_angina', message: 'Must be 0 or 1.' });
  }

  if (checkRequired('st_depression', 'ST Depression')) {
    if (input.st_depression! < 0 || input.st_depression! > 10) errors.push({ field: 'st_depression', message: 'Must be between 0 and 10.' });
  }

  if (checkRequired('st_slope', 'ST Slope')) {
    if (input.st_slope! < 0 || input.st_slope! > 2) errors.push({ field: 'st_slope', message: 'Invalid ST slope.' });
  }

  if (checkRequired('num_major_vessels', 'Number of Major Vessels')) {
    if (input.num_major_vessels! < 0 || input.num_major_vessels! > 4) errors.push({ field: 'num_major_vessels', message: 'Must be between 0 and 4.' });
  }

  if (checkRequired('thal', 'Thalassemia')) {
    if (input.thal! < 0 || input.thal! > 3) errors.push({ field: 'thal', message: 'Invalid Thalassemia value.' });
  }

  return errors;
}
