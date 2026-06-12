from fastapi import APIRouter



from app.services.timeline_service import generate_career_timeline



from app.services.career_workspace_service import (

    get_workspace,

    save_result

)





router = APIRouter(

    prefix="/timeline",

    tags=["Career Growth Timeline"]

)





@router.get(

    "/generate/{workspace_id}"

)

def generate_timeline(

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





    result = generate_career_timeline(

        workspace

    )





    save_result(

        workspace_id,

        "timeline",

        result

    )





    return result