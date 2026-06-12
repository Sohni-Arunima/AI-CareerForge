from fastapi import APIRouter

from fastapi.responses import FileResponse

from pydantic import BaseModel


from app.services.template_renderer import create_resume_docx



router = APIRouter(

    prefix="/resume-template",

    tags=["Designed Resume Templates"]

)




class ResumeTemplateInput(BaseModel):

    name:str

    role:str

    summary:str

    skills:str

    projects:str

    education:str

    experience:str = ""

    certifications:str = ""

    template:str






@router.post("/download")

def download_template(
    data: ResumeTemplateInput
):


    resume_data = data.dict()


    template = resume_data.pop(
        "template"
    )



    file=create_resume_docx(

        resume_data,

        template

    )



    return FileResponse(

        file,

        filename="AI_CareerForge_Resume.docx"

    )