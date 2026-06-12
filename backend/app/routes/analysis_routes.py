from fastapi import APIRouter

from pydantic import BaseModel

from app.services.analysis_service import (
    optimize_resume,
    analyze_ats,
    job_match
)


router = APIRouter(
    prefix="/analysis",
    tags=["Career Analysis"]
)



class ResumeInput(BaseModel):

    resume: str



class MatchInput(BaseModel):

    resume: str

    job_description: str




@router.post("/optimize")

def optimize(data: MatchInput):

    result = optimize_resume(
        data.resume,
        data.job_description
    )

    return {
        "optimized_resume": result
    }




@router.post("/ats")

def ats(data: ResumeInput):

    result = analyze_ats(
        data.resume
    )

    return {
        "ats_analysis": result
    }





@router.post("/match")

def match(data: MatchInput):

    result = job_match(
        data.resume,
        data.job_description
    )

    return {
        "job_match": result
    }