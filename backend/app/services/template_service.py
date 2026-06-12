from app.services.ai_service import generate_ai_response



templates = {


"professional":
"""
Professional Corporate Resume.

Focus:
- ATS friendly
- Professional summary
- Work achievements
- Clean sections
- Business impact
""",



"tech":
"""
Tech Innovator Resume.

Focus:
- Programming skills
- AI/ML projects
- GitHub
- Architecture
- Tools and frameworks
""",



"fresher":
"""
Fresher Launch Resume.

Focus:
- Education
- Internships
- Projects
- Hackathons
- Certifications
- Skills
""",



"executive":
"""
Executive Elite Resume.

Focus:
- Leadership
- Management
- Business results
- Experience impact
""",



"data":
"""
Data Professional Resume.

Focus:
- Machine learning
- Data analytics
- Dashboards
- Model accuracy
- Business insights
""",



"research":
"""
Research Academic Resume.

Focus:
- Publications
- Research work
- Technical papers
- Academic projects
""",



"creative":
"""
Creative Portfolio Resume.

Focus:
- Personal branding
- Portfolio links
- Design projects
- Creativity
""",



"ats":
"""
ATS Max Resume.

Rules:
- Maximum keywords
- Simple formatting
- ATS scanner friendly
- High readability
"""

}




def generate_template_resume(
        profile,
        template,
        role
):


    selected_template = templates.get(
        template,
        templates["professional"]
    )


    prompt=f"""

You are an expert resume designer.

Create a resume using this strategy:


{selected_template}



Candidate Details:

{profile}



Target Role:

{role}



Generate:

1. Header

2. Professional Summary

3. Skills Section

4. Experience / Internship

5. Projects with impact

6. Education

7. Certifications

8. Achievements


Make it optimized for the selected resume style.


"""


    return generate_ai_response(prompt)