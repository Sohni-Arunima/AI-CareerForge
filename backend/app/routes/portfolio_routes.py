from fastapi import APIRouter

from pydantic import BaseModel

from app.services.portfolio_service import (
    generate_portfolio,
    generate_roadmap,
    compare_resume
)


router = APIRouter(
    prefix="/portfolio",
    tags=["Portfolio & Growth"]
)



class PortfolioInput(BaseModel):

    profile: str



class RoadmapInput(BaseModel):

    current_profile: str

    goal: str



class CompareInput(BaseModel):

    old_resume: str

    new_resume: str





@router.post("/generate")

def portfolio(data: PortfolioInput):

    result = generate_portfolio(
        data.profile
    )


    return {
        "portfolio": result
    }





@router.post("/roadmap")

def roadmap(data: RoadmapInput):

    result = generate_roadmap(

        data.current_profile,

        data.goal
    )


    return {
        "career_roadmap": result
    }






@router.post("/compare")

def compare(data: CompareInput):

    result = compare_resume(

        data.old_resume,

        data.new_resume
    )


    return {
        "comparison": result
    }