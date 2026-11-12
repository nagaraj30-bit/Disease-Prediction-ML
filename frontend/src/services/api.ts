import type { PredictionInput, PredictionResponse, ModelInfo, ModelMetrics } from '../types';

const API_BASE = '/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Server error' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }
  return response.json();
}

export async function checkHealth(): Promise<{ status: string; model_loaded: boolean; model_name: string | null }> {
  const res = await fetch(`${API_BASE}/health`);
  return handleResponse(res);
}

export async function predict(input: PredictionInput): Promise<PredictionResponse> {
  const res = await fetch(`${API_BASE}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return handleResponse(res);
}

export async function getModelInfo(): Promise<ModelInfo> {
  const res = await fetch(`${API_BASE}/model-info`);
  return handleResponse(res);
}

export async function getMetrics(): Promise<ModelMetrics> {
  const res = await fetch(`${API_BASE}/metrics`);
  return handleResponse(res);
}
