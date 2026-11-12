import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface Props {
  probability: number;
}

export const ProbabilityChart: React.FC<Props> = ({ probability }) => {
  const higherRisk = probability * 100;
  const lowerRisk = (1 - probability) * 100;

  const data = [
    { name: 'Higher Risk', value: higherRisk, color: '#f43f5e' }, // rose-500
    { name: 'Lower Risk', value: lowerRisk, color: '#10b981' }    // emerald-500
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full min-h-[300px]">
      <h3 className="text-lg font-medium text-gray-900 mb-2 text-center">Risk Distribution</h3>
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: any) => `${Number(value).toFixed(1)}%`} />
            <Legend verticalAlign="bottom" height={36} />
            <text x="50%" y="50%" dy={8} textAnchor="middle" fill="#1f2937" style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {higherRisk.toFixed(1)}%
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
