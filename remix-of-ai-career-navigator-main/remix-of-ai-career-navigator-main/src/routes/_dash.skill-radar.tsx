import { createFileRoute } from "@tanstack/react-router";
import { Radar as RadarIcon } from "lucide-react";
import { useWorkspace } from "../context/WorkspaceContext";
import { AnalysisShell } from "../components/AnalysisShell";
import { analyzeSkills } from "../services/api.js";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

export const Route = createFileRoute("/_dash/skill-radar")({
  head: () => ({ meta: [{ title: "Skill Radar · AI CareerForge" }] }),
  component: SkillRadar,
});

function SkillRadar() {
  const { workspace } = useWorkspace();
  return (
    <AnalysisShell
      title="Skill Radar"
      subtitle="Visualise your skill strengths and gaps inferred from your resume."
      icon={RadarIcon}
      needs={{ resume: true }}
      resultKey="skillResult"
      buttonLabel="Scan Skills"
      run={() => analyzeSkills({ workspaceId: (workspace as any).id || "default" })}
      render={(data: any) => {
        // Backend returns { skill_scores: { skill: score, ... }, strong_skills, skills_to_improve }
        const strengths = Array.isArray(data?.strong_skills) ? data.strong_skills : [];
        const improvements = Array.isArray(data?.skills_to_improve) ? data.skills_to_improve : [];
        const items = data?.skill_scores
          ? Object.entries(data.skill_scores).map(([skill, score]: [string, any]) => ({ skill, level: score }))
          : Array.isArray(data?.radar)
          ? data.radar
          : [];
        return (
          <div className="grid gap-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="glass rounded-2xl p-4">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Strengths</div>
                <div className="mt-2 text-xl font-semibold">{strengths.length}</div>
                <div className="text-xs text-muted-foreground mt-1">identified strong skills</div>
              </div>
              <div className="glass rounded-2xl p-4">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">To Improve</div>
                <div className="mt-2 text-xl font-semibold">{improvements.length}</div>
                <div className="text-xs text-muted-foreground mt-1">skills to work on</div>
              </div>
              <div className="glass rounded-2xl p-4">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Total Skills</div>
                <div className="mt-2 text-xl font-semibold">{items.length}</div>
                <div className="text-xs text-muted-foreground mt-1">skills in radar</div>
              </div>
            </div>

            <div className="glass rounded-2xl p-5">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Skill radar</div>
              <div className="mt-4 h-80">
                {items.length ? (
                  <ResponsiveContainer>
                    <RadarChart data={items} outerRadius="80%">
                      <PolarGrid stroke="rgba(255,255,255,0.1)" />
                      <PolarAngleAxis dataKey={items[0]?.skill ? "skill" : "name"} tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }} />
                      <PolarRadiusAxis tick={false} axisLine={false} />
                      <Radar dataKey={items[0]?.level != null ? "level" : "value"} stroke="oklch(0.72 0.22 295)" fill="oklch(0.72 0.22 295)" fillOpacity={0.4} />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="grid h-full place-items-center text-sm text-muted-foreground">No skills returned</div>
                )}
              </div>
            </div>

            {/* AI Skill Growth Advisor */}
            <div className="grid gap-4">
              <div className="glass rounded-2xl p-5">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">AI Skill Growth Advisor</div>
                <div className="mt-3 text-sm text-muted-foreground">
                  {(function () {
                    const avg = items.length ? items.reduce((a: any, b: any) => a + (b.level || b.value || 0), 0) / items.length : null;
                    const level = avg ? `${Number(avg).toFixed(1)}%` : "—";
                    return (
                      <div>
                        <div className="text-sm font-semibold">Current career level prediction</div>
                        <div className="mt-2">{level}</div>
                        <div className="mt-3 text-xs">Recommended next skills and learning path below.</div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="glass rounded-2xl p-5">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Recommended next skills</div>
                  <div className="mt-3 text-sm text-muted-foreground">
                    {(function () {
                      const recs = improvements.length ? improvements.slice(0, 6) : ["Advanced SQL", "Model Deployment", "Cloud Fundamentals"];
                      return (
                        <ul className="list-disc pl-5">
                          {recs.map((r: string) => (
                            <li key={r}>{r}</li>
                          ))}
                        </ul>
                      );
                    })()}
                  </div>
                </div>

                <div className="glass rounded-2xl p-5">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Learning path</div>
                  <div className="mt-3 text-sm text-muted-foreground">
                    <div className="font-semibold">Month 1 — Foundation</div>
                    <div>Core topics: Data cleaning, Advanced SQL; Build: Sales analytics dashboard.</div>
                    <div className="mt-2 font-semibold">Months 2-3 — Advanced</div>
                    <div>Core topics: Machine learning algorithms, Model evaluation; Build: Prediction model with evaluation metrics.</div>
                    <div className="mt-2 font-semibold">Months 4-6 — Production</div>
                    <div>Core topics: Deployment, CI/CD, Monitoring; Build: Deploy ML model with Docker on AWS/GCP.</div>
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-5">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Suggested mini projects</div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {(function () {
                    const rec = improvements.length ? improvements.slice(0, 3) : ["SQL", "Deployment", "ML"];
                    const projects = rec.map((skill: string, i: number) => ({
                      title: `${skill} Capstone Project`,
                      desc: `Build a compact project focused on ${skill} to demonstrate practical ability.`,
                      difficulty: i === 0 ? "Medium" : i === 1 ? "Hard" : "Medium",
                      tech: skill === "Deployment" ? ["Docker", "AWS"] : skill === "ML" ? ["Python", "scikit-learn"] : ["SQL", "Tableau"],
                    }));
                    return projects.map((p: any) => (
                      <div key={p.title} className="rounded-md border border-border p-4">
                        <div className="text-sm font-semibold">{p.title}</div>
                        <div className="mt-1 text-xs text-muted-foreground">{p.desc}</div>
                        <div className="mt-2 text-xs">Difficulty: {p.difficulty}</div>
                        <div className="mt-2 text-xs text-muted-foreground">Tech: {p.tech.join(", ")}</div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
