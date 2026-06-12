import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { useWorkspace } from "../context/WorkspaceContext";
import { AnalysisShell } from "../components/AnalysisShell";
import { analyzeATS } from "../services/api.js";
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts";

const TEXT_KEYS = [
  "extracted_resume",
  "generated_resume",
  "resume_text",
  "resumeText",
  "job_description",
  "jobDescription",
  "rawText",
  "raw_text",
  "parsedText",
  "parsed_text",
  "plainText",
  "plain_text",
  "fullText",
  "full_text",
  "text",
  "content",
  "description",
  "summary",
];

const RESUME_SECTION_KEYS = [
  "name",
  "headline",
  "education",
  "skills",
  "projects",
  "experience",
  "certifications",
];

function valueToText(value: any): string {
  if (!value) return "";
  if (typeof value === "string") return value.trim();
  if (typeof File !== "undefined" && value instanceof File) return "";
  if (Array.isArray(value)) {
    return value.map(valueToText).filter(Boolean).join("\n");
  }

  if (typeof value === "object") {
    for (const key of TEXT_KEYS) {
      const text = valueToText(value[key]);
      if (text) return text;
    }

    return RESUME_SECTION_KEYS.map((key) => valueToText(value[key]))
      .filter(Boolean)
      .join("\n");
  }

  return "";
}

function getResumeText(workspace: any) {
  return valueToText(
    workspace?.resumeText ||
      workspace?.resume_text ||
      workspace?.resume?.extracted_resume ||
      workspace?.resume,
  );
}

function getJobDescriptionText(workspace: any) {
  return valueToText(
    workspace?.jobDescription ||
      workspace?.job_description ||
      workspace?.jd ||
      workspace?.job?.description,
  );
}

function getResumeInput(workspace: any) {
  const resumeText = getResumeText(workspace);
  if (resumeText) return resumeText;

  return (
    (typeof File !== "undefined" && workspace?.resume instanceof File && workspace.resume) ||
    (typeof File !== "undefined" &&
      workspace?.resumeFile instanceof File &&
      workspace.resumeFile) ||
    workspace?.resume ||
    ""
  );
}

function getJobDescriptionInput(workspace: any) {
  const jobDescriptionText = getJobDescriptionText(workspace);
  if (jobDescriptionText) return jobDescriptionText;

  return (
    (typeof File !== "undefined" &&
      workspace?.jobDescription instanceof File &&
      workspace.jobDescription) ||
    (typeof File !== "undefined" && workspace?.jdFile instanceof File && workspace.jdFile) ||
    workspace?.jobDescription ||
    workspace?.jd ||
    workspace?.job_description ||
    ""
  );
}

export const Route = createFileRoute("/_dash/resume-intelligence")({
  head: () => ({ meta: [{ title: "Resume Intelligence · AI CareerForge" }] }),
  component: ResumeIntel,
});

function ResumeIntel() {
  const { workspace } = useWorkspace();

  return (
    <AnalysisShell
      title="Resume Intelligence"
      subtitle="Run a deep ATS-style analysis of your resume against the active job description."
      icon={ShieldCheck}
      resultKey="atsResult"
      buttonLabel="Analyze Resume"
      run={() =>
        analyzeATS({
          resume: getResumeInput(workspace),
          jobDescription: getJobDescriptionInput(workspace),
        })
      }
      render={(data: any) => {
        const ats = data?.ats_result || data;
        const score = typeof ats?.ats_score === "number" ? ats.ats_score : null;
        const keywords: string[] = Array.isArray(ats?.matched_keywords) ? ats.matched_keywords : [];
        const missing: string[] = Array.isArray(ats?.missing_keywords) ? ats.missing_keywords : [];

        const strengths = Array.isArray((workspace as any).skillResult?.strong_skills)
          ? (workspace as any).skillResult.strong_skills
          : [];
        const weaknesses = Array.isArray((workspace as any).skillResult?.skills_to_improve)
          ? (workspace as any).skillResult.skills_to_improve
          : [];
        const resumeText = getResumeText(workspace);

        return (
          <div className="grid gap-5">
            <div className="grid lg:grid-cols-3 gap-4">
              <div className="glass rounded-2xl p-5">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  ATS Score
                </div>
                <div className="mt-2 h-52">
                  {score == null ? (
                    <div className="grid h-full place-items-center text-sm text-muted-foreground">
                      Score not provided
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart
                        innerRadius="70%"
                        outerRadius="100%"
                        data={[{ name: "ATS", value: score, fill: "#7c3aed" }]}
                        startAngle={90}
                        endAngle={-270}
                      >
                        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                        <RadialBar
                          background={{ fill: "rgba(255,255,255,0.06)" }}
                          dataKey="value"
                          cornerRadius={20}
                        />
                        <text
                          x="50%"
                          y="50%"
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill="white"
                          fontSize={28}
                          fontWeight={600}
                        >
                          {score}%
                        </text>
                      </RadialBarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              <div className="glass rounded-2xl p-5">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  Matched keywords
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {keywords.length ? (
                    keywords.map((k: string) => (
                      <span
                        key={k}
                        className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs text-emerald-300"
                      >
                        {k}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No data</span>
                  )}
                </div>
              </div>

              <div className="glass rounded-2xl p-5">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  Missing keywords
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {missing.length ? (
                    missing.map((k: string) => (
                      <span
                        key={k}
                        className="rounded-full bg-red-500/15 px-2.5 py-1 text-xs text-red-300"
                      >
                        {k}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No data</span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="glass rounded-2xl p-5">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  Resume quality analysis
                </div>
                <ul className="mt-3 list-inside list-disc text-sm text-muted-foreground space-y-2">
                  {(function () {
                    const points: string[] = [];
                    const s = score ?? 0;
                    if (s >= 85) points.push("Clear achievements and good keyword coverage.");
                    if (s >= 65 && s < 85)
                      points.push(
                        "Relevant skills present but some statements lack measurable impact.",
                      );
                    if (s < 65) points.push("Low ATS coverage; many role keywords are missing.");
                    if (resumeText.length < 300)
                      points.push("Resume is short — consider adding more project detail.");
                    points.push("Use strong action verbs and quantify outcomes where possible.");
                    return points.map((p: string, i: number) => <li key={i}>{p}</li>);
                  })()}
                </ul>
              </div>

              <div className="glass rounded-2xl p-5">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  Weak area explanation
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                  {(function () {
                    const reasons: string[] = [];
                    if (missing.length)
                      reasons.push(
                        `${missing.length} important keywords are missing from your resume.`,
                      );
                    if (!(resumeText || (workspace as any)?.resumeFile))
                      reasons.push(
                        "No resume text available to analyze — upload or paste your resume to get richer suggestions.",
                      );
                    if (!reasons.length)
                      reasons.push(
                        "No obvious weak areas detected — focus on quantification and clarity.",
                      );
                    return reasons.map((r: string, i: number) => (
                      <div key={i} className="mt-1">
                        {r}
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                Personalized improvement checklist
              </div>
              <ul className="mt-3 grid gap-2 text-sm">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 text-emerald-300">•</span> Add numeric results (percent,
                  time saved, revenue impact) to project bullets.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 text-emerald-300">•</span> Replace vague verbs with
                  stronger action verbs ("created" → "developed/engineered/launched").
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 text-emerald-300">•</span> Include deployment/production
                  details (cloud, infra, monitoring) for projects.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 text-emerald-300">•</span> Tailor top 3 bullets to the job
                  description keywords.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 text-emerald-300">•</span> Add a concise impact statement
                  for each project (context → action → result).
                </li>
              </ul>
            </div>

            <div className="glass rounded-2xl p-6">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                Impact statement suggestions
              </div>
              <div className="mt-3 grid gap-3">
                {(function () {
                  const sentences = resumeText
                    .split(/[.\n]+/)
                    .map((s: string) => s.trim())
                    .filter(Boolean)
                    .slice(0, 8);
                  if (!sentences.length) {
                    return (
                      <div className="text-sm text-muted-foreground">
                        No resume content to analyze. Paste your resume to get sentence-level
                        suggestions.
                      </div>
                    );
                  }
                  const validSentences = sentences.filter((s: string) => {
  const lower = s.toLowerCase();

  const invalid =
    lower.includes("@") ||
    lower.includes("phone") ||
    lower.includes("email") ||
    lower.includes("linkedin") ||
    lower.includes("github") ||
    lower.includes("hyderabad") ||
    lower.includes("student") ||
    s.length < 10;

  const valid =
    lower.includes("developed") ||
    lower.includes("built") ||
    lower.includes("created") ||
    lower.includes("implemented") ||
    lower.includes("designed") ||
    lower.includes("analyzed") ||
    lower.includes("project") ||
    lower.includes("model") ||
    lower.includes("system") ||
    lower.includes("dashboard") ||
    lower.includes("prediction") ||
    lower.includes("analysis") ||
    lower.includes("machine") ||
    lower.includes("learning") ||
    lower.includes("power") ||
    lower.includes("python") ||
    lower.includes("sql") ||
    lower.includes("data") ||
    lower.includes("visualization");

  return valid && !invalid;
});

if (!validSentences.length) {
  return [
    <div key="empty">
      Add project or experience bullet points to receive AI impact suggestions.
    </div>,
  ];
}

return validSentences.map((s: string, i: number) => {
  const hasNumber = /\d/.test(s);

  const weak =
    /\b(created|worked on|helped|participated|involved)\b/i.test(s) ||
    !hasNumber;

  const improved = weak
    ? `${s} with measurable outcomes, optimized implementation, and clear project impact.`
                      : s;
                    return (
                      <div key={i} className="rounded-md border border-border p-4 bg-muted/5">
                        <div className="text-xs text-muted-foreground">Before</div>
                        <div className="mt-1 text-sm">{s}</div>
                        <div className="mt-3 text-xs text-muted-foreground">After</div>
                        <div className="mt-1 text-sm font-semibold">{improved}</div>
                        <div className="mt-3 flex gap-2">
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() =>
                              typeof navigator !== "undefined" &&
                              navigator.clipboard?.writeText(improved)
                            }
                          >
                            Copy suggestion
                          </button>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}

export default ResumeIntel;
