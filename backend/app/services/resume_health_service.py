import re



def analyze_resume_health(
        resume_text
):


    text = resume_text.lower()



    issues = []

    suggestions = []




    # --------------------
    # CONTENT QUALITY
    # --------------------


    word_count = len(

        text.split()

    )



    if word_count > 400:


        content_score = 90


    elif word_count > 200:


        content_score = 70


    else:


        content_score = 50



        issues.append(

            "Resume content is too short"

        )


        suggestions.append(

            "Add detailed projects and achievements"

        )





    # --------------------
    # IMPACT WORD CHECK
    # --------------------


    strong_words = [

        "developed",

        "created",

        "implemented",

        "designed",

        "optimized",

        "improved"

    ]




    impact_count = sum(


        word in text


        for word in strong_words


    )




    impact_score = min(

        100,

        impact_count * 20

    )




    if impact_score < 60:


        issues.append(

            "Few strong action verbs found"

        )


        suggestions.append(

            "Use action verbs like Developed, Implemented, Optimized"

        )






    # --------------------
    # NUMBERS CHECK
    # --------------------


    numbers = re.findall(

        r"\d+",

        resume_text

    )




    if len(numbers) < 3:


        issues.append(

            "Lack of measurable achievements"

        )


        suggestions.append(

            "Add numbers like accuracy %, users, performance improvement"

        )






    # --------------------
    # READABILITY
    # --------------------


    sentences = resume_text.count(".")



    readability = 90 if sentences > 5 else 70





    # --------------------
    # FINAL SCORE
    # --------------------



    health_score = (


        content_score * 0.4

        +

        impact_score * 0.3

        +

        readability * 0.3

    )





    return {


        "resume_health_score":

        round(

            health_score,

            2

        ),



        "breakdown":{


            "content_quality":

            content_score,


            "impact_score":

            impact_score,


            "readability":

            readability

        },



        "red_flags":

        issues,



        "recommendations":

        suggestions

    }