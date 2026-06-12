import { createFileRoute } from "@tanstack/react-router";
import { Target } from "lucide-react";
import { useWorkspace } from "../context/WorkspaceContext";
import { AnalysisShell } from "../components/AnalysisShell";
import { analyzeJobMatch } from "../services/api.js";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const Route = createFileRoute("/_dash/job-match")({
  head: () => ({ meta: [{ title: "Job Match · AI CareerForge" }] }),
  component: JobMatch,
});

function JobMatch() {
  const { workspace } = useWorkspace();
  return (
    <AnalysisShell
      title="Job Match"
      subtitle="Compare your resume to the job description and see fit by dimension."
      icon={Target}
      resultKey="jobMatch"
      buttonLabel="Run Match"
      run={() => analyzeJobMatch({ workspaceId: (workspace as any).id || "default" })}
      render={(data: any) => {
        // Backend returns company_match structure (see backend/company_match_service)
        const overall = data?.overall_company_match ?? data?.overall ?? null;
        const fitLevel = data?.company_fit_level ?? null;
        const matched = Array.isArray(data?.matched_requirements) ? data.matched_requirements : [];
        const missing = Array.isArray(data?.missing_requirements) ? data.missing_requirements : [];
        const breakdown = data?.match_breakdown
          ? Object.entries(data.match_breakdown).map(([name, value]: [string, any]) => ({ name, value }))
          : data?.breakdown || [];
        return (
          <div className="grid gap-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="glass rounded-2xl p-4">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Overall Match</div>
                <div className="mt-2 text-xl font-semibold">{overall ?? "—"}%</div>
                <div className="text-xs text-muted-foreground mt-1">{fitLevel ?? "—"}</div>
              </div>
              <div className="glass rounded-2xl p-4">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Matched</div>
                <div className="mt-2 text-xl font-semibold">{matched.length}</div>
                <div className="text-xs text-muted-foreground mt-1">requirements matched</div>
              </div>
              <div className="glass rounded-2xl p-4">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Missing</div>
                <div className="mt-2 text-xl font-semibold">{missing.length}</div>
                <div className="text-xs text-muted-foreground mt-1">requirements missing</div>
              </div>
            </div>

            <div className="glass rounded-2xl p-5">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                Fit breakdown
              </div>
              <div className="mt-4 h-72">
                {breakdown.length ? (
                  <ResponsiveContainer>
                    <BarChart data={breakdown}>
                      <defs>
                        <linearGradient id="bar1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="oklch(0.82 0.16 200)" />
                          <stop offset="100%" stopColor="oklch(0.7 0.22 295)" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                      <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          background: "oklch(0.21 0.03 270)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 12,
                        }}
                      />
                      <Bar dataKey="value" fill="url(#bar1)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="grid h-full place-items-center text-sm text-muted-foreground">
                    No breakdown returned
                  </div>
                )}
              </div>
            </div>
            <div className="grid gap-4">
              <div className="glass rounded-2xl p-6">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Hiring Intelligence Assistant</div>
                <div className="mt-3">
                  <div className="text-sm font-semibold">Recruiter point of view</div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {(function () {
                      const o = Number(overall ?? 0);
                      if (o >= 85) return "Strong fit — likely selected for interview. Emphasize leadership and impact in your top bullets.";
                      if (o >= 65) return "Reasonable fit — some role-specific gaps exist. Address cloud/deployment experience and quantify outcomes to stand out.";
                      return "Lower fit — focus on targeted skill alignment, concrete projects, and quick certifications to improve selection chances.";
                    })()}
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-5">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Why this candidate fits</div>
                <div className="mt-3 text-sm text-muted-foreground">
                  {(function () {
                    const pts: string[] = [];
                    if (matched.length) pts.push("Demonstrates several required competencies that match the role context.");
                    if ((workspace as any)?.skillResult?.strong_skills?.length) pts.push("Has clear strong skills that map to role expectations.");
                    if ((workspace as any)?.atsResult?.ats_score >= 75) pts.push("Resume keywords align well with the job description.");
                    if (!pts.length) pts.push("Highlights not obvious from current resume — consider adding targeted bullets.");
                    return pts.map((p: string, i: number) => <div key={i} className="mt-1">• {p}</div>);
                  })()}
                </div>
              </div>

              <div className="glass rounded-2xl p-5">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Possible rejection reasons</div>
                <div className="mt-3 text-sm text-muted-foreground">
                  <ul className="list-disc pl-5">
                    <li>Missing key deployment or production experience that recruiters look for.</li>
                    <li>Insufficient quantification of project outcomes (no metrics).</li>
                    <li>Lack of specific domain tools or certifications mentioned in JD.</li>
                  </ul>
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Steps to increase match</div>
                <ol className="mt-3 list-decimal pl-5 text-sm text-muted-foreground space-y-2">
                  <li>Update top 3 bullets to include the job's exact keywords while remaining truthful.</li>
                  <li>Add one short project demonstrating deployment or cloud experience (e.g., Docker + AWS).</li>
                  <li>Include measurable outcomes (%, time, users) for past projects.</li>
                  <li>Pursue a quick certification (Coursera/AWS Fundamentals) if cloud skills are missing.</li>
                </ol>
                <div className="mt-4 text-xs text-muted-foreground">Next action: prioritize adding 1 deployable project and 2 quantified bullets.</div>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
