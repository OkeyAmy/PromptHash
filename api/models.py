from enum import Enum
from pydantic import BaseModel
from typing import Optional  # Add this import

class AvailableModels(str, Enum):
    DEEPSEEK = "deepseek-r1:70b"
    LLAMA_VISION = "llama3.2-vision"

class GenerateRequest(BaseModel):
    prompt: str  
    image: Optional[str] = None  
    session_id: Optional[str] = None