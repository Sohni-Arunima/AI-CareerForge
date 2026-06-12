from fastapi import APIRouter, UploadFile, File, Form

from typing import Optional

import shutil
import os


from app.services.ats_service import calculate_ats_score

from app.services.parser_service import extract_resume_text



router = APIRouter(

    prefix="/ats",

    tags=["ATS Intelligence"]

)




def save_and_extract(file):


    folder = "uploads"


    if not os.path.exists(folder):

        os.makedirs(folder)



    file_path = (
        folder
        +
        "/"
        +
        file.filename
    )


    with open(file_path,"wb") as buffer:


        shutil.copyfileobj(

            file.file,

            buffer

        )
    extracted = extract_resume_text(
        file_path
    )

    return extracted






@router.post("/analyze")

async def analyze_resume(


    resume_file: Optional[UploadFile] = File(None),


    resume_text: Optional[str] = Form(None),


    jd_file: Optional[UploadFile] = File(None),


    job_description: Optional[str] = Form(None)


):

    # endpoint called



    # --------------------
    # Resume input
    # --------------------


    if resume_file:


        final_resume = save_and_extract(

            resume_file

        )


    else:


        final_resume = resume_text




    # --------------------
    # JD input
    # --------------------


    if jd_file:


        final_jd = save_and_extract(

            jd_file

        )


    else:


        final_jd = job_description





    if not final_resume or not final_jd:


        return {

            "error":

            "Please provide resume and job description"

        }

        # debug: log final resume/jd lengths and previews before scoring
        try:
            print(f"[ATS] Final resume length: {len(final_resume)}")
            print(f"[ATS] Final resume preview: {final_resume[:500]!r}")
        except Exception as e:
            print(f"[ATS] Error printing resume preview: {e}")

        try:
            print(f"[ATS] Final JD length: {len(final_jd)}")
            print(f"[ATS] Final JD preview: {final_jd[:500]!r}")
        except Exception as e:
            print(f"[ATS] Error printing JD preview: {e}")






    result = calculate_ats_score(

        final_resume,

        final_jd

    )





    return {


        "ats_result": result

    }