from fastapi import APIRouter, UploadFile, File

from app.services.parser_service import extract_resume_text

import shutil

import os



router = APIRouter(
    prefix="/upload",
    tags=["Resume Upload"]
)



@router.post("/resume")

async def upload_resume(file: UploadFile = File(...)):


    folder = "uploads"


    if not os.path.exists(folder):

        os.makedirs(folder)



    file_path = f"{folder}/{file.filename}"



    with open(file_path, "wb") as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )



    extracted_text = extract_resume_text(
        file_path
    )


    return {

        "filename": file.filename,

        "extracted_resume": extracted_text

    }