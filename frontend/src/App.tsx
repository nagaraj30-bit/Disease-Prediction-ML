import { useEffect, useState } from 'react';
import { HeartPulse } from 'lucide-react';
import { Dashboard } from './pages/Dashboard';
import { checkHealth } from './services/api';

function App() {
  const [status, setStatus] = useState<'loading' | 'online' | 'offline' | 'untrained'>('loading');

  useEffect(() => {
    checkHealth()
      .then(res => {
        if (res.model_loaded) setStatus('online');
        else setStatus('untrained');
      })
      .catch(() => setStatus('offline'));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <HeartPulse className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900 leading-tight">MedRisk AI</h1>
              <p className="text-xs text-gray-500 font-medium tracking-wide">Medical Risk Intelligence</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-600">Status:</span>
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gray-100 border border-gray-200">
              {status === 'loading' && <span className="w-2.5 h-2.5 rounded-full bg-gray-400 animate-pulse"></span>}
              {status === 'online' && <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>}
              {status === 'untrained' && <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>}
              {status === 'offline' && <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>}
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                {status === 'online' ? 'Model Ready' : status === 'untrained' ? 'Model Not Trained' : status === 'offline' ? 'Backend Offline' : 'Connecting'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        <Dashboard />
      </main>

      <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500 mb-2">
            © 2024 MedRisk AI — Educational Project
          </p>
          <p className="text-xs text-gray-400 max-w-2xl mx-auto">
            This application is a demonstration of machine learning capabilities and is intended for educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
