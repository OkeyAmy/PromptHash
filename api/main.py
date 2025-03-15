import os
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Set API key directly if not already set in environment
if not os.getenv("SECRET_AI_API_KEY"):
    os.environ['SECRET_AI_API_KEY'] = "bWFzdGVyQHNjcnRsYWJzLmNvbTpTZWNyZXROZXR3b3JrTWFzdGVyS2V5X18yMDI1"

# Initialize Secret client with the API key
from secret_ai_sdk.secret import Secret
secret_client = Secret()

def create_app():
    # Minimal initialization to reduce startup time
    app = FastAPI(
        title="Secret Network AI Hub API",
        description="API for Secret Network AI models",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc"
    )

    # Simplified CORS configuration
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Simplified root endpoint with HEAD support
    @app.get("/", status_code=200)
    @app.head("/", status_code=200)
    async def root():
        return {"message": "Secret Network AI API is running", "status": "healthy"}

    # Global exception handler to prevent worker timeouts
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        logger.error(f"Unhandled exception: {exc}")
        return JSONResponse(
            status_code=500,
            content={"message": "Internal server error", "error": str(exc)}
        )

    # Lazy import of routers to reduce startup time
    try:
        from api.routers.model import router as models_router
        from api.routers.chat import router as chat_router
        from api.routers.prompt_improver import router as prompt_improver_router
        from api.routers.health import router as health_router
        
        app.include_router(models_router, prefix="/api")
        app.include_router(chat_router, prefix="/api")
        app.include_router(prompt_improver_router, prefix="/api")
        app.include_router(health_router, prefix="/api")
    except Exception as e:
        logger.error(f"Failed to import routers: {e}")

    return app

# Create the app instance
app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=10000)
