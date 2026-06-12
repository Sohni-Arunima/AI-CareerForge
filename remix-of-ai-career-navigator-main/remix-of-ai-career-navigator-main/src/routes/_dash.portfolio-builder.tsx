import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { useState } from "react";
import { useWorkspace } from "../context/WorkspaceContext";

type Project = { title: string; desc: string; tech: string[] };

type Portfolio = {
  name: string;
  headline: string;
  intro: string;
  about: string;
  skills: string[];
  projects: Project[];
  experience: { role: string; company: string; period?: string; desc?: string }[];
  certifications: string[];
  contact: { email?: string; linkedin?: string };
};

function getResumeText(resume: any) {
  if (typeof resume === "string") return resume;
  if (typeof File !== "undefined" && resume instanceof File) return resume.name;
  if (resume && typeof resume === "object") {
    return [
      resume.name,
      resume.headline,
      resume.summary,
      resume.education,
      resume.skills,
      resume.projects,
      resume.experience,
      resume.certifications,
      resume.text,
      resume.content,
    ]
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .filter(Boolean)
      .join("\n");
  }

  return "";
}

function getResumeSkills(resume: any) {
  if (Array.isArray(resume?.skills)) return resume.skills;
  if (typeof resume?.skills === "string") {
    return resume.skills
      .split(",")
      .map((skill: string) => skill.trim())
      .filter(Boolean);
  }
  return [];
}

function getResumeProjects(resume: any): Project[] {
  const projects = resume?.projects;
  if (Array.isArray(projects)) {
    return projects.map((p: any) => ({
      title: p?.title || p?.project || "Project",
      desc: p?.description || p?.desc || "",
      tech: Array.isArray(p?.technologies) ? p.technologies : Array.isArray(p?.tech) ? p.tech : [],
    }));
  }

  if (typeof projects === "string" && projects.trim()) {
    return projects
      .split(/\n+/)
      .map((project: string) => project.trim())
      .filter(Boolean)
      .map((project: string) => ({ title: project, desc: "", tech: [] }));
  }

  return [];
}

export const Route = createFileRoute("/_dash/portfolio-builder")({
  head: () => ({ meta: [{ title: "Portfolio Builder · AI CareerForge" }] }),
  component: PortfolioBuilder,
});

export default function PortfolioBuilder() {
  const { workspace } = useWorkspace();
  const resume = (workspace as any)?.resume;
  const resumeText = getResumeText(resume);
  const profile = (workspace as any)?.profile || {};
  const skillResult = (workspace as any)?.skillResult || {};
  const resumeProjects = getResumeProjects(resume);

  const initial: Portfolio = {
    name: profile.name || resume?.name || resumeText.split("\n")[0] || "Your Name",
    headline: profile.headline || resume?.headline || "Professional headline goes here",
    intro:
      profile.intro ||
      resume?.summary ||
      resumeText.split("\n").slice(1, 4).join(" ").slice(0, 220) ||
      "Short introduction to you and your focus.",
    about: profile.about || resume?.summary || "About me section describing background and goals.",
    skills:
      Array.isArray(skillResult?.strong_skills) && skillResult.strong_skills.length
        ? skillResult.strong_skills
        : getResumeSkills(resume),
    projects: Array.isArray((workspace as any)?.projects?.recommended_projects)
      ? (workspace as any).projects.recommended_projects.map((p: any) => ({
          title: p.title || p.project || "Project",
          desc: p.description || "",
          tech: p.technologies || [],
        }))
      : resumeProjects,
    experience: Array.isArray((workspace as any)?.experience) ? (workspace as any).experience : [],
    certifications: Array.isArray((workspace as any)?.certifications)
      ? (workspace as any).certifications
      : [],
    contact: {
      email: profile.email || resume?.email || "",
      linkedin: profile.linkedin || resume?.linkedin || "",
    },
  };

  const [portfolio, setPortfolio] = useState<Portfolio>(initial);

  const updateField = <K extends keyof Portfolio>(k: K, v: Portfolio[K]) =>
    setPortfolio((p) => ({ ...p, [k]: v }));

  const addSkill = () => updateField("skills", [...portfolio.skills, "New Skill"]);
  const removeSkill = (i: number) =>
    updateField(
      "skills",
      portfolio.skills.filter((_, idx) => idx !== i),
    );
  const updateSkill = (i: number, val: string) =>
    updateField(
      "skills",
      portfolio.skills.map((s, idx) => (idx === i ? val : s)),
    );

  const addProject = () =>
    updateField("projects", [...portfolio.projects, { title: "New Project", desc: "", tech: [] }]);
  const updateProject = (i: number, p: Project) =>
    updateField(
      "projects",
      portfolio.projects.map((x, idx) => (idx === i ? p : x)),
    );
  const removeProject = (i: number) =>
    updateField(
      "projects",
      portfolio.projects.filter((_, idx) => idx !== i),
    );

  const generateFromResume = () => {
    const lines = resumeText
      .split(/\n|\r/)
      .map((s: string) => s.trim())
      .filter(Boolean);
    const name = profile.name || resume?.name || lines[0] || portfolio.name;
    const intro = lines.slice(1, 4).join(" ").slice(0, 220) || portfolio.intro;
    const skills =
      Array.isArray(skillResult?.strong_skills) && skillResult.strong_skills.length
        ? skillResult.strong_skills
        : getResumeSkills(resume).length
          ? getResumeSkills(resume)
          : portfolio.skills;
    const projects = resumeProjects.length ? resumeProjects : portfolio.projects;
    updateField("name", name);
    updateField("headline", profile.headline || resume?.headline || portfolio.headline);
    updateField("intro", intro);
    updateField("skills", skills);
    updateField("projects", projects);
  };

  const exportHTML = () => {
    const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${portfolio.name} — Portfolio</title>
<style>
body{font-family:Inter,system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#071024;color:#e6edf3;padding:28px}
.container{max-width:980px;margin:0 auto}
.header{display:flex;justify-content:space-between;align-items:center}
.card{background:linear-gradient(135deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01));padding:18px;border-radius:12px;margin-top:14px}
.h1{font-size:28px;margin:0}
.h2{font-size:18px;margin:8px 0}
.skills{display:flex;gap:8px;flex-wrap:wrap}
.skill{background:rgba(255,255,255,0.03);padding:6px 10px;border-radius:999px}
.project{margin-top:10px}
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <div>
      <h1 class="h1">${portfolio.name}</h1>
      <div class="h2">${portfolio.headline}</div>
    </div>
    <div>${portfolio.contact.email ? `<div>${portfolio.contact.email}</div>` : ""}${portfolio.contact.linkedin ? `<div>${portfolio.contact.linkedin}</div>` : ""}</div>
  </div>
  <div class="card">
    <h3>About</h3>
    <p>${portfolio.about}</p>
  </div>
  <div class="card">
    <h3>Skills</h3>
    <div class="skills">
      ${portfolio.skills.map((s) => `<div class="skill">${s}</div>`).join("")}
    </div>
  </div>
  <div class="card">
    <h3>Projects</h3>
    ${portfolio.projects.map((pr) => `<div class="project"><strong>${pr.title}</strong><div>${pr.desc}</div><div style="color:#9CA3AF;font-size:12px">${pr.tech.join(", ")}</div></div>`).join("")}
  </div>
</div>
</body>
</html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(portfolio.name || "portfolio").toLowerCase().replace(/\s+/g, "-")}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2">
        <div className="glass rounded-2xl p-5 mb-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">Portfolio Builder</div>
            <div className="text-xs text-muted-foreground">
              Generate a modern portfolio website from your profile and resume.
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-ghost" onClick={generateFromResume}>
              Generate from resume
            </button>
            <button className="btn btn-primary" onClick={exportHTML}>
              Download HTML
            </button>
          </div>
        </div>

        <div className="glass rounded-2xl p-5 mb-4">
          <div className="text-sm font-semibold">Hero</div>
          <div className="mt-3 grid gap-2">
            <input
              className="input"
              value={portfolio.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Name"
            />
            <input
              className="input"
              value={portfolio.headline}
              onChange={(e) => updateField("headline", e.target.value)}
              placeholder="Professional headline"
            />
            <textarea
              className="textarea"
              value={portfolio.intro}
              onChange={(e) => updateField("intro", e.target.value)}
              placeholder="Short introduction"
            />
          </div>
        </div>

        <div className="glass rounded-2xl p-5 mb-4">
          <div className="text-sm font-semibold">About</div>
          <textarea
            className="textarea mt-3"
            value={portfolio.about}
            onChange={(e) => updateField("about", e.target.value)}
          />
        </div>

        <div className="glass rounded-2xl p-5 mb-4">
          <div className="text-sm font-semibold">Skills</div>
          <div className="mt-3 grid gap-2">
            {portfolio.skills.map((s: string, i: number) => (
              <div key={i} className="flex gap-2">
                <input
                  className="input flex-1"
                  value={s}
                  onChange={(e) => updateSkill(i, e.target.value)}
                />
                <button className="btn btn-ghost" onClick={() => removeSkill(i)}>
                  Remove
                </button>
              </div>
            ))}
            <div>
              <button className="btn btn-ghost" onClick={addSkill}>
                Add skill
              </button>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-5 mb-4">
          <div className="text-sm font-semibold">Projects</div>
          <div className="mt-3 grid gap-3">
            {portfolio.projects.map((p: Project, i: number) => (
              <div key={i} className="rounded-md border border-border p-3">
                <input
                  className="input"
                  value={p.title}
                  onChange={(e) => updateProject(i, { ...p, title: e.target.value })}
                />
                <textarea
                  className="textarea mt-2"
                  value={p.desc}
                  onChange={(e) => updateProject(i, { ...p, desc: e.target.value })}
                />
                <input
                  className="input mt-2"
                  value={p.tech.join(", ")}
                  onChange={(e) =>
                    updateProject(i, {
                      ...p,
                      tech: e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="tech, comma separated"
                />
                <div className="mt-2">
                  <button className="btn btn-ghost" onClick={() => removeProject(i)}>
                    Remove project
                  </button>
                </div>
              </div>
            ))}
            <div>
              <button className="btn btn-ghost" onClick={addProject}>
                Add project
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="md:col-span-1">
        <div className="glass rounded-2xl p-5 mb-4">
          <div className="text-sm font-semibold">Live Preview</div>
          <div className="mt-3">
            <div className="rounded-md border border-border p-4 bg-muted/5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold">{portfolio.name}</div>
                  <div className="text-sm text-muted-foreground">{portfolio.headline}</div>
                </div>
                <div className="text-xs text-muted-foreground">{portfolio.contact.email}</div>
              </div>
              <div className="mt-3 text-sm">{portfolio.intro}</div>
              <div className="mt-4">
                <div className="text-xs font-semibold">Skills</div>
                <div className="mt-2 flex gap-2 flex-wrap text-xs">
                  {portfolio.skills.map((s: string, i: number) => (
                    <div key={i} className="rounded-full bg-emerald-500/10 px-2 py-1">
                      {s}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <div className="text-xs font-semibold">Projects</div>
                <div className="mt-2 grid gap-3">
                  {portfolio.projects.map((p, i) => (
                    <div key={i} className="rounded-md border border-border p-3 bg-muted/3">
                      <div className="text-sm font-semibold">{p.title}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{p.desc}</div>
                      <div className="mt-2 text-xs text-muted-foreground">{p.tech.join(", ")}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="text-sm font-semibold">Contact</div>
          <div className="mt-2 text-xs text-muted-foreground">Email</div>
          <input
            className="input mt-2"
            value={portfolio.contact.email}
            onChange={(e) =>
              updateField("contact", { ...portfolio.contact, email: e.target.value })
            }
          />
          <div className="mt-2 text-xs text-muted-foreground">LinkedIn</div>
          <input
            className="input mt-2"
            value={portfolio.contact.linkedin}
            onChange={(e) =>
              updateField("contact", { ...portfolio.contact, linkedin: e.target.value })
            }
          />
        </div>
      </div>
    </div>
  );
}
