from fastapi import APIRouter
from app.services.ai_service import generate_ai_response


router = APIRouter(
    prefix="/ai",
    tags=["AI"]
)


@router.post("/generate")
def generate(prompt: str):

    result = generate_ai_response(prompt)

    return {
        "response": result
    }