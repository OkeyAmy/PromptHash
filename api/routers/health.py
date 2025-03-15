from fastapi import APIRouter, HTTPException
from secret_ai_sdk.secret import Secret

router = APIRouter()

@router.get("/health", tags=["System"])
async def health_check():
    try:
        from api.main import secret_client 
        
        models = secret_client.get_models()
        return {
            "status": "healthy",
            "secret_network_connection": "connected",
            "available_models": len(models),
            "api_version": "1.0.0"
        }
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail={
                "status": "unhealthy",
                "error": str(e),
                "secret_network_connection": "disconnected"
            }
        )