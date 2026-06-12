from fastapi import APIRouter



from app.services.project_recommendation_service import recommend_projects



from app.services.career_workspace_service import (

    get_workspace,

    save_result

)





router = APIRouter(

    prefix="/projects",

    tags=["Project Intelligence"]

)






@router.get(

    "/recommend/{workspace_id}"

)

def recommend(

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






    result = recommend_projects(


        workspace["resume_text"],


        workspace["job_description"]

    )







    save_result(

        workspace_id,

        "projects",

        result

    )






    return result