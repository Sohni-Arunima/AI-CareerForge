import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FilePlus2, BrainCircuit, ArrowRight, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/workspace")({
  head: () => ({ meta: [{ title: "Choose your workspace · AI CareerForge" }] }),
  component: WorkspaceSelect,
});

function WorkspaceSelect() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <div className="mt-8 max-w-2xl">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Step 1 of 2
        </div>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          Choose your <span className="text-gradient">workspace</span>
        </h1>
        <p className="mt-3 text-muted-foreground">
          Pick how you want to begin. You can always switch contexts later.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {[
          {
            icon: FilePlus2,
            title: "Create Resume",
            desc: "For new users creating professional resumes from scratch with AI.",
            cta: "Create Resume",
            to: "/resume-studio",
            hue: "var(--neon-violet)",
          },
          {
            icon: BrainCircuit,
            title: "Career Intelligence",
            desc: "Analyze your existing resume against a job description and unlock insights.",
            cta: "Analyze Career",
            to: "/career-setup",
            hue: "var(--neon-cyan)",
          },
        ].map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="glass group relative overflow-hidden rounded-3xl p-8"
          >
            <div
              className="absolute -right-20 -top-20 h-60 w-60 rounded-full opacity-30 blur-3xl transition-opacity group-hover:opacity-60"
              style={{ background: `radial-gradient(circle, ${c.hue}, transparent 70%)` }}
            />
            <div
              className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary ring-glow"
              style={{ color: c.hue }}
            >
              <c.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-2xl font-semibold">{c.title}</h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">{c.desc}</p>
            <Link
              to={c.to}
              className="mt-8 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium btn-glow btn-glow-hover"
            >
              {c.cta} <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
