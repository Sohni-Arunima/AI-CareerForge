def generate_dashboard(
        workspace
):


    results = workspace.get(
        "results",
        {}
    )



    ats = results.get(
        "ats",
        {}
    )



    company = results.get(
        "company_match",
        {}
    )



    health = results.get(
        "resume_health",
        {}
    )



    skills = results.get(
        "skill_radar",
        {}
    )



    roles = results.get(
        "job_roles",
        {}
    )



    timeline = results.get(
        "timeline",
        {}
    )





    ats_score = ats.get(
        "ats_score",
        0
    )



    company_score = company.get(
        "overall_company_match",
        0
    )



    health_score = health.get(
        "resume_health_score",
        0
    )






    career_readiness = round(

        (

        ats_score

        +

        company_score

        +

        health_score

        )

        /

        3,

        2

    )






    return {


        "summary_cards":{


            "ats_score":

            ats_score,



            "company_match":

            company_score,



            "resume_health":

            health_score,



            "career_readiness":

            career_readiness

        },






        "skill_chart":

        skills.get(

            "skill_scores",

            {}

        ),






        "recommended_roles":

        roles.get(

            "role_scores",

            {}

        ),






        "growth_timeline":

        timeline.get(

            "growth_prediction",

            {}

        ),






        "recent_analysis":

        list(

            results.keys()

        )

    }