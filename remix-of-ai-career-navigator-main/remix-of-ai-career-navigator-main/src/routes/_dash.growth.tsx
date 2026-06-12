import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";
import { useWorkspace } from "../context/WorkspaceContext";
import { AnalysisShell } from "../components/AnalysisShell";
import { generateGrowthPlan } from "../services/api.js";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";

export const Route = createFileRoute("/_dash/growth")({
  head: () => ({ meta: [{ title: "Growth Plan · AI CareerForge" }] }),
  component: Growth,
});

function Growth() {
  const { workspace } = useWorkspace();
  return (
    <AnalysisShell
      title="Growth Plan"
      subtitle="A personalized roadmap built from your ATS results and skill scan."
      icon={TrendingUp}
      needs={{ resume: true, ats: true, skill: true }}
      resultKey="growthPlan"
      buttonLabel="Generate Plan"
      run={() => generateGrowthPlan({ workspaceId: (workspace as any).id || "default" })}
      render={(data: any) => {
        const timeline = data || {};
        const steps: any[] = Array.isArray(timeline?.plan)
          ? timeline.plan
          : Array.isArray(timeline?.steps)
          ? timeline.steps
          : Array.isArray(timeline?.improvement_plan)
          ? timeline.improvement_plan
          : [];

        const workspaceSkill = (workspace as any).skillResult || {};
        const strengths: string[] = Array.isArray(workspaceSkill?.strong_skills)
          ? workspaceSkill.strong_skills
          : [];
        const missingSkills: string[] = Array.isArray(workspaceSkill?.skills_to_improve)
          ? workspaceSkill.skills_to_improve
          : [];

        const atsMissing: string[] = Array.isArray((workspace as any).atsResult?.missing_keywords)
          ? (workspace as any).atsResult.missing_keywords
          : [];

        // recommended projects may be available in workspace under a variety of keys
        const recommendedProjects =
          (workspace as any).projects?.recommended_projects ||
          (workspace as any).projects ||
          (workspace as any).projectRecommendations || [];

        const currentLevel = timeline?.current_level ?? null;
        const prediction = timeline?.growth_prediction || {};

        const formatPct = (v: any) => {
          if (v === null || v === undefined || isNaN(Number(v))) return "—";
          return `${Number(v).toFixed(1)}%`;
        };

        const lineData = [
          { name: "Now", value: Number(currentLevel ?? 0) },
          { name: "1M", value: Number(prediction.month_1 ?? 0) },
          { name: "3M", value: Number(prediction.month_3 ?? 0) },
          { name: "6M", value: Number(prediction.month_6 ?? 0) },
        ];

        const radarData = (() => {
          const scores = (workspace as any).skillResult?.skill_scores || {};
          return Object.entries(scores).map(([skill, score]: [string, any]) => ({ skill, score: Number(score) }));
        })();

        const readinessData = [{ name: "Readiness", value: Number(currentLevel ?? 0) }];

        // generate fallback projects and certifications when backend returns little
        const generatedProjects = (() => {
          if (Array.isArray(recommendedProjects) && recommendedProjects.length) return recommendedProjects;
          const skills = Array.from(new Set([...(missingSkills || []), ...(strengths || [])])).slice(0, 6);
          const projects = skills.length
            ? skills.map((skill: string, i: number) => ({
                title: `${skill} Capstone Project`,
                project: `${skill} Capstone Project`,
                description: `Build an end-to-end ${skill} project demonstrating practical application and deployment.`,
                skills_gained: [skill],
                difficulty: i % 3 === 0 ? "Easy" : i % 3 === 1 ? "Medium" : "Hard",
                technologies: skill.toLowerCase().includes("sql") ? ["Postgres", "Tableau"] : skill.toLowerCase().includes("aws") ? ["AWS", "Docker"] : ["Python", "React"],
              }))
            : [
                {
                  title: "Portfolio Project",
                  project: "Portfolio Project",
                  description: "Create a polished portfolio website with 2-3 projects showcasing your skills.",
                  skills_gained: ["Communication", "Frontend"],
                  difficulty: "Easy",
                  technologies: ["React", "Tailwind"],
                },
              ];
          return projects;
        })();

        const certificationRecs = (() => {
          const map: Record<string, string> = {
            aws: "AWS Certified Cloud Practitioner",
            azure: "Microsoft Azure Fundamentals",
            docker: "Docker Certified Associate",
            sql: "Microsoft Certified: Data Analyst Associate",
            python: "Python for Data Science (Coursera)",
            ml: "Machine Learning Specialization (Coursera)",
          };
          const picks = (missingSkills || []).slice(0, 6).map((s: string) => map[s.toLowerCase()] || `${s} recommended certification`);
          if (!picks.length) {
            const role = (workspace as any)?.jobMatch?.top_role || "Data Analyst";
            return role.toLowerCase().includes("data")
              ? ["Google Data Analytics Professional Certificate", "Coursera: Data Science Specialization"]
              : ["Coursera: Foundations of Cloud Computing", "AWS Fundamentals"]; 
          }
          return Array.from(new Set(picks));
        })();

        const roadmapMonths = (() => {
          if (steps.length >= 3) return steps.map((s: any, i: number) => ({ title: `Step ${i + 1}`, body: s }));
          const ms = missingSkills.length ? missingSkills.slice(0, 6) : strengths.slice(0, 6);
          return [
            {
              title: "Month 1 — Foundation",
              learn: ms.slice(0, 2),
              build: generatedProjects[0]?.title || "Analytics Dashboard",
              goal: "Solidify fundamentals and produce a small demonstrable project.",
            },
            {
              title: "Months 2-3 — Advanced",
              learn: ms.slice(2, 5),
              build: generatedProjects[1]?.title || "Prediction Model",
              goal: "Implement advanced techniques and add measurable evaluation.",
            },
            {
              title: "Months 4-6 — Production",
              learn: ["Deployment", "Monitoring"],
              build: generatedProjects[2]?.title || "Deployed Pipeline",
              goal: "Deploy models/projects to cloud and showcase production readiness.",
            },
          ];
        })();

        return (
          <div className="grid gap-6">
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Career Goal Summary</div>
                  <h3 className="mt-2 text-lg font-semibold">Profile overview</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Current profile level: {formatPct(currentLevel)}
                  </p>
                  {prediction && (
                    <div className="mt-3 text-sm text-muted-foreground space-y-1">
                      <div>Projected (1 month): {formatPct(prediction.month_1)}</div>
                      <div>Projected (3 months): {formatPct(prediction.month_3)}</div>
                      <div>Projected (6 months): {formatPct(prediction.month_6)}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="glass rounded-2xl p-4 relative">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Career Readiness</div>
                <div className="mt-3 h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      innerRadius="80%"
                      outerRadius="100%"
                      data={readinessData}
                      startAngle={180}
                      endAngle={-180}
                    >
                      <RadialBar
                        minAngle={15}
                        background
                        clockWise
                        dataKey="value"
                        cornerRadius={10}
                        fill="#7c3aed"
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <div className="text-2xl font-semibold">{formatPct(currentLevel)}</div>
                    <div className="text-xs text-muted-foreground">Current level</div>
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-4">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Skill Growth Prediction</div>
                <div className="mt-3 h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData}>
                      <XAxis dataKey="name" tick={{ fill: "#9CA3AF" }} />
                      <YAxis tickFormatter={(v) => `${v}%`} tick={{ fill: "#9CA3AF" }} />
                      <Tooltip formatter={(v: any) => `${Number(v).toFixed(1)}%`} />
                      <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass rounded-2xl p-4">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Skill Comparison</div>
                <div className="mt-3 h-36">
                  {radarData.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="skill" tick={{ fill: "#9CA3AF", fontSize: 10 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar name="Skill" dataKey="score" stroke="#fb7185" fill="#fb7185" fillOpacity={0.2} />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-sm text-muted-foreground">No skill radar data</div>
                  )}
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Personalised Learning Roadmap</div>
              <div className="mt-6">
                <ol className="relative border-l border-border">
                  {roadmapMonths.map((m: any, i: number) => (
                    <li key={i} className="mb-10 ml-6">
                      <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-pink-600 text-xs font-semibold">
                        {i + 1}
                      </span>
                      <div className="rounded-md border border-border p-4 bg-muted/5">
                        <div className="text-sm font-semibold">{m.title}</div>
                        <div className="mt-2 text-sm text-muted-foreground">{m.goal}</div>
                        <div className="mt-3 text-xs font-semibold">Learn</div>
                        <div className="text-sm text-muted-foreground">{Array.isArray(m.learn) ? m.learn.join(", ") : m.learn}</div>
                        <div className="mt-2 text-xs font-semibold">Build</div>
                        <div className="text-sm text-muted-foreground">{m.build}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="glass rounded-2xl p-6">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Recommended Projects</div>
                <div className="mt-3 space-y-3">
                  {generatedProjects.length ? (
                    generatedProjects.map((p: any, i: number) => (
                      <div key={i} className="rounded-md border border-border p-4">
                        <div className="text-sm font-semibold">{p.project || p.title || `Project ${i + 1}`}</div>
                        {p.description && <div className="mt-1 text-xs text-muted-foreground">{p.description}</div>}
                        {p.skills_gained && <div className="mt-1 text-xs text-muted-foreground">Skills: {p.skills_gained.join(", ")}</div>}
                        {p.difficulty && <div className="mt-1 text-xs text-muted-foreground">Difficulty: {p.difficulty}</div>}
                        {p.technologies && <div className="mt-1 text-xs text-muted-foreground">Tech: {p.technologies.join(", ")}</div>}
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">No recommended projects yet</div>
                  )}
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Suggested Certifications & Resources</div>
                <div className="mt-3 text-sm text-muted-foreground">
                  {certificationRecs.length ? (
                    <ul className="list-disc pl-5">
                      {certificationRecs.map((c: string) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  ) : (
                    <div>No specific certification suggestions</div>
                  )}
                </div>
                <div className="mt-4 text-xs text-muted-foreground">More resources: Coursera, Udemy, Pluralsight, official cert tracks.</div>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
