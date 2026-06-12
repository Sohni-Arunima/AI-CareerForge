from app.services.ai_service import generate_ai_response



# -----------------------------
# Portfolio Generator
# -----------------------------

def generate_portfolio(profile):

    prompt = f"""

You are an expert portfolio website designer.

Create a professional developer portfolio.

Student Details:

{profile}


Generate:

1. Hero section

2. About me section

3. Technical skills section

4. Project cards with descriptions

5. Achievement section

6. Contact section

7. Professional tagline


Make it suitable for recruiters.

"""

    return generate_ai_response(prompt)





# -----------------------------
# Career Roadmap Generator
# -----------------------------

def generate_roadmap(current_profile, goal):

    prompt = f"""

You are an AI career mentor.

Create a personalized career roadmap.


Current Profile:

{current_profile}


Career Goal:

{goal}



Generate:

1. Month-wise learning plan

2. Skills to learn

3. Project ideas

4. Certifications

5. Interview preparation plan

6. Final career checklist


"""

    return generate_ai_response(prompt)





# -----------------------------
# Resume Version Comparison
# -----------------------------

def compare_resume(old_resume, new_resume):

    prompt = f"""

Act as a professional resume reviewer.

Compare these two resume versions.


OLD RESUME:

{old_resume}



NEW RESUME:

{new_resume}



Provide:

1. Improvement score

2. Added strengths

3. Removed weaknesses

4. Keyword improvements

5. Final recommendation


"""

    return generate_ai_response(prompt)