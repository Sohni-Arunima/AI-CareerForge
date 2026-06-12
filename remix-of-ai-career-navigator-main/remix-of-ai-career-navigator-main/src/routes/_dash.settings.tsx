import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useWorkspace } from "../context/WorkspaceContext";

type Theme = "dark" | "light";
type Accent = "purple" | "cyan" | "blue";

const THEME_KEY = "careerforge-theme";
const ACCENT_KEY = "careerforge-accent";

const themeVars: Record<Theme, Record<string, string>> = {
  dark: {
    "--background": "oklch(0.16 0.025 270)",
    "--foreground": "oklch(0.98 0.005 270)",
    "--card": "oklch(0.21 0.03 270)",
    "--card-foreground": "oklch(0.98 0.005 270)",
    "--popover": "oklch(0.21 0.03 270)",
    "--popover-foreground": "oklch(0.98 0.005 270)",
    "--secondary": "oklch(0.27 0.04 270)",
    "--secondary-foreground": "oklch(0.98 0.005 270)",
    "--muted": "oklch(0.24 0.03 270)",
    "--muted-foreground": "oklch(0.7 0.02 270)",
    "--border": "oklch(0.32 0.03 270 / 60%)",
    "--input": "oklch(0.27 0.04 270)",
    "--sidebar": "oklch(0.18 0.025 270)",
    "--sidebar-foreground": "oklch(0.95 0.005 270)",
    "--sidebar-accent": "oklch(0.25 0.03 270)",
    "--sidebar-accent-foreground": "oklch(0.98 0.005 270)",
    "--sidebar-border": "oklch(0.3 0.03 270 / 60%)",
  },
  light: {
    "--background": "oklch(0.97 0.01 270)",
    "--foreground": "oklch(0.18 0.025 270)",
    "--card": "oklch(0.99 0.005 270)",
    "--card-foreground": "oklch(0.18 0.025 270)",
    "--popover": "oklch(0.99 0.005 270)",
    "--popover-foreground": "oklch(0.18 0.025 270)",
    "--secondary": "oklch(0.91 0.02 270)",
    "--secondary-foreground": "oklch(0.18 0.025 270)",
    "--muted": "oklch(0.92 0.015 270)",
    "--muted-foreground": "oklch(0.42 0.025 270)",
    "--border": "oklch(0.82 0.025 270 / 80%)",
    "--input": "oklch(0.94 0.015 270)",
    "--sidebar": "oklch(0.95 0.012 270)",
    "--sidebar-foreground": "oklch(0.2 0.025 270)",
    "--sidebar-accent": "oklch(0.89 0.02 270)",
    "--sidebar-accent-foreground": "oklch(0.18 0.025 270)",
    "--sidebar-border": "oklch(0.82 0.025 270 / 80%)",
  },
};

const accentVars: Record<Accent, Record<string, string>> = {
  purple: {
    "--primary": "oklch(0.72 0.18 285)",
    "--ring": "oklch(0.72 0.18 285)",
    "--sidebar-primary": "oklch(0.72 0.18 285)",
    "--neon-violet": "oklch(0.7 0.22 295)",
    "--neon-cyan": "oklch(0.82 0.16 200)",
  },
  cyan: {
    "--primary": "oklch(0.78 0.16 200)",
    "--ring": "oklch(0.78 0.16 200)",
    "--sidebar-primary": "oklch(0.78 0.16 200)",
    "--neon-violet": "oklch(0.78 0.16 200)",
    "--neon-cyan": "oklch(0.82 0.16 200)",
  },
  blue: {
    "--primary": "oklch(0.66 0.2 255)",
    "--ring": "oklch(0.66 0.2 255)",
    "--sidebar-primary": "oklch(0.66 0.2 255)",
    "--neon-violet": "oklch(0.66 0.2 255)",
    "--neon-cyan": "oklch(0.74 0.16 225)",
  },
};

export const Route = createFileRoute("/_dash/settings")({
  head: () => ({ meta: [{ title: "Settings - AI CareerForge" }] }),
  component: SettingsPage,
});

function readPreference<T extends string>(key: string, fallback: T, allowed: readonly T[]) {
  if (typeof window === "undefined") return fallback;
  const value = window.localStorage.getItem(key) as T | null;
  return value && allowed.includes(value) ? value : fallback;
}

function applyAppearance(theme: Theme, accent: Accent) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.classList.toggle("light", theme === "light");
  root.classList.toggle("dark", theme === "dark");

  Object.entries(themeVars[theme]).forEach(([key, value]) => root.style.setProperty(key, value));
  Object.entries(accentVars[accent]).forEach(([key, value]) => root.style.setProperty(key, value));
}

export default function SettingsPage() {
  const { workspace, update } = useWorkspace();
  const profile = workspace.profile || {};

  const [name, setName] = useState(profile.name || "");
  const [role, setRole] = useState(profile.headline || "");
  const [email, setEmail] = useState(profile.email || "");
  const [theme, setTheme] = useState<Theme>(() =>
    readPreference(THEME_KEY, "dark", ["dark", "light"]),
  );
  const [accent, setAccent] = useState<Accent>(() =>
    readPreference(ACCENT_KEY, "purple", ["purple", "cyan", "blue"]),
  );

  useEffect(() => {
    applyAppearance(theme, accent);
    window.localStorage.setItem(THEME_KEY, theme);
    window.localStorage.setItem(ACCENT_KEY, accent);
    update("preferences", { theme, accent });
  }, [theme, accent, update]);

  const saveProfile = () => {
    update("profile", {
      ...profile,
      name,
      headline: role,
      email,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="glass rounded-2xl p-4">
          <SettingsIcon className="text-cyan-400" />
        </div>

        <div>
          <div className="tracking-[0.4em] text-xs text-muted-foreground uppercase">Module</div>

          <h1 className="text-3xl font-bold">Settings</h1>

          <p className="text-muted-foreground">Profile, appearance and application preferences.</p>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="text-sm font-semibold">Profile Settings</div>

        <div className="mt-3 grid gap-2">
          <input
            className="input"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="input"
            placeholder="Professional headline"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />

          <input
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button className="btn btn-primary mt-3" onClick={saveProfile}>
            Save Profile
          </button>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="text-sm font-semibold">Appearance</div>

        <div className="mt-3">
          <p className="text-xs">Theme</p>

          <div className="flex gap-2 mt-2">
            <button
              className={`btn ${theme === "dark" ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setTheme("dark")}
            >
              Dark AI Mode
            </button>

            <button
              className={`btn ${theme === "light" ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setTheme("light")}
            >
              Light Mode
            </button>
          </div>

          <p className="text-xs mt-4">Accent Color</p>

          <div className="flex gap-2 mt-2">
            {(["purple", "cyan", "blue"] as Accent[]).map((c) => (
              <button
                key={c}
                className={`btn ${accent === c ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setAccent(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="text-sm font-semibold">Career Preferences</div>

        <div className="mt-3 grid gap-2">
          <input className="input" placeholder="Target role" />

          <select className="input">
            <option>Entry</option>
            <option>Mid</option>
            <option>Senior</option>
          </select>

          <input className="input" placeholder="Preferred domain" />
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="text-sm font-semibold">Application</div>

        <div className="mt-3 flex gap-3">
          <button className="btn btn-ghost">Export Data</button>

          <button className="btn btn-destructive">Reset Preferences</button>
        </div>
      </div>
    </div>
  );
}
