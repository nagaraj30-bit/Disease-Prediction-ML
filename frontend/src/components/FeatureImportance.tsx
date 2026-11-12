import React from 'react';
import { Layers } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { FeatureImportance as FeatureImportanceType } from '../types';

interface Props {
  features: FeatureImportanceType[] | null;
}

export const FeatureImportance: React.FC<Props> = ({ features }) => {
  if (!features || features.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
        <Layers className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Feature importance data unavailable.</p>
      </div>
    );
  }

  const sortedFeatures = [...features].sort((a, b) => b.importance - a.importance);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center mb-2">
          <Layers className="mr-2 text-blue-600" /> Model Feature Importance
        </h2>
        <p className="text-gray-500 text-sm">
          Feature importance indicates how the trained model uses features for prediction. It does not establish medical causation.
        </p>
      </div>

      <div className="w-full" style={{ height: `${sortedFeatures.length * 40 + 60}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedFeatures}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" />
            <YAxis 
              type="category" 
              dataKey="display_name" 
              width={110} 
              tick={{ fontSize: 12 }} 
              interval={0}
            />
            <Tooltip 
              formatter={(value: any) => [value.toFixed(4), 'Importance']}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="importance" fill="#3b82f6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
