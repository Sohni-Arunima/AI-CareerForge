from fastapi import APIRouter



from app.services.company_match_service import calculate_company_match


from app.services.career_workspace_service import (

    get_workspace,

    save_result

)




router = APIRouter(

    prefix="/company-match",

    tags=["Company Match Intelligence"]

)







@router.get(

    "/analyze/{workspace_id}"

)

def analyze_company_match(

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





    result = calculate_company_match(


        workspace["resume_text"],


        workspace["job_description"]

    )





    save_result(

        workspace_id,

        "company_match",

        result

    )





    return result