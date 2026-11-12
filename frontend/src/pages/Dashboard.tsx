import React, { useState, useEffect } from 'react';
import { ClipboardList, BarChart3, Clock, AlertTriangle } from 'lucide-react';
import { checkHealth, predict, getMetrics, getModelInfo } from '../services/api';
import type { PredictionInput, PredictionResponse, ModelMetrics as MetricsType, ModelInfo } from '../types';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { PatientForm } from '../components/PatientForm';
import { RiskResult } from '../components/RiskResult';
import { ProbabilityChart } from '../components/ProbabilityChart';
import { ModelMetrics } from '../components/ModelMetrics';
import { FeatureImportance } from '../components/FeatureImportance';
import { PredictionHistory, saveToHistory } from '../components/PredictionHistory';

type Tab = 'assessment' | 'performance' | 'history';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('assessment');
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [metrics, setMetrics] = useState<MetricsType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [backendAvailable, setBackendAvailable] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const health = await checkHealth();
        setBackendAvailable(true);
        setModelLoaded(health.model_loaded);

        if (health.model_loaded) {
          const metricsData = await getMetrics().catch(() => null);
          if (metricsData) setMetrics(metricsData);
        }
      } catch (err) {
        setBackendAvailable(false);
      }
    };
    init();
  }, []);

  const handleSubmit = async (input: PredictionInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await predict(input);
      setResult(res);
      saveToHistory(res);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze risk');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex overflow-hidden">
        <button
          onClick={() => setActiveTab('assessment')}
          className={`flex-1 py-4 px-6 flex items-center justify-center font-medium text-sm transition-colors ${activeTab === 'assessment' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-b-2 border-transparent'}`}
        >
          <ClipboardList className="w-5 h-5 mr-2" /> Assessment
        </button>
        <button
          onClick={() => setActiveTab('performance')}
          className={`flex-1 py-4 px-6 flex items-center justify-center font-medium text-sm transition-colors ${activeTab === 'performance' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-b-2 border-transparent'}`}
        >
          <BarChart3 className="w-5 h-5 mr-2" /> Model Performance
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-4 px-6 flex items-center justify-center font-medium text-sm transition-colors ${activeTab === 'history' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-b-2 border-transparent'}`}
        >
          <Clock className="w-5 h-5 mr-2" /> History
        </button>
      </div>

      {!backendAvailable && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
          <AlertTriangle className="text-red-600 w-6 h-6 flex-shrink-0" />
          <p className="text-red-800 font-medium">Backend unavailable. Please start the FastAPI server.</p>
        </div>
      )}

      {backendAvailable && !modelLoaded && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center space-x-3">
          <AlertTriangle className="text-amber-600 w-6 h-6 flex-shrink-0" />
          <p className="text-amber-800 font-medium">Model not trained. Run python train.py to train the model before predicting.</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
          <AlertTriangle className="text-red-600 w-6 h-6 flex-shrink-0" />
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      )}

      {activeTab === 'assessment' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <DisclaimerBanner />
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
              <PatientForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
            
            <div className="lg:col-span-2 space-y-6">
              <RiskResult result={result} />
              {result && (
                <ProbabilityChart probability={result.risk_probability} />
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <ModelMetrics metrics={metrics} />
          <FeatureImportance features={metrics?.feature_importance || null} />
        </div>
      )}

      {activeTab === 'history' && (
        <div className="animate-in fade-in duration-300">
          <PredictionHistory />
        </div>
      )}
    </div>
  );
};
