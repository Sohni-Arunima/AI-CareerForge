from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer

from reportlab.lib.styles import getSampleStyleSheet

import os



def create_pdf(content):

    folder = "../generated_files"


    if not os.path.exists(folder):

        os.makedirs(folder)



    file_path = os.path.join(
        folder,
        "resume.pdf"
    )



    pdf = SimpleDocTemplate(
        file_path
    )


    styles = getSampleStyleSheet()


    story = []


    for line in content.split("\n"):

        story.append(
            Paragraph(
                line,
                styles["Normal"]
            )
        )

        story.append(
            Spacer(1, 12)
        )



    pdf.build(story)


    return file_path