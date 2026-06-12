from fastapi import APIRouter



from app.services.skill_radar_service import generate_skill_radar



from app.services.career_workspace_service import (

    get_workspace,

    save_result

)






router = APIRouter(

    prefix="/skill-radar",

    tags=["Skill Intelligence"]

)







@router.get(

    "/analyze/{workspace_id}"

)

def analyze_skills(

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






    result = generate_skill_radar(


        workspace["resume_text"],


        workspace["job_description"]

    )






    save_result(

        workspace_id,

        "skill_radar",

        result

    )






    return result