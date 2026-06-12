from fastapi import APIRouter



from app.services.report_service import generate_career_report



from app.services.career_workspace_service import get_workspace





router = APIRouter(

    prefix="/career-report",

    tags=["Career Report"]

)






@router.get(

    "/generate/{workspace_id}"

)

def create_report(

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






    return generate_career_report(

        workspace_id,

        workspace

    )