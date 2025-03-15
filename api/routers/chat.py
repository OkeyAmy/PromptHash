from fastapi import APIRouter, Depends, HTTPException
from api.config import settings
from api.security import verify_api_key
from secret_ai_sdk.secret_ai import ChatSecret
from datetime import datetime
from uuid import uuid5, NAMESPACE_DNS
from typing import Dict, List, Any
from api.models import AvailableModels

router = APIRouter()

chat_sessions: Dict[str, List[dict]] = {}

@router.get("/chat", tags=['Generation'])
async def chat_with_model(
    prompt: str,
    model: AvailableModels = AvailableModels.DEEPSEEK,
    api_key: str = Depends(verify_api_key)
):
    try:
        from api.main import secret_client  
        
        session_id = f"session_{uuid5(NAMESPACE_DNS, api_key)}"
        urls = secret_client.get_urls(model=model)
        if not urls:
            raise HTTPException(status_code=404, detail="Model not found")
        secret_ai_llm = ChatSecret(
            base_url=urls[0],
            model=model,
            temperature=0.3
        )
        
        system_prompt = """You are a thoughtful and helpful assistant when hlps user's whith their prompt/question. When answering user questions:
1. Take time to think carefully about the question
2. Consider multiple perspectives and approaches
3. Provide accurate, relevant, and complete information
4. Ensure your responses are clear and easy to understand
5. If you're uncertain about something, acknowledge it transparently
6. Use examples when it helps clarify your explanations
7. Remember previous parts of the conversation to maintain context
8. Ask clarifying questions if the user's request is ambiguous
9. You only respond to user with an appropiate response
Your goal is to provide the most helpful and satisfying response possible, ensuring the user's needs are fully addressed."""

        messages = chat_sessions.get(session_id, [("system", system_prompt)])
        if len(messages) == 0:
            messages.append(("system", system_prompt))
        messages.append(("user", prompt))
        
        response = secret_ai_llm.invoke(messages)
        messages.append(("assistant", response.content))
        chat_sessions[session_id] = messages
        
        # Handle response based on model
        if model == AvailableModels.LLAMA_VISION:
            return {"response": response.content}
        else:
            # For DeepSeek model, parse think/response tags
            content = response.content
            
            # Debug the actual content received
            print(f"Raw response content: {content}")
            
            if "<think>" in content and "</think>" in content:
                try:
                    think_start = content.find("<think>") + len("<think>")
                    think_end = content.find("</think>")
                    think_output = content[think_start:think_end].strip()
                    actual_response = content[think_end + len("</think>"):].strip()
                    
                    # Return both parts separately
                    return {
                        "Think Process": think_output,
                        "Response": actual_response
                    }
                except Exception as parsing_error:
                    print(f"Error parsing think tags: {parsing_error}")
                    # Fall back to returning the whole response
                    return {"response": content}
            else:
                # No think tags found, return the whole response
                return {"response": content}

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error chatting with model: {str(e)}"
        )