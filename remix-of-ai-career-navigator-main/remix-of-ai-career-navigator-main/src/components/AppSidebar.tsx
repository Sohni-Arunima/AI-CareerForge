import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Brain,
  Target,
  Radar,
  TrendingUp,
  MessagesSquare,
  FileBarChart2,
  Settings,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import { useState, type ComponentType } from "react";

type Item = { title: string; url: string; icon: ComponentType<{ className?: string }> };
type Section = { label: string; items: Item[] };

const sections: Section[] = [
  {
    label: "Main",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "Resume Studio", url: "/resume-studio", icon: FileText },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { title: "Resume Intelligence", url: "/resume-intelligence", icon: Brain },
      { title: "Job Match", url: "/job-match", icon: Target },
      { title: "Skill Radar", url: "/skill-radar", icon: Radar },
    ],
  },
  {
    label: "Growth",
    items: [
      { title: "Growth Plan", url: "/growth", icon: TrendingUp },
      { title: "Interview Prep", url: "/interview", icon: MessagesSquare },
      { title: "Reports", url: "/reports", icon: FileBarChart2 },
      { title: "Portfolio Builder", url: "/portfolio-builder", icon: FileText },
    ],
  },
  {
    label: "Settings",
    items: [
      { title: "Settings", url: "/settings", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 256 }}
      transition={{ type: "spring", stiffness: 200, damping: 26 }}
      className="glass-strong relative z-20 flex h-screen sticky top-0 flex-col border-r border-border/60"
    >
      <div className="flex items-center justify-between px-4 py-5">
        <Link to="/" className="flex items-center gap-2 overflow-hidden">
          <div className="relative grid h-9 w-9 place-items-center rounded-xl btn-glow">
            <Sparkles className="h-4 w-4" />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">AI CareerForge</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Career OS
              </div>
            </div>
          )}
        </Link>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="grid h-7 w-7 place-items-center rounded-md border border-border/60 text-muted-foreground hover:bg-secondary"
          aria-label="Toggle sidebar"
        >
          <ChevronLeft
            className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-6">
        {sections.map((section) => (
          <div key={section.label} className="mt-5">
            {!collapsed && (
              <div className="px-3 pb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {section.label}
              </div>
            )}
            <ul className="space-y-1">
              {section.items.map((it) => {
                const active = pathname === it.url;
                const Icon = it.icon;
                return (
                  <li key={it.url}>
                    <Link
                      to={it.url}
                      className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
                        active
                          ? "bg-secondary text-foreground ring-glow"
                          : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="truncate">{it.title}</span>}
                      {active && (
                        <motion.span
                          layoutId="active-pill"
                          className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-gradient-to-b from-[var(--neon-violet)] to-[var(--neon-cyan)]"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Debug card removed for production */}
    </motion.aside>
  );
}
