import React from 'react';
import { FileHeart } from 'lucide-react';
import type { PredictionResponse } from '../types';
import { DisclaimerBanner } from './DisclaimerBanner';

interface Props {
  result: PredictionResponse | null;
}

export const RiskResult: React.FC<Props> = ({ result }) => {
  if (!result) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 flex flex-col items-center justify-center text-center h-full">
        <FileHeart className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Assessment Yet</h3>
        <p className="text-gray-500">Complete the assessment form to view risk analysis.</p>
      </div>
    );
  }

  const isHighRisk = result.risk_probability >= 0.5;
  const colorClass = isHighRisk ? 'text-rose-500' : 'text-emerald-500';
  const bgClass = isHighRisk ? 'bg-rose-50' : 'bg-emerald-50';
  const borderClass = isHighRisk ? 'border-t-rose-500' : 'border-t-emerald-500';

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 border-t-4 ${borderClass} flex flex-col h-full`}>
      <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Model-Estimated Risk</h3>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-center mb-6">
          <div className={`text-6xl font-bold ${colorClass}`}>
            {(result.risk_probability * 100).toFixed(1)}%
          </div>
          <div className={`mt-3 inline-block px-4 py-1 rounded-full text-sm font-semibold ${colorClass} ${bgClass}`}>
            {result.risk_category}
          </div>
        </div>
        
        <div className="w-full bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 flex justify-between">
            <span>Prediction Result:</span>
            <span className="font-semibold">{result.prediction}</span>
          </p>
          <p className="text-sm text-gray-600 flex justify-between mt-2">
            <span>Model Used:</span>
            <span className="font-semibold">{result.model}</span>
          </p>
        </div>
      </div>

      <div className="mt-auto">
        <DisclaimerBanner compact />
      </div>
    </div>
  );
};
