from app.services.ai_service import generate_ai_response



def build_resume_content(profile):


    prompt=f"""


You are AI CareerForge Resume Intelligence Engine.


Create an ATS optimized resume.


Candidate:


{profile}



Rules:


1. Create strong professional summary

2. Improve project descriptions

3. Add measurable impact

4. Optimize for target role

5. Include job description keywords

6. Keep it professional


Return sections:

summary

skills

experience

projects

education

certifications

achievements


"""


    result = generate_ai_response(prompt)


    return result