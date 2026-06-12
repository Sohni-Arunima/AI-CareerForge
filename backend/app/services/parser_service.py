import fitz
from docx import Document



def extract_resume_text(file_path):


    text = ""

    print(f"[parser] extract_resume_text called for: {file_path}")


    # ====================
    # PDF EXTRACTION
    # ====================

    if file_path.lower().endswith(".pdf"):


        pdf = fitz.open(file_path)


        for page in pdf:


            text += page.get_text("text")


            text += "\n"



        pdf.close()






    # ====================
    # DOCX EXTRACTION
    # ====================


    elif file_path.lower().endswith(".docx"):


        doc = Document(file_path)


        for para in doc.paragraphs:


            text += para.text


            text += "\n"






    # ====================
    # TXT fallback
    # ====================


    elif file_path.lower().endswith(".txt"):


        with open(
            file_path,
            "r",
            encoding="utf-8",
            errors="ignore"
        ) as f:


            text = f.read()






    return text