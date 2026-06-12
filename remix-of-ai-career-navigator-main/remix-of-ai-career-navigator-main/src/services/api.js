import axios from "axios";


// ==========================
// BASE CONFIG
// ==========================

export const API_BASE_URL =
  import.meta.env?.VITE_API_URL ||
  "https://ai-careerforge-backend.onrender.com";



export const api = axios.create({

  baseURL: API_BASE_URL,

  timeout: 60000,

});




// ==========================
// REAL FASTAPI ENDPOINTS
// ==========================


export const ENDPOINTS = {


  generateResume:
    "/resume/generate",


  uploadResume:
    "/upload/resume",


  analyzeATS:
    "/ats/analyze",


  jobMatch:
    "/company-match/analyze",


  skillAnalysis:
    "/skill-radar/analyze",


  growthPlan:
    "/timeline/generate",


  interviewPrep:
    "/interview/generate",


  report:
    "/career-report/generate",


};




// ==========================
// RESPONSE CLEANER
// ==========================


const unwrap = (request) =>

  request.then(

    (response) => response.data

  );







// ==========================
// RESUME GENERATOR
// ==========================


export const generateResume = (payload) => {


  return unwrap(


    api.post(

      ENDPOINTS.generateResume,

      payload

    )


  );


};









// ==========================
// RESUME UPLOAD
// /upload/resume
// ==========================


export const uploadResumeFile = (file) => {


  const formData = new FormData();



  formData.append(

    "file",

    file

  );




  return unwrap(


    api.post(

      ENDPOINTS.uploadResume,

      formData,

      {

        headers: {

          "Content-Type":

            "multipart/form-data",

        },

      }

    )


  );


};


// ==========================
// WORKSPACE
// POST /workspace/create
// ==========================

export const createWorkspace = ({ resume, jobDescription }) => {
  const formData = new FormData();

  if (resume instanceof File) {
    formData.append("resume_file", resume);
  } else {
    formData.append("resume_text", resume || "");
  }

  if (jobDescription instanceof File) {
    formData.append("jd_file", jobDescription);
  } else {
    formData.append("job_description", jobDescription || "");
  }

  return unwrap(
    api.post( 
      "/workspace/create",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
  );
};










// ==========================
// ATS ANALYSIS
// /ats/analyze
// ==========================


export const analyzeATS = ({

  resume,

  jobDescription,

}) => {



  const formData = new FormData();




  // Resume File Upload


  if (resume instanceof File) {


    formData.append(

      "resume_file",

      resume

    );


  }


  // Resume Text


  else {


    formData.append(

      "resume_text",

      resume || ""

    );


  }







  // Job description


  if (jobDescription instanceof File) {



    formData.append(

      "jd_file",

      jobDescription

    );



  } else {



    formData.append(

      "job_description",

      jobDescription || ""

    );



  }







  return unwrap(


    api.post(

      ENDPOINTS.analyzeATS,

      formData,

      {


        headers: {


          "Content-Type":

            "multipart/form-data",


        },


      }

    )


  );



};











// ==========================
// COMPANY MATCH
// GET /company-match/analyze/{id}
// ==========================


export const analyzeJobMatch = ({

  workspaceId = "default",

}) => {


  return unwrap(


    api.get(

      `${ENDPOINTS.jobMatch}/${workspaceId}`

    )


  );


};









// ==========================
// SKILL RADAR
// GET /skill-radar/analyze/{id}
// ==========================


export const analyzeSkills = ({

  workspaceId = "default",

}) => {


  return unwrap(


    api.get(

      `${ENDPOINTS.skillAnalysis}/${workspaceId}`

    )


  );


};









// ==========================
// GROWTH PLAN
// ==========================


export const generateGrowthPlan = (

  payload

) => {


  // backend timeline endpoint expects GET with workspace id, but we keep POST wrapper for compatibility
  if (payload && payload.workspaceId) {
    return unwrap(api.get(`${ENDPOINTS.growthPlan}/${payload.workspaceId}`));
  }

  return unwrap(api.post(ENDPOINTS.growthPlan, payload));

};










// ==========================
// INTERVIEW PREP
// ==========================


export const generateInterview = (

  payload

) => {
  // backend offers GET /interview/generate/{workspace_id}
  if (payload && payload.workspaceId) {
    return unwrap(api.get(`${ENDPOINTS.interviewPrep}/${payload.workspaceId}`));
  }
  return unwrap(api.post(ENDPOINTS.interviewPrep, payload));

};










// ==========================
// REPORT
// GET /career-report/generate/{id}
// ==========================


export const generateReport = (

  workspaceId = "default"

) => {



  return unwrap(


    api.get(

      `${ENDPOINTS.report}/${workspaceId}`

    )


  );


};






export default api;