import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  compact?: boolean;
}

export const DisclaimerBanner: React.FC<Props> = ({ compact = false }) => {
  return (
    <div className={`bg-amber-50 border border-amber-200 rounded-xl ${compact ? 'p-3' : 'p-4'} flex items-start space-x-3`}>
      <AlertTriangle className={`text-amber-600 flex-shrink-0 ${compact ? 'w-5 h-5' : 'w-6 h-6'}`} />
      <div>
        <span className="font-bold text-amber-900 block">Educational Purpose Only</span>
        <span className={`text-amber-800 ${compact ? 'text-xs' : 'text-sm'}`}>
          This prediction is not a medical diagnosis. Consult a qualified healthcare professional for medical advice.
        </span>
      </div>
    </div>
  );
};
