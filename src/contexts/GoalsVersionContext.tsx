import { createContext, useContext, useState, type ReactNode } from "react";

// Which goals experience is active: the trimmed MVP (milestones + tasks,
// checklist/kanban, no routines/master-list) or the complete original
// feature set (projects/tasks/routines, resizable drag-and-drop board,
// master task list, content queue, cross-goal reassignment). Same pattern
// as the Expert/Alt Analytics admin toggles — plain state, not persisted.
export type GoalsVersion = "mvp" | "full";

interface GoalsVersionContextValue {
  version: GoalsVersion;
  setVersion: (v: GoalsVersion) => void;
}

const GoalsVersionContext = createContext<GoalsVersionContextValue>({
  version: "mvp",
  setVersion: () => {},
});

export function GoalsVersionProvider({ children }: { children: ReactNode }) {
  const [version, setVersion] = useState<GoalsVersion>("mvp");
  return <GoalsVersionContext.Provider value={{ version, setVersion }}>{children}</GoalsVersionContext.Provider>;
}

export function useGoalsVersion() {
  return useContext(GoalsVersionContext);
}
