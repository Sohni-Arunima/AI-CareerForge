from pydantic import BaseModel

from typing import List, Optional



class Links(BaseModel):

    linkedin: Optional[str] = ""

    github: Optional[str] = ""

    leetcode: Optional[str] = ""

    hackerrank: Optional[str] = ""

    kaggle: Optional[str] = ""

    portfolio: Optional[str] = ""




class Project(BaseModel):

    name: str

    description: Optional[str] = ""

    tech_stack: Optional[str] = ""

    github_link: Optional[str] = ""




class Experience(BaseModel):

    company: Optional[str] = ""

    role: Optional[str] = ""

    description: Optional[str] = ""




class StudentProfile(BaseModel):

    # BASIC INFO

    name: str

    email: str

    phone: str

    location: Optional[str] = ""



    # LINKS

    links: Links



    # EDUCATION

    education: str



    # SKILLS

    skills: List[str]



    # EXPERIENCE

    experience: List[Experience] = []



    # PROJECTS

    projects: List[Project]



    # EXTRAS

    certifications: List[str] = []

    achievements: List[str] = []

    hackathons: List[str] = []



    # CAREER INTELLIGENCE

    target_role: str


    job_description: Optional[str] = ""


    template: Optional[str] = "professional"