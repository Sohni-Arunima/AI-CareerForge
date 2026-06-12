def recommend_projects(
        resume_text,
        job_description
):


    resume = resume_text.lower()

    jd = job_description.lower()



    recommendations = []



    # AI / ML


    if (

        "machine learning" in jd

        and

        "machine learning" not in resume

    ):


        recommendations.append(

            {

            "project":

            "End-to-End Machine Learning Prediction System",


            "skills_gained":

            [

            "ML",

            "Python",

            "Model Evaluation"

            ],


            "difficulty":

            "Intermediate"

            }

        )





    # Deep Learning


    if (

        "deep learning" in jd

        and

        "deep learning" not in resume

    ):


        recommendations.append(

            {

            "project":

            "Computer Vision Image Recognition System",


            "skills_gained":

            [

            "CNN",

            "TensorFlow",

            "OpenCV"

            ],


            "difficulty":

            "Advanced"

            }

        )






    # Cloud


    if (

        "aws" in jd

        and

        "aws" not in resume

    ):


        recommendations.append(

            {

            "project":

            "Cloud ML Model Deployment Pipeline",


            "skills_gained":

            [

            "AWS",

            "Docker",

            "Deployment"

            ],


            "difficulty":

            "Advanced"

            }

        )





    # Full stack


    if (

        "react" in jd

        and

        "react" not in resume

    ):


        recommendations.append(

            {

            "project":

            "AI Powered Full Stack Application",


            "skills_gained":

            [

            "React",

            "API",

            "Backend"

            ],


            "difficulty":

            "Intermediate"

            }

        )





    return {


        "recommended_projects":

        recommendations,


        "message":

        "Projects selected based on your resume gaps and target role"

    }