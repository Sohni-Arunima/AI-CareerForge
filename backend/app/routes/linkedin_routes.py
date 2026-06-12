from fastapi import APIRouter, Form

from typing import Optional



from app.services.linkedin_service import optimize_linkedin



from app.services.career_workspace_service import (

    get_workspace,

    save_result

)





router = APIRouter(

    prefix="/linkedin",

    tags=["LinkedIn Intelligence"]

)






@router.post(

    "/optimize/{workspace_id}"

)

def linkedin_optimizer(


    workspace_id:str,


    current_about:Optional[str]=Form(None)

):




    workspace=get_workspace(

        workspace_id

    )




    if not workspace:


        return {

            "error":

            "Workspace not found"

        }






    result=optimize_linkedin(


        workspace["resume_text"],


        workspace["job_description"],


        current_about

    )





    save_result(

        workspace_id,

        "linkedin",

        result

    )






    return result