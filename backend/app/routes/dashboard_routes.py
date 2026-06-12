from fastapi import APIRouter



from app.services.dashboard_service import generate_dashboard



from app.services.career_workspace_service import get_workspace






router = APIRouter(

    prefix="/dashboard",

    tags=["Dashboard"]

)






@router.get(

    "/{workspace_id}"

)

def dashboard(

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







    return generate_dashboard(

        workspace

    )