from fastapi import APIRouter

from fastapi.responses import FileResponse

from pydantic import BaseModel

from app.services.pdf_service import create_pdf



router = APIRouter(
    prefix="/pdf",
    tags=["PDF Export"]
)




class PDFInput(BaseModel):

    content: str





@router.post("/generate")

def generate_pdf(data: PDFInput):


    file_path = create_pdf(
        data.content
    )


    return FileResponse(

        file_path,

        media_type="application/pdf",

        filename="AI_CareerForge_Resume.pdf"

    )