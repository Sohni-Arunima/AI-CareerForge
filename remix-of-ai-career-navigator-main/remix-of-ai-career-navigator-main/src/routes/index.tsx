import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, FileText, ShieldCheck, Target, TrendingUp } from "lucide-react";
import { AIOrb } from "../components/AIOrb";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI CareerForge — Build Your Future With AI" },
      {
        name: "description",
        content:
          "AI powered resume creation, ATS optimization, job matching and career growth platform.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: FileText,
    title: "Smart Resume Builder",
    desc: "Craft tailored, recruiter-ready resumes with AI guidance.",
  },
  {
    icon: ShieldCheck,
    title: "ATS Intelligence",
    desc: "Beat applicant tracking systems with optimized keywords.",
  },
  {
    icon: Target,
    title: "Job Matching",
    desc: "Pinpoint roles that fit your skills and ambitions.",
  },
  {
    icon: TrendingUp,
    title: "Career Growth",
    desc: "Personalized growth plans and interview prep.",
  },
];

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* nav */}
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl btn-glow">
            <span className="text-xs font-bold">AI</span>
          </div>
          <span className="text-sm font-semibold tracking-tight">AI CareerForge</span>
        </div>
        <Link
          to="/workspace"
          className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-4 py-2 text-sm hover:bg-secondary"
        >
          Launch app <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-8 sm:pt-14">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--neon-cyan)] shadow-[0_0_8px_var(--neon-cyan)]" />
              Now in beta · powered by FastAPI intelligence
            </div>
            <h1 className="mt-5 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Build Your Future <br />
              <span className="text-gradient">With AI</span>
            </h1>
            <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
              AI powered resume creation, ATS optimization, job matching and career growth
              platform — engineered for the next generation of professionals.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/workspace"
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium btn-glow btn-glow-hover"
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="rounded-xl border border-border bg-secondary/30 px-6 py-3 text-sm hover:bg-secondary"
              >
                See features
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative"
          >
            <AIOrb />
          </motion.div>
        </div>

        <section id="features" className="mt-28">
          <div className="mb-10 max-w-2xl">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              The platform
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              One workspace for your entire career journey
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="glass group relative overflow-hidden rounded-2xl p-6 transition-all hover:-translate-y-1"
              >
                <div
                  className="absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity group-hover:opacity-60"
                  style={{
                    background:
                      i % 2
                        ? "radial-gradient(circle, var(--neon-cyan), transparent 70%)"
                        : "radial-gradient(circle, var(--neon-violet), transparent 70%)",
                  }}
                />
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary ring-glow">
                  <f.icon className="h-5 w-5 text-[var(--neon-cyan)]" />
                </div>
                <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
