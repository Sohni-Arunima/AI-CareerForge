from app.services.ai_service import generate_ai_response



# --------------------------------
# Skill Gap Analyzer
# --------------------------------

def analyze_skill_gap(profile, target_role):

    prompt = f"""

You are an AI career mentor.

Analyze the student's current skills and target career.

Student Profile:
{profile}


Target Role:
{target_role}


Generate:

1. Current skill analysis

2. Missing technical skills

3. Missing soft skills

4. Recommended certifications

5. Project suggestions

6. Improvement plan


"""

    return generate_ai_response(prompt)




# --------------------------------
# Resume Enhancement
# --------------------------------

def enhance_resume(content):

    prompt = f"""

You are a professional resume expert.

Improve the following resume content:

{content}


Perform:

1. Rewrite weak sentences

2. Add action verbs

3. Make achievements measurable

4. Make it professional

5. Make it ATS optimized


Return improved version.

"""

    return generate_ai_response(prompt)





# --------------------------------
# Cover Letter Generator
# --------------------------------

def generate_cover_letter(profile, company, role):

    prompt = f"""

Create a professional personalized cover letter.


Student Profile:

{profile}


Company:

{company}


Applying Role:

{role}



Generate:

1. Introduction

2. Relevant skills

3. Project highlights

4. Why candidate fits company

5. Professional closing


"""

    return generate_ai_response(prompt)