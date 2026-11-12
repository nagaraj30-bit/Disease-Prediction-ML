from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from .services.prediction_service import PredictionService
from .routes import prediction, metrics

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure service is initialized and loaded
    if not hasattr(app.state, 'prediction_service') or app.state.prediction_service is None:
        app.state.prediction_service = PredictionService()
    else:
        app.state.prediction_service._load_model()
        app.state.prediction_service._load_metrics()

    if app.state.prediction_service.model_loaded:
        print('[INFO] Model loaded successfully')
    else:
        print('[WARN] No trained model found. Run: python train.py')
    yield
    print('[INFO] Shutting down MedRisk AI API')

app = FastAPI(
    title='MedRisk AI API',
    description='Heart Disease Risk Prediction API — Educational Purpose Only',
    version='1.0.0',
    lifespan=lifespan,
)

# Initialize service on app state at startup
app.state.prediction_service = PredictionService()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(prediction.router, tags=['Prediction'])
app.include_router(metrics.router, tags=['Model Information'])

@app.get('/health', tags=['Health'])
async def health_check(request: Request):
    service = request.app.state.prediction_service
    # If not loaded yet, try refreshing once
    if not service.model_loaded:
        service._load_model()
        service._load_metrics()
    return {
        'status': 'healthy',
        'model_loaded': service.model_loaded,
        'model_name': service.model_name if service.model_loaded else None,
    }
