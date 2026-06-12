import uuid



career_workspaces = {}




def create_workspace(

        resume_text,

        job_description,

        profile=None

):


    workspace_id = str(

        uuid.uuid4()

    )



    career_workspaces[workspace_id] = {


        "resume_text": resume_text,


        "job_description": job_description,


        "profile": profile,


        "results": {}

    }




    return workspace_id






def get_workspace(

        workspace_id

):


    return career_workspaces.get(

        workspace_id

    )







def save_result(

        workspace_id,

        feature,

        result

):


    if workspace_id in career_workspaces:


        career_workspaces[workspace_id]["results"][feature] = result



        return True



    return False