import React, { useState } from 'react';
import { User, Activity, Stethoscope, HeartPulse } from 'lucide-react';
import type { PredictionInput, ValidationError } from '../types';
import { validateInput } from '../utils/validation';

interface Props {
  onSubmit: (input: PredictionInput) => void;
  isLoading: boolean;
}

export const PatientForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<Partial<Record<keyof PredictionInput, string>>>({
    age: '', sex: '', chest_pain: '', resting_bp: '', cholesterol: '',
    fasting_blood_sugar: '', resting_ecg: '', max_heart_rate: '',
    exercise_angina: '', st_depression: '', st_slope: '',
    num_major_vessels: '', thal: ''
  });
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input: Partial<PredictionInput> = {};
    for (const key in formData) {
      if (formData[key as keyof PredictionInput] !== '') {
        input[key as keyof PredictionInput] = Number(formData[key as keyof PredictionInput]);
      }
    }
    const validationErrors = validateInput(input);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors([]);
    onSubmit(input as PredictionInput);
  };

  const getError = (field: keyof PredictionInput) => errors.find(e => e.field === field)?.message;

  const inputClass = "w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm";
  const labelClass = "block text-sm font-medium text-gray-700";
  const errorClass = "text-red-500 text-xs mt-1";
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center"><User className="mr-2 w-5 h-5 text-blue-500"/> Patient Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Age</label>
            <input type="number" name="age" value={formData.age} onChange={handleChange} className={inputClass} placeholder="e.g. 45" />
            {getError('age') && <p className={errorClass}>{getError('age')}</p>}
          </div>
          <div>
            <label className={labelClass}>Sex</label>
            <div className="mt-2 flex space-x-4">
              <label className="inline-flex items-center">
                <input type="radio" name="sex" value="1" checked={formData.sex === '1'} onChange={handleChange} className="text-blue-600 focus:ring-blue-500" />
                <span className="ml-2 text-sm text-gray-700">Male</span>
              </label>
              <label className="inline-flex items-center">
                <input type="radio" name="sex" value="0" checked={formData.sex === '0'} onChange={handleChange} className="text-blue-600 focus:ring-blue-500" />
                <span className="ml-2 text-sm text-gray-700">Female</span>
              </label>
            </div>
            {getError('sex') && <p className={errorClass}>{getError('sex')}</p>}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center"><Activity className="mr-2 w-5 h-5 text-blue-500"/> Clinical Measurements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Resting Blood Pressure (mmHg)</label>
            <input type="number" name="resting_bp" value={formData.resting_bp} onChange={handleChange} className={inputClass} placeholder="e.g. 120" />
            {getError('resting_bp') && <p className={errorClass}>{getError('resting_bp')}</p>}
          </div>
          <div>
            <label className={labelClass}>Cholesterol (mg/dl)</label>
            <input type="number" name="cholesterol" value={formData.cholesterol} onChange={handleChange} className={inputClass} placeholder="e.g. 200" />
            {getError('cholesterol') && <p className={errorClass}>{getError('cholesterol')}</p>}
          </div>
          <div>
            <label className={labelClass}>Maximum Heart Rate (bpm)</label>
            <input type="number" name="max_heart_rate" value={formData.max_heart_rate} onChange={handleChange} className={inputClass} placeholder="e.g. 150" />
            {getError('max_heart_rate') && <p className={errorClass}>{getError('max_heart_rate')}</p>}
          </div>
          <div>
            <label className={labelClass}>ST Depression (mm)</label>
            <input type="number" step="0.1" name="st_depression" value={formData.st_depression} onChange={handleChange} className={inputClass} placeholder="e.g. 1.5" />
            {getError('st_depression') && <p className={errorClass}>{getError('st_depression')}</p>}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center"><Stethoscope className="mr-2 w-5 h-5 text-blue-500"/> Clinical Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Chest Pain Type</label>
            <select name="chest_pain" value={formData.chest_pain} onChange={handleChange} className={inputClass}>
              <option value="">Select...</option>
              <option value="0">Typical Angina (0)</option>
              <option value="1">Atypical Angina (1)</option>
              <option value="2">Non-Anginal Pain (2)</option>
              <option value="3">Asymptomatic (3)</option>
            </select>
            {getError('chest_pain') && <p className={errorClass}>{getError('chest_pain')}</p>}
          </div>
          <div>
            <label className={labelClass}>Fasting Blood Sugar {'>'} 120 mg/dl</label>
            <div className="mt-2 flex space-x-4">
              <label className="inline-flex items-center">
                <input type="radio" name="fasting_blood_sugar" value="1" checked={formData.fasting_blood_sugar === '1'} onChange={handleChange} className="text-blue-600" />
                <span className="ml-2 text-sm text-gray-700">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input type="radio" name="fasting_blood_sugar" value="0" checked={formData.fasting_blood_sugar === '0'} onChange={handleChange} className="text-blue-600" />
                <span className="ml-2 text-sm text-gray-700">No</span>
              </label>
            </div>
            {getError('fasting_blood_sugar') && <p className={errorClass}>{getError('fasting_blood_sugar')}</p>}
          </div>
          <div>
            <label className={labelClass}>Resting ECG</label>
            <select name="resting_ecg" value={formData.resting_ecg} onChange={handleChange} className={inputClass}>
              <option value="">Select...</option>
              <option value="0">Normal (0)</option>
              <option value="1">ST-T Wave Abnormality (1)</option>
              <option value="2">Left Ventricular Hypertrophy (2)</option>
            </select>
            {getError('resting_ecg') && <p className={errorClass}>{getError('resting_ecg')}</p>}
          </div>
          <div>
            <label className={labelClass}>Exercise-Induced Angina</label>
            <div className="mt-2 flex space-x-4">
              <label className="inline-flex items-center">
                <input type="radio" name="exercise_angina" value="1" checked={formData.exercise_angina === '1'} onChange={handleChange} className="text-blue-600" />
                <span className="ml-2 text-sm text-gray-700">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input type="radio" name="exercise_angina" value="0" checked={formData.exercise_angina === '0'} onChange={handleChange} className="text-blue-600" />
                <span className="ml-2 text-sm text-gray-700">No</span>
              </label>
            </div>
            {getError('exercise_angina') && <p className={errorClass}>{getError('exercise_angina')}</p>}
          </div>
          <div>
            <label className={labelClass}>ST Slope</label>
            <select name="st_slope" value={formData.st_slope} onChange={handleChange} className={inputClass}>
              <option value="">Select...</option>
              <option value="0">Upsloping (0)</option>
              <option value="1">Flat (1)</option>
              <option value="2">Downsloping (2)</option>
            </select>
            {getError('st_slope') && <p className={errorClass}>{getError('st_slope')}</p>}
          </div>
          <div>
            <label className={labelClass}>Number of Major Vessels</label>
            <select name="num_major_vessels" value={formData.num_major_vessels} onChange={handleChange} className={inputClass}>
              <option value="">Select...</option>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
            {getError('num_major_vessels') && <p className={errorClass}>{getError('num_major_vessels')}</p>}
          </div>
          <div>
            <label className={labelClass}>Thalassemia</label>
            <select name="thal" value={formData.thal} onChange={handleChange} className={inputClass}>
              <option value="">Select...</option>
              <option value="0">Normal (0)</option>
              <option value="1">Fixed Defect (1)</option>
              <option value="2">Reversible Defect (2)</option>
              <option value="3">Other (3)</option>
            </select>
            {getError('thal') && <p className={errorClass}>{getError('thal')}</p>}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 px-4 font-semibold shadow-sm transition-colors disabled:opacity-70"
      >
        {isLoading ? (
          <span className="flex items-center"><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Analyzing...</span>
        ) : (
          <><HeartPulse className="mr-2 w-5 h-5" /> Assess Risk</>
        )}
      </button>
    </form>
  );
};
