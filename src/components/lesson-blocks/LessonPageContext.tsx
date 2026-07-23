// Supplies imperative callbacks to product/CTA blocks so block *data* stays
// serializable (blocks never carry functions). Provided by the lesson page in
// ContentViewer; consumed by LiveSessionBanner / ShareFeedback / Cta.
import { createContext, useContext, type ReactNode } from "react";

import type { LiveSessionVariant } from "../../data/lessonBlocks";

type LessonPageActions = {
  onShareFeedback: () => void;
  onOpenCalendar: () => void;
  // Which live-session callout variant to render (from the prototype menu).
  liveSessionVariant: LiveSessionVariant;
};

const LessonPageContext = createContext<LessonPageActions | null>(null);

export function LessonPageProvider({
  actions,
  children,
}: {
  actions: LessonPageActions;
  children: ReactNode;
}) {
  return (
    <LessonPageContext.Provider value={actions}>
      {children}
    </LessonPageContext.Provider>
  );
}

export function useLessonPage(): LessonPageActions {
  const ctx = useContext(LessonPageContext);
  if (!ctx) {
    throw new Error("useLessonPage must be used within a LessonPageProvider");
  }
  return ctx;
}
