import re



def extract_keywords(text):

    words = re.findall(
        r"\b[a-zA-Z+#]+\b",
        text.lower()
    )


    ignore_words = {

        "and",
        "the",
        "with",
        "for",
        "you",
        "are",
        "our",
        "will",
        "this",
        "that",
        "have"

    }



    return {

        word

        for word in words

        if len(word) > 2

        and word not in ignore_words

    }





def calculate_company_match(

        resume_text,

        job_description

):


    resume_keywords = extract_keywords(

        resume_text

    )


    jd_keywords = extract_keywords(

        job_description

    )



    matched = resume_keywords & jd_keywords


    missing = jd_keywords - resume_keywords





    if len(jd_keywords) > 0:


        skill_score = (

            len(matched)

            /

            len(jd_keywords)

        ) * 100


    else:


        skill_score = 0





    # EXPERIENCE CHECK


    experience_score = 80 if (

        "intern"

        in resume_text.lower()

        or

        "experience"

        in resume_text.lower()

    ) else 50





    # PROJECT CHECK


    project_score = 90 if (

        "project"

        in resume_text.lower()

    ) else 50





    # EDUCATION CHECK


    education_score = 90 if (

        "btech"

        in resume_text.lower()

        or

        "degree"

        in resume_text.lower()

    ) else 60







    overall = (

        skill_score * 0.5

        +

        experience_score * 0.2

        +

        project_score * 0.2

        +

        education_score * 0.1

    )







    return {


        "overall_company_match":

        round(overall,2),



        "match_breakdown":{


            "skills":

            round(skill_score,2),



            "experience":

            experience_score,



            "projects":

            project_score,



            "education":

            education_score

        },




        "matched_requirements":

        list(matched),



        "missing_requirements":

        list(missing)[:15],




        "company_fit_level":

        (

        "Excellent Match"

        if overall >= 85

        else

        "Good Match"

        if overall >=70

        else

        "Needs Improvement"

        )

    }