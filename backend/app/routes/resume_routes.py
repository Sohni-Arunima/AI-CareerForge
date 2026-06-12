from fastapi import APIRouter

from app.models.profile import StudentProfile

from app.services.resume_service import create_resume


router = APIRouter(
    prefix="/resume",
    tags=["Resume Generator"]
)


@router.post("/generate")

def generate_resume(profile: StudentProfile):

    resume = create_resume(profile)

    return {

        "generated_resume": resume

    }