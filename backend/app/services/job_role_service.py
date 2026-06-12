def predict_job_roles(
        resume_text
):


    resume = resume_text.lower()



    roles = {


        "AI Engineer":[

            "machine learning",
            "deep learning",
            "python",
            "tensorflow",
            "pytorch",
            "ai"

        ],



        "Data Scientist":[

            "python",
            "machine learning",
            "statistics",
            "data analysis",
            "sql"

        ],




        "Data Analyst":[

            "sql",
            "excel",
            "power bi",
            "tableau",
            "visualization"

        ],





        "Backend Developer":[

            "python",
            "java",
            "api",
            "database",
            "django",
            "fastapi"

        ],





        "Frontend Developer":[

            "html",
            "css",
            "javascript",
            "react"

        ]


    }




    scores={}



    for role,skills in roles.items():


        matched=0



        for skill in skills:


            if skill in resume:


                matched += 1




        scores[role] = round(

            (

            matched

            /

            len(skills)

            )

            *

            100,

            2

        )





    best_role=max(

        scores,

        key=scores.get

    )





    return {


        "role_scores":

        scores,



        "best_matching_role":

        best_role,



        "confidence":

        scores[best_role]

    }