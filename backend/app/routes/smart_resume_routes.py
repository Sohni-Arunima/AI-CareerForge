from fastapi import APIRouter

from app.models.profile import StudentProfile

from app.services.smart_resume_service import build_resume_content



router = APIRouter(

    prefix="/smart-resume",

    tags=["AI Smart Resume"]

)




@router.post("/generate")

def generate_resume(profile: StudentProfile):


    result = build_resume_content(

        profile.dict()

    )


    return {

        "generated_resume": result,

        "template_used": profile.template,

        "target_role": profile.target_role

    }