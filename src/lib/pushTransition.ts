export const PUSH_TRANSITION = { duration: 0.3, ease: [0.32, 0.72, 0, 1] as const };

// A gentle fade-up + subtle-scale transition (used by the alt-nav post detail
// in place of the horizontal push).
export const FADE_TRANSITION = { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const };
export const FADE_IN = { initial: { opacity: 0, y: 14, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 } };
export const FADE_OUT = { initial: { opacity: 1, y: 0, scale: 1 }, animate: { opacity: 0, y: 6, scale: 0.985 } };
