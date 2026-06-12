import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, FileText, Briefcase, Loader2, Play } from "lucide-react";
import { useWorkspace } from "../context/WorkspaceContext";
import { uploadResumeFile } from "../services/api.js";

export const Route = createFileRoute("/career-setup")({
  head: () => ({ meta: [{ title: "Career Setup · AI CareerForge" }] }),
  component: CareerSetup,
});

function CareerSetup() {
  const navigate = useNavigate();
  const { setMany } = useWorkspace();
  const [resumeMode, setResumeMode] = useState<"upload" | "paste">("upload");
  const [jdMode, setJdMode] = useState<"upload" | "paste">("paste");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [jdText, setJdText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const readFile = (f: File) =>
    new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result || ""));
      r.onerror = reject;
      r.readAsText(f);
    });

  const start = async () => {
    setError(null);
    if (resumeMode === "upload" && !resumeFile && !resumeText)
      return setError("Please provide your resume.");
    if (resumeMode === "paste" && !resumeText.trim())
      return setError("Please paste your resume text.");
    if (jdMode === "upload" && !jdFile && !jdText)
      return setError("Please provide a job description.");
    if (jdMode === "paste" && !jdText.trim())
      return setError("Please paste a job description.");

    setLoading(true);
    try {
      let resume: any = null;
      if (resumeMode === "upload" && resumeFile) {
        try {
          resume = await uploadResumeFile(resumeFile);
        } catch {
          resume = { fileName: resumeFile.name };
        }
      } else {
        resume = { text: resumeText };
      }

      let jobDescription = jdText;
      if (jdMode === "upload" && jdFile && !jobDescription) {
        try {
          jobDescription = await readFile(jdFile);
        } catch {
          jobDescription = `[file:${jdFile.name}]`;
        }
      }

      // Create server-side workspace so other modules can use workspace id
      try {
        // lazy-load createWorkspace to avoid circular imports in some setups
        const api = await import("../services/api.js");
        const res = await api.createWorkspace({
          resume: resumeFile || resume?.text || resume,
          jobDescription: jdFile || jobDescription,
        });
        // backend returns { workspace_id } or { id }
        const workspaceId = res?.data?.workspace_id || res?.data?.id || res?.workspace_id || res?.id;
        setMany({ resume, jobDescription, resumeFile, jdFile, ...(workspaceId ? { id: workspaceId } : {}) });
      } catch (e) {
        // createWorkspace failed; still proceed locally
        setMany({ resume, jobDescription, resumeFile, jdFile });
      }

      navigate({ to: "/dashboard" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <Link
        to="/workspace"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to workspace
      </Link>

      <div className="mt-6">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Career Setup
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
          Power up your <span className="text-gradient">career analysis</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Provide your resume and a target job description once — we'll reuse them across every
          intelligence module.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Resume */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <FileText className="h-4 w-4 text-[var(--neon-violet)]" /> Your Resume
            </div>
            <ModeToggle value={resumeMode} onChange={setResumeMode} />
          </div>

          {resumeMode === "upload" ? (
            <DropZone
              file={resumeFile}
              onFile={setResumeFile}
              accept=".pdf,.doc,.docx"
              hint="PDF or DOCX up to 10MB"
            />
          ) : (
            <textarea
              rows={10}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text here…"
              className="mt-4 w-full resize-none rounded-lg border border-border bg-input/60 p-3 text-sm outline-none focus:border-[var(--neon-violet)] focus:ring-2 focus:ring-[var(--neon-violet)]/30"
            />
          )}
        </motion.div>

        {/* JD */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Briefcase className="h-4 w-4 text-[var(--neon-cyan)]" /> Job Description
            </div>
            <ModeToggle value={jdMode} onChange={setJdMode} />
          </div>

          {jdMode === "upload" ? (
            <DropZone
              file={jdFile}
              onFile={setJdFile}
              accept=".pdf,.doc,.docx,.txt"
              hint="PDF, DOCX or TXT"
            />
          ) : (
            <textarea
              rows={10}
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the full job description…"
              className="mt-4 w-full resize-none rounded-lg border border-border bg-input/60 p-3 text-sm outline-none focus:border-[var(--neon-cyan)] focus:ring-2 focus:ring-[var(--neon-cyan)]/30"
            />
          )}
        </motion.div>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <button
          onClick={start}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium btn-glow btn-glow-hover disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          Start Analysis
        </button>
      </div>
    </div>
  );
}

function ModeToggle({
  value,
  onChange,
}: {
  value: "upload" | "paste";
  onChange: (v: "upload" | "paste") => void;
}) {
  return (
    <div className="inline-flex rounded-lg border border-border bg-secondary/30 p-0.5 text-xs">
      {(["upload", "paste"] as const).map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className={`rounded-md px-3 py-1 capitalize transition ${
            value === m ? "bg-secondary text-foreground" : "text-muted-foreground"
          }`}
        >
          {m}
        </button>
      ))}
    </div>
  );
}

function DropZone({
  file,
  onFile,
  accept,
  hint,
}: {
  file: File | null;
  onFile: (f: File | null) => void;
  accept: string;
  hint: string;
}) {
  return (
    <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/70 bg-secondary/20 px-4 py-10 text-center hover:border-[var(--neon-cyan)]">
      <Upload className="h-7 w-7 text-[var(--neon-cyan)]" />
      <div className="mt-2 text-sm font-medium">
        {file ? file.name : "Click or drop file"}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
      <input
        type="file"
        className="hidden"
        accept={accept}
        onChange={(e) => onFile(e.target.files?.[0] || null)}
      />
    </label>
  );
}
