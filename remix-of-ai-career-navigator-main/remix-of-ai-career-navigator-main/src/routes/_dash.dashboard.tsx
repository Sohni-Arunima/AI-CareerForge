import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Target,
  Radar,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle2,
  FileText,
  Briefcase,
} from "lucide-react";
import { useWorkspace } from "../context/WorkspaceContext";

export const Route = createFileRoute("/_dash/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · AI CareerForge" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { workspace } = useWorkspace();
  const hasResume = !!workspace.resume;
  const hasJD = !!workspace.jobDescription;

  const cards = [
    {
      key: "atsResult",
      title: "ATS Intelligence",
      icon: ShieldCheck,
      to: "/resume-intelligence",
      hue: "var(--neon-violet)",
    },
    {
      key: "jobMatch",
      title: "Job Match",
      icon: Target,
      to: "/job-match",
      hue: "var(--neon-cyan)",
    },
    {
      key: "skillResult",
      title: "Skill Analysis",
      icon: Radar,
      to: "/skill-radar",
      hue: "var(--neon-pink)",
    },
    {
      key: "growthPlan",
      title: "Growth Plan",
      icon: TrendingUp,
      to: "/growth",
      hue: "var(--neon-violet)",
    },
  ] as const;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Career Intelligence
          </div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
            Your <span className="text-gradient">dashboard</span>
          </h1>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <StatusPill ok={hasResume} icon={FileText} label={hasResume ? "Resume ready" : "Resume missing"} />
          <StatusPill ok={hasJD} icon={Briefcase} label={hasJD ? "JD attached" : "No job description"} />
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c, i) => {
          const value = (workspace as any)[c.key];
          const ready = !!value;
          // derive summary values for certain cards
          const summary = (() => {
            if (c.key === "atsResult") {
              const ats = workspace.atsResult || {};
              const atsData = ats?.ats_result || ats;
              return {
                score: atsData?.ats_score ?? atsData?.score ?? null,
                matched: Array.isArray(atsData?.matched_keywords) ? atsData.matched_keywords.length : 0,
                missing: Array.isArray(atsData?.missing_keywords) ? atsData.missing_keywords.length : 0,
              };
            }
            if (c.key === "jobMatch") {
              const jm = workspace.jobMatch || {};
              return {
                overall: jm?.overall_company_match ?? jm?.overall ?? null,
                level: jm?.company_fit_level ?? null,
              };
            }
            if (c.key === "skillResult") {
              const sr = workspace.skillResult || {};
              return {
                strengths: Array.isArray(sr?.strong_skills) ? sr.strong_skills.length : 0,
                improvements: Array.isArray(sr?.skills_to_improve) ? sr.skills_to_improve.length : 0,
              };
            }
            if (c.key === "growthPlan") {
              const gp = workspace.growthPlan || {};
              return { hasPlan: !!gp };
            }
            return null;
          })();

          return (
            <motion.div
              key={c.key}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass group relative overflow-hidden rounded-2xl p-5"
            >
              <div
                className="absolute -right-14 -top-14 h-36 w-36 rounded-full opacity-30 blur-3xl"
                style={{ background: `radial-gradient(circle, ${c.hue}, transparent 70%)` }}
              />
              <div className="flex items-start justify-between">
                <div
                  className="grid h-10 w-10 place-items-center rounded-xl bg-secondary"
                  style={{ color: c.hue }}
                >
                  <c.icon className="h-5 w-5" />
                </div>
                {ready ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                    <CheckCircle2 className="h-3 w-3" /> Ready
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    <Clock className="h-3 w-3" /> Waiting
                  </span>
                )}
              </div>
              <h3 className="mt-5 text-base font-semibold">{c.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {ready ? "Results available — open module to view." : "Run the module to populate this card."}
              </p>
              {summary && (
                <div className="mt-3 text-sm text-muted-foreground">
                  {c.key === "atsResult" && (
                    <div>
                      <div>ATS Score: {summary.score ?? "—"}</div>
                      <div>Matched: {summary.matched}</div>
                      <div>Missing: {summary.missing}</div>
                    </div>
                  )}
                  {c.key === "jobMatch" && (
                    <div>
                      <div>Overall: {summary.overall ?? "—"}</div>
                      <div>Level: {summary.level ?? "—"}</div>
                    </div>
                  )}
                  {c.key === "skillResult" && (
                    <div>
                      <div>Strengths: {summary.strengths}</div>
                      <div>To Improve: {summary.improvements}</div>
                    </div>
                  )}
                </div>
              )}
              <Link
                to={c.to}
                className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-[var(--neon-cyan)] hover:text-white"
              >
                Open <ArrowRight className="h-3 w-3" />
              </Link>
            </motion.div>
          );
        })}
      </div>
      {!hasResume && (
        <div className="mt-8 glass rounded-2xl p-6">
          <h3 className="text-base font-semibold">Get started</h3>
          <p className="mt-1 text-sm text-muted-foreground">Choose a workspace to attach your resume and job description.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/resume-studio" className="rounded-lg border border-border bg-secondary/40 px-4 py-2 text-sm hover:bg-secondary">Build a resume</Link>
            <Link to="/career-setup" className="rounded-lg px-4 py-2 text-sm font-medium btn-glow btn-glow-hover">Start career analysis</Link>
          </div>
        </div>
      )}

      {/* Enhanced dashboard sections */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* AI Career Snapshot */}
        <div className="glass rounded-2xl p-6">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">AI Career Snapshot</div>
          <div className="mt-3">
            {(function () {
              const scores = (workspace as any)?.skillResult?.skill_scores || {};
              const keys = Object.keys(scores || {});
              const avg = keys.length ? keys.reduce((s: number, k: string) => s + Number(scores[k] || 0), 0) / keys.length : null;
              const currentLevel = (workspace as any)?.growthPlan?.current_level ?? avg ?? null;
              const topRoles = (workspace as any)?.jobMatch?.top_roles || (workspace as any)?.jobMatch?.top_role ? (Array.isArray((workspace as any)?.jobMatch?.top_roles) ? (workspace as any).jobMatch.top_roles : [(workspace as any).jobMatch.top_role]) : [];
              const strengths = Array.isArray((workspace as any)?.skillResult?.strong_skills) ? (workspace as any).skillResult.strong_skills : [];
              const improvement = Array.isArray((workspace as any)?.skillResult?.skills_to_improve) ? (workspace as any).skillResult.skills_to_improve[0] : (workspace as any)?.atsResult?.missing_keywords?.[0] || 'Deployment & Advanced Projects';
              return (
                <div>
                  <div className="text-2xl font-semibold">{currentLevel ? `${Number(currentLevel).toFixed(1)}%` : '—'}</div>
                  <div className="mt-2 text-sm text-muted-foreground">Career Status: {((workspace as any)?.profile?.headline) || 'Growing Data Professional'}</div>
                  <div className="mt-2 text-sm"><strong>Best Fit:</strong> {topRoles.length ? topRoles.join(' / ') : (strengths.slice(0,2).join(' / ') || 'Data Analyst / Software Engineer')}</div>
                  <div className="mt-2 text-sm"><strong>Focus Area:</strong> {improvement}</div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Progress Journey Timeline */}
        <div className="glass rounded-2xl p-6">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Progress Journey</div>
          <div className="mt-4">
            <ol className="relative border-l border-border pl-4">
              {[
                'Profile Created',
                'Resume Optimized',
                'Skills Analyzed',
                'Career Roadmap Generated',
                'Interview Preparation',
              ].map((step, i) => (
                <li key={i} className="mb-4 ml-2">
                  <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[var(--neon-violet)] to-[var(--neon-cyan)] text-xs font-semibold">{i+1}</span>
                  <div className="text-sm font-semibold">{step}</div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* AI Career Recommendations */}
        <div className="glass rounded-2xl p-6">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">AI Career Recommendations</div>
          <div className="mt-3 text-sm text-muted-foreground">
            <ul className="list-disc pl-5 space-y-2">
              <li>Complete recommended projects to demonstrate measurable outcomes.</li>
              <li>Improve weak skill areas (focus on deployment and cloud skills).</li>
              <li>Prepare interview topics from the Interview Prep module.</li>
              <li>Generate a portfolio site and include 2-3 deployable projects.</li>
            </ul>
            <div className="mt-4 flex gap-2">
              <Link to="/portfolio-builder" className="btn btn-ghost">Open Portfolio Builder</Link>
              <Link to="/resume-intelligence" className="btn">Run ATS</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick statistics */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(function () {
          const resumeCount = Array.isArray((workspace as any)?.generated_resumes) ? (workspace as any).generated_resumes.length : ((workspace as any)?.resume ? 1 : 0);
          const reportsCount = (workspace as any)?.report ? 1 : 0;
          const skillsCount = Object.keys((workspace as any)?.skillResult?.skill_scores || {}).length;
          const goalsCompleted = (workspace as any)?.growthPlan?.completed_steps || 0;
          const stats = [
            { name: 'Resume Versions', value: resumeCount },
            { name: 'Reports Generated', value: reportsCount },
            { name: 'Skills Tracked', value: skillsCount },
            { name: 'Goals Completed', value: goalsCompleted },
          ];
          return stats.map((s, i) => (
            <div key={i} className="glass rounded-2xl p-4">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">{s.name}</div>
              <div className="mt-2 text-2xl font-semibold">{s.value}</div>
            </div>
          ));
        })()}
      </div>
    </div>
  );
}

function StatusPill({
  ok,
  icon: Icon,
  label,
}: {
  ok: boolean;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 ${
        ok
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          : "border-border bg-secondary/30 text-muted-foreground"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
