from fastapi import APIRouter, UploadFile, File, Form

from typing import Optional

import shutil
import os


from app.services.parser_service import extract_resume_text

from app.services.resume_intelligence_service import generate_complete_resume



router = APIRouter(

    prefix="/careerforge",

    tags=["AI CareerForge Engine"]

)



@router.post("/resume/upload")

async def resume_from_upload(

    file: UploadFile = File(...),

    target_role: str = Form(...),

    job_description: str = Form(""),

    template_mode: str = Form("auto")

):



    folder = "uploads"



    if not os.path.exists(folder):

        os.makedirs(folder)




    file_path = f"{folder}/{file.filename}"




    with open(file_path,"wb") as buffer:

        shutil.copyfileobj(

            file.file,

            buffer

        )




    extracted_text = extract_resume_text(

        file_path

    )




    profile = {


        "name":"Candidate",


        "education":extracted_text,


        "skills":[],


        "projects":[extracted_text],


        "experience":[],


        "certifications":[],


        "target_role":target_role,


        "job_description":job_description


    }




    result = generate_complete_resume(

        profile,

        template_mode

    )



    return result