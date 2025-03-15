from fastapi import HTTPException, Security, Request
from fastapi.security import APIKeyHeader
from api.config import settings
import os

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

async def verify_api_key(request: Request, api_key=Security(api_key_header)):
    # Set SECRET_AI_API_KEY if not already set
    if not os.getenv("SECRET_AI_API_KEY"):
        os.environ['SECRET_AI_API_KEY'] = "bWFzdGVyQHNjcnRsYWJzLmNvbTpTZWNyZXROZXR3b3JrTWFzdGVyS2V5X18yMDI1"
    
    # Get environment
    environment = os.getenv("ENVIRONMENT", "development")
    
    # In production, we allow all requests without requiring API key
    if environment == "production":
        # For extra security, you can check the API key if provided
        if api_key and api_key != settings.API_KEY:
            raise HTTPException(status_code=403, detail="Invalid API key")
        
        # All requests are allowed by default
        return api_key
    
    # In development, also allow all requests
    return api_key