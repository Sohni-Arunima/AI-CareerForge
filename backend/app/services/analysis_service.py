from app.services.ai_service import generate_ai_response


# -------------------------------
# Job Specific Resume Optimization
# -------------------------------

def optimize_resume(resume, job_description):

    prompt = f"""

You are an expert career coach.

Optimize this resume according to the given job description.

Resume:
{resume}


Job Description:
{job_description}


Perform:

1. Rewrite resume content for this job
2. Add important keywords
3. Improve weak sections
4. Highlight matching skills
5. Make it ATS friendly


Return optimized resume.

"""

    return generate_ai_response(prompt)



# -------------------------------
# ATS Analyzer
# -------------------------------

def analyze_ats(resume):

    prompt = f"""

Act as an ATS resume scanning system.

Analyze this resume:

{resume}


Give:

1. ATS Score out of 100

2. Missing keywords

3. Formatting problems

4. Weak points

5. Suggestions for improvement

"""

    return generate_ai_response(prompt)




# -------------------------------
# Job Match Score
# -------------------------------

def job_match(resume, job_description):

    prompt = f"""

Compare the candidate resume with job description.


Resume:
{resume}


Job Description:
{job_description}


Generate:

1. Match percentage

2. Matching skills

3. Missing skills

4. Strength areas

5. Improvement suggestions


"""

    return generate_ai_response(prompt)