import React, { useState, useEffect } from 'react';
import { Clock, Trash2 } from 'lucide-react';
import type { PredictionResponse, PredictionHistoryItem } from '../types';

const STORAGE_KEY = 'medrisk_prediction_history';

export const saveToHistory = (result: PredictionResponse) => {
  try {
    const existingStr = localStorage.getItem(STORAGE_KEY);
    const existing: PredictionHistoryItem[] = existingStr ? JSON.parse(existingStr) : [];
    
    const newItem: PredictionHistoryItem = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      timestamp: new Date().toISOString(),
      prediction: result.prediction,
      risk_probability: result.risk_probability,
      risk_category: result.risk_category,
      model: result.model
    };

    const updated = [newItem, ...existing].slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save to history', e);
  }
};

export const clearHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const PredictionHistory: React.FC = () => {
  const [history, setHistory] = useState<PredictionHistoryItem[]>([]);

  useEffect(() => {
    const loadHistory = () => {
      const existingStr = localStorage.getItem(STORAGE_KEY);
      if (existingStr) {
        setHistory(JSON.parse(existingStr));
      }
    };
    loadHistory();
    // Re-load on focus to sync if changed in another tab
    window.addEventListener('focus', loadHistory);
    return () => window.removeEventListener('focus', loadHistory);
  }, []);

  const handleClear = () => {
    clearHistory();
    setHistory([]);
  };

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No prediction history yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Clock className="mr-2 text-blue-600" /> Prediction History
        </h2>
        <button 
          onClick={handleClear}
          className="flex items-center text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-1" /> Clear History
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Probability</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {history.map((item) => {
              const date = new Date(item.timestamp);
              const isHighRisk = item.risk_probability >= 0.5;
              return (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {date.toLocaleDateString()} {date.toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      isHighRisk ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.risk_category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {(item.risk_probability * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.model}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
