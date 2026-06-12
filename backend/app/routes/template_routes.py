from fastapi import APIRouter

from pydantic import BaseModel

from app.services.template_service import generate_template_resume



router = APIRouter(

    prefix="/template",

    tags=["Resume Templates"]

)




class TemplateInput(BaseModel):

    profile: str

    template: str

    role: str





@router.post("/generate")

def create_resume_template(
    data: TemplateInput
):


    result = generate_template_resume(

        data.profile,

        data.template,

        data.role

    )


    return {

        "template": data.template,

        "resume": result

    }