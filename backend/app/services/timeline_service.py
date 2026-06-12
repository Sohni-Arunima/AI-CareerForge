def generate_career_timeline(
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



    ats_score = ats.get(
        "ats_score",
        60
    )



    company_score = company.get(
        "overall_company_match",
        60
    )



    health_score = health.get(
        "resume_health_score",
        60
    )




    current = (

        ats_score

        +

        company_score

        +

        health_score

    ) / 3





    timeline = {


        "current_level":

        round(
            current,
            2
        ),



        "growth_prediction":{


            "month_1":

            min(
                current + 10,
                100
            ),


            "month_3":

            min(
                current + 20,
                100
            ),


            "month_6":

            min(
                current + 30,
                100
            )

        },




        "improvement_plan":[


            "Complete missing skills",


            "Improve resume keywords",


            "Build recommended projects",


            "Prepare interview questions"

        ]

    }




    return timeline