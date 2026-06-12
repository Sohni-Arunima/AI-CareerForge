from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import ai_routes
from app.routes import resume_routes
from app.routes import analysis_routes
from app.routes import career_routes
from app.routes import portfolio_routes
from app.routes import pdf_routes
from app.routes import upload_routes
from app.routes import template_routes
from app.routes import template_download_routes
from app.routes import smart_resume_routes
from app.routes import careerforge_resume_routes
from app.routes import ats_routes
from app.routes import workspace_routes
from app.routes import company_match_routes
from app.routes import skill_radar_routes
from app.routes import resume_health_routes
from app.routes import interview_routes
from app.routes import project_routes
from app.routes import job_role_routes
from app.routes import linkedin_routes
from app.routes import timeline_routes
from app.routes import report_routes
from app.routes import dashboard_routes

app = FastAPI(
    title="AI CareerForge API",
    description="Intelligent Resume and Portfolio Builder",
    version="1.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(ai_routes.router)
app.include_router(resume_routes.router)
app.include_router(analysis_routes.router)
app.include_router(career_routes.router)
app.include_router(portfolio_routes.router)
app.include_router(pdf_routes.router)
app.include_router(upload_routes.router)
app.include_router(template_routes.router)
app.include_router(template_download_routes.router)
app.include_router(smart_resume_routes.router)
app.include_router(careerforge_resume_routes.router)
app.include_router(ats_routes.router)
app.include_router(workspace_routes.router)
app.include_router(company_match_routes.router)
app.include_router(skill_radar_routes.router)
app.include_router(resume_health_routes.router)
app.include_router(interview_routes.router)
app.include_router(project_routes.router)
app.include_router(job_role_routes.router)
app.include_router(linkedin_routes.router)
app.include_router(timeline_routes.router)
app.include_router(report_routes.router)
app.include_router(dashboard_routes.router)

@app.get("/")
def home():
    return {
        "message": "AI CareerForge Backend Running Successfully 🚀"
    }


@app.get("/features")
def features():
    return {
        "features": [
            "Resume Generation",
            "ATS Analysis",
            "Job Matching",
            "Skill Gap Analysis",
            "Cover Letter Generator",
            "Portfolio Builder"
        ]
    }