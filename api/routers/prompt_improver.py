from fastapi import APIRouter, Depends, HTTPException, Body
from api.config import settings
from api.security import verify_api_key
from secret_ai_sdk.secret_ai import ChatSecret
from pydantic import BaseModel
from typing import Dict, Any
from api.models import AvailableModels

router = APIRouter()
# System prompt for prompt improvement
PROMPT_IMPROVER_SYSTEM_PROMPT = {
    "role": "system",
    "content": """You are an expert prompt engineer specializing in improving prompts across all domains.
Your task is to:
1. Understand the user's intent from their prompt
2. Identify the most suitable category for the prompt
3. Apply category-specific best practices and improvements
4. Enhance the prompt while maintaining the original intent
5. Make it more effective, clear, and reliable

Focus on:
- Maintaining the user's core intent
- Adding necessary context and constraints
- Improving clarity and specificity
- Optimizing for the intended use case
- Adding error prevention
- Including relevant examples or format requirements
- Making it more reusable and flexible

Always return the improved prompt in a clear, ready-to-use format."""
}

class PromptRequest(BaseModel):
    prompt: str

@router.post("/improve-prompt", tags=["Prompt Improvement"])
async def improve_prompt(
    prompt: str = Body(..., description="The prompt text to improve"),
    api_key: str = Depends(verify_api_key)
) -> dict:
    try:
        from api.main import secret_client  # Import here to avoid circular imports
        
        urls = secret_client.get_urls(model=AvailableModels.DEEPSEEK)
        if not urls:
            raise HTTPException(status_code=404, detail="Model not found")
        secret_ai_llm = ChatSecret(
            base_url=urls[0],
            model=AvailableModels.DEEPSEEK,
            temperature=0.7
        )
        
        # improvement_prompt = # Construct the improvement request
        improvement_prompt = f"""You are a highly skilled prompt engineer with extensive experience in refining and optimizing prompts for clarity, effectiveness, and comprehensive coverage. Your task is to transform the following user prompt into a more detailed and actionable version while preserving its original intent.

USER PROMPT:
{prompt}

Instructions:

Prompt Categorization:
Analyze the provided prompt and categorize it into one of the following core categories (select the most appropriate):
Creative Writing (e.g., novels, scripts, poetry)
Technical Documentation (e.g., manuals, API guides)
Marketing & Advertising (e.g., ads, social media posts)
Academic & Research (e.g., papers, theses)
User Interface/UX Design (e.g., wireframes, prototypes)
Digital Art & Graphic Design (e.g., NFTs, digital paintings)
Video Production (e.g., storyboards, editing guidelines)
Music Composition (e.g., scores, lyrics)
Customer Service (e.g., scripts, FAQs)
Business Strategy (e.g., plans, proposals)
Use the selected category to tailor language, technical terms, and contextual details.
Enhancement Objectives:
Clarity:
Replace ambiguous terms (e.g., "some," "a few") with exact quantities or percentages.
Break complex instructions into step-by-step actions.
Use active voice and imperative phrasing.
Specificity:
Include exact measurements, technical specifications, or brand names (e.g., "Adobe Photoshop 2023").
Define target demographics (e.g., "millennial urban professionals").
Specify platforms, tools, or formats (e.g., "4K resolution video for YouTube Shorts").
Context:
Add background on the project’s purpose, audience, or cultural setting.
Clarify industry standards (e.g., "GDPR compliance for EU users").
State the intended use case (e.g., "for a corporate annual report").
Constraints:
Define strict parameters (e.g., "200-word limit," "budget of $5,000").
Specify technical requirements (e.g., "compatible with iOS 16 and above").
Set boundaries for creativity (e.g., "avoid political references").
Usability:
Structure instructions with numbered steps or bullet points.
Use clear headings and subheadings.
Include examples or templates (e.g., "Sample email structure: [Subject], [Greeting], [Body]").
Comprehensiveness:
Address edge cases (e.g., "include fallback options for low-bandwidth users").
Cover all deliverables (e.g., "final files in .PNG and .SVG formats").
Anticipate user questions (e.g., "explain how to adjust for different screen sizes").
Preservation of Intent:
Cross-reference the enhanced prompt against the original to ensure alignment.
Maintain the core objective (e.g., "retain focus on promoting eco-friendly products").
Category-Specific Language:
For creative writing : Incorporate narrative structure, character arcs, and thematic elements.
For technical documentation : Use precise terminology and adhere to industry standards.
For digital art : Specify styles (e.g., "surrealism with neon gradients"), color palettes, and resolution.
For video production : Define frame rates, aspect ratios, and storytelling beats.
Response Format:
Provide only the enhanced prompt in the following structure:
Title: A concise, descriptive title (e.g., "Design a Minimalist Logo for a Sustainable Fashion Brand").
Instructions: Bullet points or numbered steps with clear, actionable directives.
Constraints: Bold or italicize limitations (e.g., "Deadline: 48 hours").
Examples: Include a sample output or visual reference (if applicable).
Exclude all commentary, explanations, or formatting beyond the prompt itself.
[Your enhanced version of the prompt]
"""
        
        messages = [
            PROMPT_IMPROVER_SYSTEM_PROMPT,
            {"role": "user", "content": improvement_prompt}
        ]

        formatted_messages = [(msg["role"], msg["content"]) for msg in messages]
        response = secret_ai_llm.invoke(formatted_messages)
        
        # Parse the response
        content = response.content
        
        # Debug the actual content received
        print(f"Raw improve_prompt response content: {content}")
        
        if "<think>" in content and "</think>" in content:
            try:
                think_start = content.find("<think>") + len("<think>")
                think_end = content.find("</think>")
                think_output = content[think_start:think_end].strip()
                actual_response = content[content.find("</think>") + len("</think>"):].strip()
                
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
            detail=f"Error improving prompt: {str(e)}"
        )