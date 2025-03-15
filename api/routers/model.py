from fastapi import APIRouter, Depends, HTTPException
from api.config import settings
from api.security import verify_api_key
from typing import Dict, Any

router = APIRouter()

@router.get("/models", tags=["Models"])
async def get_available_models(api_key: str = Depends(verify_api_key)):
    try:
        from api.main import secret_client  # Import here to avoid circular imports
        
        models = secret_client.get_models()
        model_info = {
            "deepseek-r1:70b": {
                "description": "Advanced language model for text generation and analysis",
                "capabilities": ["text generation", "code generation", "analysis"],
                "max_tokens": 8192,
                "recommended_temperature": 0.7
            },
            "llama3.2-vision": {
                "description": "Multimodal model capable of processing both text and images",
                "capabilities": ["image analysis", "text generation", "visual reasoning"],
                "max_tokens": 4096,
                "recommended_temperature": 0.8
            }
        }
        return {
            "models": models,
            "model_details": {model: model_info.get(model, {}) for model in models}
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving models: {str(e)}")