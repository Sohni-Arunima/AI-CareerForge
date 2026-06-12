import re



def calculate_ats_score(
        resume_text,
        job_description
):


    resume_lower = resume_text.lower()

    jd_lower = job_description.lower()



    # ---------------------
    # 1. KEYWORD SCORE (40)
    # ---------------------


    jd_words = set(

        re.findall(

            r"\b[a-zA-Z]+\b",

            jd_lower

        )

    )


    resume_words = set(

        re.findall(

            r"\b[a-zA-Z]+\b",

            resume_lower

        )

    )


    important_words = {

        word

        for word in jd_words

        if len(word) > 3

    }



    matched = (

        important_words

        &

        resume_words

    )



    if len(important_words) > 0:

        keyword_score = (

            len(matched)

            /

            len(important_words)

        ) * 40


    else:

        keyword_score = 40




    missing_keywords = list(

        important_words - matched

    )





    # ---------------------
    # 2. SECTION SCORE (20)
    # ---------------------


    required_sections = [

        "education",

        "skills",

        "projects",

        "experience"

    ]



    found_sections = 0



    for section in required_sections:


        if section in resume_lower:


            found_sections += 1




    section_score = (

        found_sections

        /

        len(required_sections)

    ) * 20





    # ---------------------
    # 3. FORMATTING SCORE (20)
    # ---------------------


    formatting_score = 20


    if len(resume_text) < 500:


        formatting_score -= 10



    if resume_text.count("\n") < 5:


        formatting_score -= 5




    # ---------------------
    # 4. READABILITY SCORE (20)
    # ---------------------


    sentences = resume_text.count(".")


    readability_score = 20


    if sentences < 5:


        readability_score -= 5





    total = (

        keyword_score

        +

        section_score

        +

        formatting_score

        +

        readability_score

    )




    return {


        "ats_score": round(total,2),


        "breakdown":{


            "keyword_score":round(
                keyword_score,
                2
            ),


            "section_score":round(
                section_score,
                2
            ),


            "formatting_score":
            formatting_score,


            "readability_score":
            readability_score


        },



        "matched_keywords":

            list(matched),



        "missing_keywords":

            missing_keywords[:20],



        "recommendation":

            "Improve missing keywords and strengthen resume sections"

    }