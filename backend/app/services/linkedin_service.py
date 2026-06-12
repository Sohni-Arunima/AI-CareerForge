def optimize_linkedin(
        resume_text,
        job_description,
        current_about=None
):


    resume = resume_text.lower()

    jd = job_description.lower()



    skills = []



    skill_bank = [

        "python",

        "machine learning",

        "deep learning",

        "sql",

        "power bi",

        "aws",

        "docker",

        "react"

    ]



    for skill in skill_bank:


        if skill in resume:


            skills.append(skill)






    missing = []



    for skill in skill_bank:


        if skill in jd and skill not in resume:


            missing.append(skill)







    headline = (

        "Technology Professional | "

        +

        " | ".join(skills[:4])

    )






    about = f"""

Passionate technology enthusiast with experience in {", ".join(skills)}.

I enjoy building real-world projects, solving problems,
and continuously improving my technical skills.

Currently focusing on industry-ready solutions
and professional growth.

"""





    score = 70 + len(skills)*5



    if current_about:


        score += 5





    if score > 100:


        score = 100






    return {


        "linkedin_score":

        score,



        "optimized_headline":

        headline,



        "optimized_about":

        about,



        "recommended_skills_to_add":

        missing,



        "profile_improvements":[


            "Add GitHub project links",


            "Add certifications",


            "Add measurable achievements",


            "Enable Open To Work preferences"

        ]

    }