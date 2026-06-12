import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, Wand2, FileText, Loader2 } from "lucide-react";
import { useWorkspace } from "../context/WorkspaceContext";
import { generateResume, uploadResumeFile } from "../services/api.js";

export const Route = createFileRoute("/resume-studio")({
  head: () => ({ meta: [{ title: "Resume Studio · AI CareerForge" }] }),
  component: ResumeStudio,
});

const TEMPLATES = ["Professional", "Tech", "Fresher", "Executive", "Data", "Research", "ATS"];

const FIELDS: { key: string; label: string; type?: string; full?: boolean; textarea?: boolean }[] = [
  { key: "name", label: "Full Name" },
  { key: "email", label: "Email", type: "email" },
  { key: "phone", label: "Phone" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "github", label: "GitHub" },
  { key: "leetcode", label: "LeetCode" },
  { key: "hackerrank", label: "HackerRank" },
  { key: "education", label: "Education", full: true, textarea: true },
  { key: "skills", label: "Skills (comma separated)", full: true, textarea: true },
  { key: "projects", label: "Projects", full: true, textarea: true },
  { key: "experience", label: "Experience", full: true, textarea: true },
  { key: "certifications", label: "Certifications", full: true, textarea: true },
];

function ResumeStudio() {
  const navigate = useNavigate();
  const { setMany } = useWorkspace();
  const [mode, setMode] = useState<"manual" | "upload">("manual");
  const [template, setTemplate] = useState("Professional");
  const [form, setForm] = useState<Record<string, string>>({});
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleField = (k: string, v: string) => setForm((s) => ({ ...s, [k]: v }));

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      let resume: any;
      if (mode === "upload") {
        if (!file) throw new Error("Please select a file to upload.");
        resume = await uploadResumeFile(file);
      } else {
        resume = await generateResume({ template, ...form });
      }
      setMany({ resume });
      navigate({ to: "/dashboard" });
    } catch (e: any) {
      // Save form locally so user isn't stranded; allow them to proceed
      const fallback = mode === "manual" ? { template, ...form } : { fileName: file?.name };
      setMany({ resume: fallback });
      setError(
        e?.message
          ? `Could not reach API (${e.message}). Saved locally — opening dashboard.`
          : "API unreachable. Saved locally.",
      );
      setTimeout(() => navigate({ to: "/dashboard" }), 1200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <Link
        to="/workspace"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to workspace
      </Link>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Resume Studio
          </div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
            Build your <span className="text-gradient">resume</span>
          </h1>
        </div>
        <div className="inline-flex rounded-xl glass p-1">
          {(["manual", "upload"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-lg px-4 py-2 text-sm capitalize transition-colors ${
                mode === m ? "bg-secondary text-foreground" : "text-muted-foreground"
              }`}
            >
              {m === "manual" ? "Manual entry" : "Upload resume"}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        key={mode}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-8 glass rounded-2xl p-6 sm:p-8"
      >
        {mode === "manual" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {FIELDS.map((f) => (
              <div key={f.key} className={f.full ? "sm:col-span-2" : ""}>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  {f.label}
                </label>
                {f.textarea ? (
                  <textarea
                    rows={3}
                    value={form[f.key] || ""}
                    onChange={(e) => handleField(f.key, e.target.value)}
                    className="w-full resize-none rounded-lg border border-border bg-input/60 px-3 py-2.5 text-sm outline-none transition focus:border-[var(--neon-violet)] focus:ring-2 focus:ring-[var(--neon-violet)]/30"
                  />
                ) : (
                  <input
                    type={f.type || "text"}
                    value={form[f.key] || ""}
                    onChange={(e) => handleField(f.key, e.target.value)}
                    className="w-full rounded-lg border border-border bg-input/60 px-3 py-2.5 text-sm outline-none transition focus:border-[var(--neon-violet)] focus:ring-2 focus:ring-[var(--neon-violet)]/30"
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/80 bg-secondary/30 px-6 py-16 text-center transition hover:border-[var(--neon-cyan)]">
            <Upload className="h-8 w-8 text-[var(--neon-cyan)]" />
            <div className="mt-3 text-sm font-medium">
              {file ? file.name : "Click to upload resume (PDF / DOCX)"}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              We'll parse it and bring you to your dashboard.
            </div>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
        )}
      </motion.div>

      <div className="mt-8">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Choose a template
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {TEMPLATES.map((t) => (
            <button
              key={t}
              onClick={() => setTemplate(t)}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${
                template === t
                  ? "border-[var(--neon-violet)] bg-secondary text-foreground ring-glow"
                  : "border-border bg-secondary/30 text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="mr-1.5 inline h-3.5 w-3.5" />
              {t}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">
          {error}
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <button
          onClick={generate}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium btn-glow btn-glow-hover disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="h-4 w-4" />
          )}
          Generate Resume
        </button>
      </div>
    </div>
  );
}
