import React from 'react';
import { BarChart3, Target, Crosshair, Search, Award, TrendingUp } from 'lucide-react';
import type { ModelMetrics as MetricsType } from '../types';

interface Props {
  metrics: MetricsType | null;
}

export const ModelMetrics: React.FC<Props> = ({ metrics }) => {
  if (!metrics) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
        <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Model metrics unavailable. Train the model first.</p>
      </div>
    );
  }

  const MetricCard = ({ title, value, icon: Icon, color }: { title: string, value: number, icon: any, color: string }) => (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{(value * 100).toFixed(1)}%</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-900 flex items-center mb-2">
          <BarChart3 className="mr-2 text-blue-600" /> Model Evaluation Metrics
        </h2>
        <p className="text-gray-500 text-sm">
          These metrics reflect model performance on the test dataset, not individual patient accuracy.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard title="Accuracy" value={metrics.accuracy} icon={Target} color="bg-blue-50 text-blue-600" />
        <MetricCard title="Precision" value={metrics.precision} icon={Crosshair} color="bg-indigo-50 text-indigo-600" />
        <MetricCard title="Recall" value={metrics.recall} icon={Search} color="bg-violet-50 text-violet-600" />
        <MetricCard title="F1 Score" value={metrics.f1_score} icon={Award} color="bg-fuchsia-50 text-fuchsia-600" />
        <MetricCard title="ROC-AUC" value={metrics.roc_auc} icon={TrendingUp} color="bg-rose-50 text-rose-600" />
      </div>

      {metrics.confusion_matrix && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Confusion Matrix</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-center">
              <thead>
                <tr>
                  <th className="p-2"></th>
                  <th className="p-2 font-medium text-gray-600">Predicted Negative</th>
                  <th className="p-2 font-medium text-gray-600">Predicted Positive</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th className="p-2 font-medium text-gray-600 text-right">Actual Negative</th>
                  <td className="p-4 bg-emerald-100 border border-white text-emerald-900 font-bold rounded-tl-lg">
                    {metrics.confusion_matrix[0][0]} (TN)
                  </td>
                  <td className="p-4 bg-rose-100 border border-white text-rose-900 font-bold rounded-tr-lg">
                    {metrics.confusion_matrix[0][1]} (FP)
                  </td>
                </tr>
                <tr>
                  <th className="p-2 font-medium text-gray-600 text-right">Actual Positive</th>
                  <td className="p-4 bg-rose-100 border border-white text-rose-900 font-bold rounded-bl-lg">
                    {metrics.confusion_matrix[1][0]} (FN)
                  </td>
                  <td className="p-4 bg-emerald-100 border border-white text-emerald-900 font-bold rounded-br-lg">
                    {metrics.confusion_matrix[1][1]} (TP)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {metrics.model_comparison && metrics.model_comparison.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 overflow-x-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Comparison</h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precision</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recall</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">F1</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROC-AUC</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {metrics.model_comparison.map((m, idx) => (
                <tr key={idx} className={idx === 0 ? "bg-blue-50/50" : ""}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{m.name} {idx === 0 && '🌟'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(m.accuracy * 100).toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(m.precision * 100).toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(m.recall * 100).toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(m.f1_score * 100).toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(m.roc_auc * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
