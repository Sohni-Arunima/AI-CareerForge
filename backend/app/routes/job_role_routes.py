from fastapi import APIRouter



from app.services.job_role_service import predict_job_roles



from app.services.career_workspace_service import (

    get_workspace,

    save_result

)





router = APIRouter(

    prefix="/job-role",

    tags=["Job Role Intelligence"]

)






@router.get(

    "/predict/{workspace_id}"

)

def predict_role(

        workspace_id:str

):


    workspace=get_workspace(

        workspace_id

    )




    if not workspace:


        return {

            "error":

            "Workspace not found"

        }






    result=predict_job_roles(

        workspace["resume_text"]

    )





    save_result(

        workspace_id,

        "job_roles",

        result

    )





    return result