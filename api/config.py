import os
from typing import List, Union

class Settings:
    # Secure environment variables with default fallback
    SECRET_AI_API_KEY: Union[str, None] = os.getenv("SECRET_AI_API_KEY")
    
    # Predefined API key with secure default
    API_KEY: str = "bWFzdGVyQHNjcnRsYWJzLmNvbTpTZWNyZXROZXR3b3JrTWFzdGVyS2V5X18yMDI1"
    
    # CORS and Origin Configuration
    @property
    def CORS_ORIGINS(self) -> List[str]:
        """
        Dynamically generate CORS origins with intelligent fallback.
        Prioritizes environment variable, falls back to wildcard.
        """
        origins = os.getenv("CORS_ORIGINS", "*").split(",")
        return ["*"] if "*" in origins else origins
    
    @property
    def ALLOWED_ORIGINS(self) -> List[str]:
        """
        Dynamically generate allowed origins with intelligent fallback.
        Prioritizes environment variable, falls back to wildcard.
        """
        origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")
        return ["*"] if "*" in origins else origins

    def __repr__(self) -> str:
        """
        Provide a string representation of the settings for debugging.
        """
        return f"Settings(SECRET_AI_API_KEY={'*' * 8 if self.SECRET_AI_API_KEY else 'Not Set'})"

settings = Settings()