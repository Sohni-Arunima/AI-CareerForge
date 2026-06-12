from app.services.smart_resume_service import build_resume_content

from app.services.template_renderer import create_resume_docx



def choose_template(profile):


    text = str(profile).lower()


    if (
        "machine learning" in text
        or "artificial intelligence" in text
        or "developer" in text
        or "python" in text
    ):

        return "tech"


    elif (
        "data" in text
        or "analytics" in text
        or "power bi" in text
    ):

        return "data"


    elif (
        "research" in text
        or "paper" in text
        or "publication" in text
    ):

        return "research"


    else:

        return "professional"





def generate_complete_resume(
        profile,
        template_mode
):


    # Auto choose template

    if template_mode == "auto":

        selected_template = choose_template(
            profile
        )


    else:

        selected_template = template_mode




    # AI creates resume content

    ai_resume = build_resume_content(
        profile
    )




    resume_data = {

        "name": profile.get(
            "name",
            "Candidate"
        ),


        "role": profile.get(
            "target_role",
            ""
        ),


        "summary": ai_resume,


        "skills": ", ".join(
            profile.get(
                "skills",
                []
            )
        ),


        "projects": str(
            profile.get(
                "projects",
                ""
            )
        ),


        "education": profile.get(
            "education",
            ""
        ),


        "experience": str(
            profile.get(
                "experience",
                ""
            )
        ),


        "certifications": str(
            profile.get(
                "certifications",
                ""
            )
        )

    }




    file_path=create_resume_docx(

        resume_data,

        selected_template

    )




    return {

        "template_selected":selected_template,

        "resume_file":file_path,

        "ai_resume":ai_resume

    }