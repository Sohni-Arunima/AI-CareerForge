from fastapi import APIRouter, UploadFile, File, Form

from typing import Optional

import os

import shutil



from app.services.parser_service import extract_resume_text


from app.services.career_workspace_service import create_workspace




router = APIRouter(

    prefix="/workspace",

    tags=["Career Workspace"]

)




def process_upload(

        file

):


    folder="uploads"


    if not os.path.exists(folder):

        os.makedirs(folder)



    path = (

        folder

        +

        "/"

        +

        file.filename

    )



    with open(path,"wb") as buffer:


        shutil.copyfileobj(

            file.file,

            buffer

        )



    return extract_resume_text(

        path

    )







@router.post("/create")

async def create_career_workspace(



    resume_file: Optional[UploadFile]=File(None),


    resume_text: Optional[str]=Form(None),



    jd_file: Optional[UploadFile]=File(None),


    job_description: Optional[str]=Form(None)



):


    # Resume source

    if resume_file:


        final_resume = process_upload(

            resume_file

        )


    else:


        final_resume = resume_text






    # JD source

    if jd_file:


        final_jd = process_upload(

            jd_file

        )


    else:


        final_jd = job_description






    workspace_id = create_workspace(

        final_resume,

        final_jd

    )




    return {


        "workspace_id": workspace_id,


        "message":

        "Career workspace created successfully 🚀"

    }