def generate_interview_questions(
        resume_text,
        job_description
):


    resume = resume_text.lower()

    jd = job_description.lower()



    technical = []

    project = []

    weak = []



    # ------------------
    # SKILL QUESTIONS
    # ------------------


    skills = [

        "python",

        "machine learning",

        "sql",

        "deep learning",

        "aws",

        "docker",

        "react"

    ]



    for skill in skills:


        if skill in resume:


            technical.append(

                f"Explain your experience with {skill}."

            )


        elif skill in jd:


            weak.append(

                f"The company requires {skill}. Explain basic concepts of {skill}."

            )





    # ------------------
    # PROJECT QUESTIONS
    # ------------------


    if "project" in resume:


        project.extend(

            [

            "Explain your project architecture.",

            "What challenges did you face?",

            "How did you improve performance?"

            ]

        )




    # ------------------
    # SCORE
    # ------------------


    readiness = (

        len(technical)

        /

        len(skills)

    ) * 100





    return {


        "interview_readiness":

        round(readiness,2),



        "technical_questions":

        technical,



        "project_questions":

        project,



        "weak_area_questions":

        weak

    }