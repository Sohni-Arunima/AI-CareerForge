from fastapi import APIRouter



from app.services.resume_health_service import analyze_resume_health



from app.services.career_workspace_service import (

    get_workspace,

    save_result

)





router = APIRouter(

    prefix="/resume-health",

    tags=["Resume Health Intelligence"]

)







@router.get(

    "/analyze/{workspace_id}"

)

def check_resume_health(

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







    result = analyze_resume_health(

        workspace["resume_text"]

    )







    save_result(

        workspace_id,

        "resume_health",

        result

    )







    return result