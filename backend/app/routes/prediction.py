from fastapi import APIRouter, Request, HTTPException
from ..schemas.prediction import PredictionInput, PredictionResponse

router = APIRouter()

@router.post('/predict', response_model=PredictionResponse)
async def predict(input_data: PredictionInput, request: Request):
    service = request.app.state.prediction_service
    if not service.model_loaded:
        raise HTTPException(status_code=503, detail='Model not trained. Run python train.py first.')
    try:
        result = service.predict(input_data)
        return PredictionResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
