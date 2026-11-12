from fastapi import APIRouter, Request, HTTPException
from ..schemas.prediction import MetricsResponse, ModelInfoResponse

router = APIRouter()

@router.get('/model-info', response_model=ModelInfoResponse)
async def get_model_info(request: Request):
    service = request.app.state.prediction_service
    info = service.get_model_info()
    if not info:
        raise HTTPException(status_code=503, detail='Model not trained. Run python train.py first.')
    return ModelInfoResponse(**info)

@router.get('/metrics', response_model=MetricsResponse)
async def get_metrics(request: Request):
    service = request.app.state.prediction_service
    metrics = service.get_metrics()
    if not metrics:
        raise HTTPException(status_code=503, detail='Model not trained. Run python train.py first.')
    return MetricsResponse(**metrics)
