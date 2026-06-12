from fastapi import APIRouter

from pydantic import BaseModel

from app.services.career_service import (
    analyze_skill_gap,
    enhance_resume,
    generate_cover_letter
)


router = APIRouter(
    prefix="/career",
    tags=["Career Assistant"]
)



class SkillInput(BaseModel):

    profile: str

    target_role: str




class EnhanceInput(BaseModel):

    content: str




class CoverLetterInput(BaseModel):

    profile: str

    company: str

    role: str





@router.post("/skill-gap")

def skill_gap(data: SkillInput):

    result = analyze_skill_gap(
        data.profile,
        data.target_role
    )

    return {
        "skill_gap_analysis": result
    }






@router.post("/enhance-resume")

def enhance(data: EnhanceInput):

    result = enhance_resume(
        data.content
    )


    return {
        "enhanced_resume": result
    }







@router.post("/cover-letter")

def cover_letter(data: CoverLetterInput):

    result = generate_cover_letter(

        data.profile,

        data.company,

        data.role

    )


    return {
        "cover_letter": result
    }