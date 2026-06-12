import { createFileRoute } from "@tanstack/react-router";
import { FileBarChart2 } from "lucide-react";
import { useWorkspace } from "../context/WorkspaceContext";
import { AnalysisShell } from "../components/AnalysisShell";
import { generateReport } from "../services/api.js";
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export const Route = createFileRoute("/_dash/reports")({
  head: () => ({ meta: [{ title: "Reports · AI CareerForge" }] }),
  component: Reports,
});

function Reports() {
  const { workspace } = useWorkspace();
  return (
    <AnalysisShell
      title="Reports"
      subtitle="Consolidate every analysis into a single shareable career report."
      icon={FileBarChart2}
      needs={{ resume: true }}
      resultKey="report"
      buttonLabel="Generate Report"
      run={() => {
        return generateReport((workspace as any).id || "default");
      }}
      render={(data: any) => {
        const summary = data?.summary || data?.executive_summary || data?.message || null;
        const sections: any[] = Array.isArray(data?.sections) ? data.sections : [];

        // derive key metrics from available sources
        const ats = (workspace as any).atsResult || {};
        const skill = (workspace as any).skillResult || {};
        const jobMatch = (workspace as any).jobMatch || {};

        const formatPct = (v: any) => (v === null || v === undefined || isNaN(Number(v)) ? "—" : `${Number(v).toFixed(1)}%`);

        const resumeScore = Number(ats?.ats_score ?? ats?.overall_score ?? ats?.score ?? 0);
        const jobMatchScore = Number(jobMatch?.overall_company_match ?? jobMatch?.overall_match ?? jobMatch?.score ?? 0);
        const healthScore = Number((workspace as any).results?.resume_health?.resume_health_score ?? (workspace as any).resumeHealth?.resume_health_score ?? 0);

        const metricValues = [resumeScore, jobMatchScore, healthScore].filter((v) => v > 0);
        const overallProfileScore = data?.profile_score ?? data?.score ?? (metricValues.length ? metricValues.reduce((a, b) => a + b, 0) / metricValues.length : null);

        const matchedKeywords = Array.isArray(ats?.matched_keywords) ? ats.matched_keywords.length : ats?.matched_count ?? null;
        const missingKeywords = Array.isArray(ats?.missing_keywords) ? ats.missing_keywords.length : ats?.missing_count ?? null;

        const strengths = Array.isArray(skill?.strong_skills) ? skill.strong_skills : [];
        const weaknesses = Array.isArray(skill?.skills_to_improve) ? skill.skills_to_improve : [];

        const radarData = (() => {
          const scores = skill?.skill_scores || {};
          return Object.entries(scores).map(([name, score]: [string, any]) => ({ name, score: Number(score) }));
        })();

        const avgSkill = radarData.length ? radarData.reduce((s: any, n: any) => s + n.score, 0) / radarData.length : 0;
        const projectsList = (workspace as any).projects?.recommended_projects || (workspace as any).projects || (workspace as any).projectRecommendations || [];
        const projectsCount = Array.isArray(projectsList) ? projectsList.length : 0;
        const projectsScore = Math.min(projectsCount * 15, 100);

        const barData = [
          { name: "Resume", value: resumeScore },
          { name: "Skills", value: Number(avgSkill.toFixed(1)) },
          { name: "Projects", value: projectsScore },
          { name: "Job Match", value: jobMatchScore },
          { name: "Health", value: healthScore },
          { name: "Profile", value: Number(overallProfileScore ?? 0) },
        ];

        const openPrintableReport = () => {
          const w = window.open("", "_blank", "noopener") as Window;
          if (!w) return;
          const html = `
            <html>
              <head>
                <title>CareerForge Report</title>
                <style>body{font-family:Inter,system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#0b1220;color:#e6edf3;padding:24px} .card{background:linear-gradient(135deg,rgba(124,58,237,0.12),rgba(236,72,153,0.06));border-radius:12px;padding:16px;margin-bottom:12px}</style>
              </head>
              <body>
                <h1>CareerForge Intelligence Report</h1>
                <div class="card"><h2>Executive Summary</h2><p>${(summary || "").replace(/\n/g, "<br/>")}</p></div>
                <div class="card"><h2>Scores</h2><p>Profile: ${formatPct(overallProfileScore)}, Resume: ${formatPct(resumeScore)}, Job Match: ${formatPct(jobMatchScore)}</p></div>
                <div class="card"><h2>Strengths</h2><p>${strengths.join(", ")}</p></div>
                <div class="card"><h2>Areas to Improve</h2><p>${weaknesses.join(", ")}</p></div>
                <div style="margin-top:24px"><button onclick="window.print()">Print / Save as PDF</button></div>
              </body>
            </html>
          `;
          w.document.write(html);
          w.document.close();
        };

        return (
          <div className="grid gap-5">
            <div className="flex items-start justify-between gap-4">
              <div className="glass rounded-2xl p-4 w-72 relative">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Overall Career Score</div>
                <div className="mt-3 h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart innerRadius="80%" outerRadius="100%" data={[{ name: "overall", value: Number(overallProfileScore ?? 0) }]} startAngle={180} endAngle={-180}>
                      <RadialBar dataKey="value" cornerRadius={10} fill="#7c3aed" />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <div className="text-2xl font-semibold">{overallProfileScore ? `${Number(overallProfileScore).toFixed(1)}%` : "—"}</div>
                    <div className="text-xs text-muted-foreground">Combined score</div>
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-4 flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Key Metrics</div>
                  <div>
                    <button className="btn btn-ghost btn-sm" onClick={openPrintableReport}>Download Report</button>
                  </div>
                </div>
                <div className="mt-3 h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#0b1220" />
                      <XAxis dataKey="name" tick={{ fill: "#9CA3AF" }} />
                      <YAxis tickFormatter={(v) => `${v}%`} tick={{ fill: "#9CA3AF" }} />
                      <Tooltip formatter={(v: any) => `${Number(v).toFixed(1)}%`} />
                      <Bar dataKey="value" fill="#06b6d4" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass rounded-2xl p-4 w-80">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Career Analysis</div>
                <div className="mt-3 h-40">
                  {radarData.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="65%">
                        <PolarGrid />
                        <PolarAngleAxis dataKey="name" tick={{ fill: "#9CA3AF", fontSize: 10 }} />
                        <PolarRadiusAxis domain={[0, 100]} />
                        <Radar dataKey="score" stroke="#fb7185" fill="#fb7185" fillOpacity={0.2} />
                      </RadarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-sm text-muted-foreground">No skill analysis available</div>
                  )}
                </div>
              </div>
            </div>

            {summary && (
              <div className="glass rounded-2xl p-6">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Executive summary</div>
                <p className="mt-2 text-sm leading-relaxed">{summary}</p>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="glass rounded-2xl p-5">
                <div className="text-sm font-semibold">Strengths</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {strengths.length ? (
                    <ul className="list-disc pl-5">
                      {strengths.map((s: string) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  ) : (
                    <div>No strengths identified</div>
                  )}
                </div>
              </div>

              <div className="glass rounded-2xl p-5">
                <div className="text-sm font-semibold">Areas to Improve</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {weaknesses.length ? (
                    <ul className="list-disc pl-5">
                      {weaknesses.map((w: string) => (
                        <li key={w}>{w}</li>
                      ))}
                    </ul>
                  ) : (
                    <div>No immediate weaknesses detected</div>
                  )}
                </div>
              </div>
            </div>

            {sections.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {sections.map((s: any, i: number) => (
                  <div key={i} className="glass rounded-2xl p-5">
                    <div className="text-sm font-semibold">{s.title || `Section ${i + 1}`}</div>
                    <p className="mt-1 text-xs text-muted-foreground">{s.body || s.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Best matching roles and 30/60/90 plan */}
            <div className="grid gap-4">
              <div className="glass rounded-2xl p-6">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Best Matching Roles</div>
                <div className="mt-3 text-sm text-muted-foreground">
                  {(function () {
                    const roleCandidates = (jobMatch && jobMatch.top_roles) || [];
                    if (Array.isArray(roleCandidates) && roleCandidates.length) {
                      return (
                        <ol className="list-decimal pl-5">
                          {roleCandidates.map((r: any, i: number) => <li key={i}>{r}</li>)}
                        </ol>
                      );
                    }
                    // derive from strengths
                    const s = strengths.join(", ").toLowerCase();
                    const choices = [] as string[];
                    if (s.includes("sql") || s.includes("tableau") || s.includes("excel")) choices.push("Data Analyst");
                    if (s.includes("python") && (s.includes("ml") || s.includes("machine learning"))) choices.push("Machine Learning Engineer");
                    if (s.includes("react") || s.includes("javascript")) choices.push("Frontend Developer");
                    if (!choices.length) choices.push("Data Analyst", "Software Engineer");
                    return (
                      <ol className="list-decimal pl-5">
                        {choices.map((c: string, i: number) => <li key={i}>{c}</li>)}
                      </ol>
                    );
                  })()}
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Career Evaluation</div>
                <div className="mt-3 text-sm text-muted-foreground">
                  <div><strong>Current profile level:</strong> {overallProfileScore ? `${Number(overallProfileScore).toFixed(1)}%` : '—'}</div>
                  <div className="mt-2"><strong>Industry readiness:</strong> {(overallProfileScore || 0) > 70 ? 'Ready for interviews' : 'Needs targeted improvements'}</div>
                  <div className="mt-2"><strong>Top strengths:</strong> {strengths.length ? strengths.slice(0,5).join(', ') : 'Not identified'}</div>
                  <div className="mt-2"><strong>Improvement priority:</strong> {weaknesses.length ? weaknesses.slice(0,5).join(', ') : 'Focus on measurable project outcomes and deployment'}</div>
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">30 / 60 / 90 Day Action Plan</div>
                <div className="mt-3 text-sm text-muted-foreground">
                  <div className="font-semibold">30 days</div>
                  <div>- Polish resume bullets to include metrics; complete one small demonstrable project.</div>
                  <div className="font-semibold mt-2">60 days</div>
                  <div>- Build and evaluate an advanced project; prepare answers for core technical concepts.</div>
                  <div className="font-semibold mt-2">90 days</div>
                  <div>- Deploy a project, collect metrics, and apply for target roles with tailored resumes.</div>
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Final AI Recommendation</div>
                <div className="mt-3 text-sm text-muted-foreground">
                  {(function () {
                    if ((overallProfileScore || 0) > 75) return 'Continue applying to target roles while highlighting 2-3 measurable projects and preparing for system-design interviews.';
                    if ((overallProfileScore || 0) > 55) return 'Strengthen deployment and measurable outcomes; add one focused project and retake ATS scan.';
                    return 'Focus on building 1-2 portfolio projects, obtain a relevant certification, and iterate on resume to include keywords and metrics.';
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
