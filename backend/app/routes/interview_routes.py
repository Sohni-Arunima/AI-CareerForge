from fastapi import APIRouter


from app.services.interview_service import generate_interview_questions


from app.services.career_workspace_service import (

    get_workspace,

    save_result

)




router = APIRouter(

    prefix="/interview",

    tags=["Interview Intelligence"]

)






@router.get(

    "/generate/{workspace_id}"

)

def interview_predictor(

        workspace_id:str

):



    workspace = get_workspace(

        workspace_id

    )




    if not workspace:


        return {

            "error":

            "Workspace not found"

        }





    result = generate_interview_questions(


        workspace["resume_text"],


        workspace["job_description"]

    )





    save_result(

        workspace_id,

        "interview",

        result

    )




    return result