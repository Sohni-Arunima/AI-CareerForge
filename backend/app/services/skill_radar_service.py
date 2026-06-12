import re



def get_words(text):


    return set(

        re.findall(

            r"\b[a-zA-Z+#]+\b",

            text.lower()

        )

    )







def generate_skill_radar(

        resume_text,

        job_description

):


    resume_words = get_words(

        resume_text

    )


    jd_words = get_words(

        job_description

    )




    common_skills = {


        "python",

        "java",

        "sql",

        "machine",

        "learning",

        "deep",

        "tensorflow",

        "pytorch",

        "power",

        "bi",

        "tableau",

        "excel",

        "aws",

        "azure",

        "docker",

        "git",

        "react",

        "javascript",

        "html",

        "css"

    }





    required_skills = (

        jd_words

        &

        common_skills

    )




    radar = {}




    for skill in required_skills:


        if skill in resume_words:


            radar[skill] = 90


        else:


            radar[skill] = 25





    strengths = [


        skill

        for skill,value in radar.items()

        if value >= 70

    ]




    improvements = [


        skill

        for skill,value in radar.items()

        if value < 70

    ]





    return {


        "skill_scores":

        radar,



        "strong_skills":

        strengths,



        "skills_to_improve":

        improvements

    }