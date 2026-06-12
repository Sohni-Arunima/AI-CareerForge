from app.services.ai_service import generate_ai_response


def create_resume(profile):

    prompt = f"""

You are an expert ATS resume writer.

Generate a professional resume for a student.

Use the given profile details.

Student Information:

Name:
{profile.name}

Email:
{profile.email}

Education:
{profile.education}

Skills:
{profile.skills}

Projects:
{profile.projects}

Certifications:
{profile.certifications}

Experience:
{profile.experience}

Achievements:
{profile.achievements}

Target Job Role:
{profile.target_role}


Create:

1. Professional Summary

2. Technical Skills Section

3. Improved Project Descriptions

4. Experience Section

5. Achievements Section

6. ATS Friendly Keywords

7. Final Resume Content


Make it suitable for internships and placements.

"""

    return generate_ai_response(prompt)