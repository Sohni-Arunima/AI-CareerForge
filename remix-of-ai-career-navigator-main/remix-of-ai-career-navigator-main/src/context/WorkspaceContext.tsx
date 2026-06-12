import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type WorkspaceState = {
  id: string | null;
  profile: {
    name?: string;
    headline?: string;
    email?: string;
    intro?: string;
    about?: string;
    linkedin?: string;
  } | null;
  preferences: {
    theme?: "dark" | "light";
    accent?: "purple" | "cyan" | "blue";
  } | null;
  resume: any | null;
  resumeFile: File | null;
  jobDescription: string | null;
  jdFile: File | null;
  atsResult: any | null;
  jobMatch: any | null;
  skillResult: any | null;
  growthPlan: any | null;
  interview: any | null;
  report: any | null;
};

const initialState: WorkspaceState = {
  id: null,
  profile: null,
  preferences: null,
  resume: null,
  resumeFile: null,
  jobDescription: null,
  jdFile: null,
  atsResult: null,
  jobMatch: null,
  skillResult: null,
  growthPlan: null,
  interview: null,
  report: null,
};

type Ctx = {
  workspace: WorkspaceState;
  update: <K extends keyof WorkspaceState>(key: K, value: WorkspaceState[K]) => void;
  setMany: (patch: Partial<WorkspaceState>) => void;
  reset: () => void;
};

const WorkspaceContext = createContext<Ctx | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspace, setWorkspace] = useState<WorkspaceState>(initialState);

  const update: Ctx["update"] = useCallback((key, value) => {
    setWorkspace((s) => ({ ...s, [key]: value }));
  }, []);
  const setMany = useCallback((patch: Partial<WorkspaceState>) => {
    setWorkspace((s) => ({ ...s, ...patch }));
  }, []);
  const reset = useCallback(() => setWorkspace(initialState), []);

  return (
    <WorkspaceContext.Provider value={{ workspace, update, setMany, reset }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used within WorkspaceProvider");
  return ctx;
}
