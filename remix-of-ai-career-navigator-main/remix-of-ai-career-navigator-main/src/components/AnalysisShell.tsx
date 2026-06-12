import { useState, type ReactNode, type ComponentType } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Loader2, Play, AlertTriangle, FileText, Briefcase } from "lucide-react";
import { useWorkspace } from "../context/WorkspaceContext";

type Props<T> = {
  title: string;
  subtitle: string;
  icon: ComponentType<{ className?: string }>;
  needs?: { resume?: boolean; jd?: boolean; ats?: boolean; skill?: boolean };
  resultKey: keyof ReturnType<typeof useWorkspace>["workspace"];
  run: () => Promise<T>;
  buttonLabel: string;
  render: (data: T) => ReactNode;
};

export function AnalysisShell<T>({
  title,
  subtitle,
  icon: Icon,
  needs = { resume: true, jd: true },
  resultKey,
  run,
  buttonLabel,
  render,
}: Props<T>) {
  const { workspace, update } = useWorkspace();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const missing: string[] = [];
  if (needs.resume && !workspace.resume) missing.push("resume");
  if (needs.jd && !workspace.jobDescription) missing.push("job description");
  if (needs.ats && !workspace.atsResult) missing.push("ATS result");
  if (needs.skill && !workspace.skillResult) missing.push("skill analysis");

  const data = workspace[resultKey] as T | null;

  const handleRun = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await run();
      // Normalize and store relevant payloads in workspace
      let payloadToStore: any = res;

      if (resultKey === "atsResult") {
        // backend returns { ats_result: {...} }
        payloadToStore = res?.ats_result ?? res?.ats ?? res;
      }

      // For other modules we store the response as-is
      update(resultKey, payloadToStore as any);
    } catch (e: any) {
      setError(
        e?.response?.data?.detail ||
          e?.message ||
          "Failed to reach FastAPI backend. Check that the API is running at the configured base URL.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-secondary ring-glow text-[var(--neon-cyan)]">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Module
            </div>
            <h1 className="mt-0.5 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
          </div>
        </div>
        <button
          onClick={handleRun}
          disabled={loading || missing.length > 0}
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium btn-glow btn-glow-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          {buttonLabel}
        </button>
      </div>

      <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>

      <div className="mt-6 flex flex-wrap gap-2 text-xs">
        <Tag ok={!!workspace.resume} icon={FileText} label="Resume" />
        <Tag ok={!!workspace.jobDescription} icon={Briefcase} label="Job Description" />
      </div>

      {missing.length > 0 && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            Missing: <strong>{missing.join(", ")}</strong>.{" "}
            <Link to="/career-setup" className="underline">
              Complete setup →
            </Link>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      <motion.div
        key={data ? "ready" : "idle"}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8"
      >
        {data ? render(data) : null}
      </motion.div>
    </div>
  );
}

function Tag({
  ok,
  icon: Icon,
  label,
}: {
  ok: boolean;
  icon: ComponentType<{ className?: string }>;
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
      <Icon className="h-3 w-3" /> {label}
    </span>
  );
}

export function JsonViewer({ data }: { data: unknown }) {
  return (
    <pre className="glass max-h-[520px] overflow-auto rounded-2xl p-5 text-xs leading-relaxed text-foreground/90">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
