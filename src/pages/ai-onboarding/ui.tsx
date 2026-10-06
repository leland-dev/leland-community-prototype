/* Shared shell + primitives for the AI Builder onboarding journey.
 * Two themes: "light" (on-stack Leland, used for the questions) and "dark"
 * (AI Builder Program brand: dark gradient, white Season headlines, Leland
 * yellow for CTAs and stars, pill shapes — used on the brand panels). */
import React, { useEffect, useRef } from "react";
import { motion, stagger, useAnimate, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "../../components/Button";
import { LelandWordmark } from "./LelandWordmark";
import { ProfileMenu } from "./ProfileMenu";
import aibpLockup from "../../assets/ai-onboarding/aibp-lockup-light.png";

export type Theme = "light" | "dark";
export const ACCENT = "#FFD96F"; // Leland yellow — the AI Builder Program uses the core brand accent

/** The one content width every step in the flow obeys (incl. Back/Skip and the Continue button). */
export const FLOW_COLUMN = "max-w-[680px]";

/* ── Logo ──────────────────────────────────────────────────────────────── */
export function LelandLogo({ theme = "light", className = "" }: { theme?: Theme; className?: string }) {
  return <LelandWordmark className={`h-[22px] w-auto ${theme === "dark" ? "text-white" : "text-ink-primary"} ${className}`} />;
}

/* ── Shell: top bar (logo · progress · meta) + centred content column ──── */
export function Shell({
  theme = "light",
  step,
  total,
  onBack,
  onSkip,
  scrollKey,
  children,
}: {
  theme?: Theme;
  step?: number;
  total?: number;
  onBack?: () => void;
  onSkip?: () => void;
  /** Changing this scrolls the content column back to the top. */
  scrollKey?: string;
  children: React.ReactNode;
}) {
  const dark = theme === "dark";
  const text = dark ? "text-white" : "text-ink-primary";
  const muted = dark ? "text-white/50" : "text-ink-secondary";
  const mainRef = useRef<HTMLElement>(null);
  useEffect(() => { mainRef.current?.scrollTo({ top: 0 }); }, [scrollKey]);
  return (
    <div className={`fixed inset-0 z-50 flex flex-col overflow-hidden transition-colors duration-500 ${dark ? "bg-black" : "bg-white"} ${text}`}>
      <header className={`flex h-16 shrink-0 items-center justify-between border-b px-5 transition-colors duration-500 md:px-8 ${dark ? "border-white/10" : "border-transparent"}`}>
        <div className="flex w-[120px] items-center">
          <LelandLogo theme={theme} />
        </div>
        {step && total ? <Progress step={step} total={total} theme={theme} /> : <div />}
        <div className="flex w-[120px] items-center justify-end">
          <ProfileMenu theme={theme} />
        </div>
      </header>
      <main ref={mainRef} className="flex-1 overflow-y-auto">
        <div className={`mx-auto flex min-h-full w-full flex-col px-5 pb-16 pt-6 md:pt-8 ${FLOW_COLUMN}`}>
          {/* Back / Skip live in the content column, within easy reach of the question. */}
          <div className="mb-6 flex h-8 items-center justify-between md:mb-8">
            {onBack ? (
              <Button variant={dark ? "glass" : "secondary"} size="sm" rounded="rounded-full" onClick={onBack} className={`-ml-1 ${dark ? "bg-white/10! hover:bg-white/20!" : ""}`}>
                <ArrowLeft size={14} /> Back
              </Button>
            ) : <span />}
            {onSkip ? (
              <button onClick={onSkip} className={`text-[13px] font-medium underline-offset-4 hover:underline ${muted}`}>
                Skip
              </button>
            ) : null}
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}

function Progress({ step, total, theme }: { step: number; total: number; theme: Theme }) {
  const dark = theme === "dark";
  return (
    <div className="hidden items-center gap-1.5 sm:flex" aria-label={`Step ${step} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`h-1 w-7 overflow-hidden ${dark ? "rounded-none bg-white/15" : "rounded-full bg-[#222222]/10"}`}>
          <motion.div
            className="h-full"
            style={{ background: dark ? ACCENT : "#222222" }}
            initial={false}
            animate={{ width: i < step ? "100%" : "0%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      ))}
    </div>
  );
}

/* ── Type ──────────────────────────────────────────────────────────────── */
export function Eyebrow({ children, theme = "light", className = "" }: { children: React.ReactNode; theme?: Theme; className?: string }) {
  const dark = theme === "dark";
  return (
    <div className={`mb-3 text-[12px] font-medium uppercase tracking-[0.14em] ${dark ? "text-white/60" : "text-ink-secondary"} ${className}`}>
      {children}
    </div>
  );
}

/** Question / moment title. Season serif like the rest of the product's page
 *  titles (course viewer, My Programs); Macan stays for UI text and options. */
export function Heading({ children, className = "", size = "md" }: { children: React.ReactNode; className?: string; size?: "md" | "lg" }) {
  const s = size === "lg" ? "text-[38px] md:text-[52px]" : "text-[30px] md:text-[38px]";
  return <h1 className={`text-balance font-serif ${s} font-medium leading-[1.1] text-gray-dark ${className}`}>{children}</h1>;
}

export function Sub({ children, theme = "light", className = "" }: { children: React.ReactNode; theme?: Theme; className?: string }) {
  return (
    <p className={`mt-3 text-balance text-[16px] leading-[1.5] md:text-[17px] ${theme === "dark" ? "text-white/60" : "text-gray-light"} ${className}`}>
      {children}
    </p>
  );
}

/* ── Option cards (single or multi select) ─────────────────────────────── */
export function OptionCard({
  selected,
  onClick,
  icon: Icon,
  logo,
  label,
  desc,
  theme = "light",
  multi = false,
  compact = false,
}: {
  selected: boolean;
  onClick: () => void;
  icon?: LucideIcon;
  logo?: string;
  label: string;
  desc?: string;
  theme?: Theme;
  multi?: boolean;
  compact?: boolean;
}) {
  const dark = theme === "dark";
  const base = dark
    ? `${selected ? "border-yellow bg-white/10" : "border-white/20 hover:border-white/50 hover:bg-white/5"} rounded-xl`
    : `${selected ? "border-ink-primary bg-[#222222]/[0.03]" : "border-gray-stroke hover:border-ink-primary/40 hover:bg-gray-hover"} rounded-xl`;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group flex w-full items-center gap-4 border text-left transition-colors ${compact ? "px-4 py-3" : "px-5 py-4"} ${base}`}
    >
      {logo ? (
        <img src={`${import.meta.env.BASE_URL}${logo}`} alt="" className="size-10 shrink-0 rounded-lg object-cover" />
      ) : Icon ? (
        <span className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${dark ? "bg-white/[0.06] text-white" : "bg-[#222222]/5 text-ink-primary"}`}>
          <Icon size={20} strokeWidth={1.75} />
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="block text-[16px] font-medium leading-[1.25]">{label}</span>
        {desc ? <span className={`mt-0.5 block text-[14px] leading-[1.4] ${dark ? "text-white/50" : "text-ink-secondary"}`}>{desc}</span> : null}
      </span>
      <span
        className={`flex size-5 shrink-0 items-center justify-center border transition-colors ${multi ? "rounded-[5px]" : "rounded-full"} ${
          selected
            ? dark ? "border-yellow bg-yellow text-ink-primary" : "border-ink-primary bg-ink-primary text-white"
            : dark ? "border-white/30" : "border-gray-stroke group-hover:border-ink-primary/40"
        }`}
      >
        {selected ? <Check size={12} strokeWidth={3} /> : null}
      </span>
    </button>
  );
}

export function OptionGrid({ children, cols = 1 }: { children: React.ReactNode; cols?: 1 | 2 }) {
  return <div className={`mt-8 grid gap-3 ${cols === 2 ? "sm:grid-cols-2" : ""}`}>{children}</div>;
}

/* ── Inputs ────────────────────────────────────────────────────────────── */
export function TextInput({
  label,
  hint,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string }) {
  return (
    <label className={`block ${className}`}>
      {label ? <span className="mb-1.5 block text-[13px] font-medium text-ink-secondary">{label}</span> : null}
      <input
        {...props}
        className="h-12 w-full rounded-xl border border-gray-stroke bg-white px-4 text-[16px] text-ink-primary outline-none transition-colors placeholder:text-gray-xlight focus:border-ink-primary"
      />
      {hint ? <span className="mt-1.5 block text-[12px] text-gray-extra-light">{hint}</span> : null}
    </label>
  );
}

/* ── Actions ───────────────────────────────────────────────────────────── */
export function Actions({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mt-10 flex flex-wrap items-center gap-3 ${className}`}>{children}</div>;
}

/** Primary CTA. Light = Leland yellow pill. Dark = AI Builder lime, square, mono. */
export function Cta({
  theme = "light",
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { theme?: Theme }) {
  if (theme === "dark") {
    return (
      <Button size="lg" variant="primary" rounded="rounded-full" className={`px-7! ${className}`} {...props}>
        {children}
      </Button>
    );
  }
  return (
    <Button size="lg" variant="dark" rounded="rounded-full" className={`px-7! ${className}`} {...props}>
      {children}
    </Button>
  );
}

export function GhostCta({
  theme = "light",
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { theme?: Theme }) {
  if (theme === "dark") {
    return (
      <Button
        size="lg"
        variant="glass"
        rounded="rounded-full"
        className={`bg-transparent! border border-white/40 text-white hover:bg-white/10! ${className}`}
        {...props}
      >
        {children}
      </Button>
    );
  }
  return (
    <Button size="lg" variant="secondary" rounded="rounded-full" className={className} {...props}>
      {children}
    </Button>
  );
}

/* ── Small bits ────────────────────────────────────────────────────────── */
/** "AI BuilderProgram" lockup (pixel AI badge + wordmark), light version for
 *  dark surfaces. Pairs with the white Leland wordmark and a thin divider. */
export function BrandLockup({ className = "" }: { className?: string }) {
  return <img src={aibpLockup} alt="AI Builder Program" className={`h-[30px] w-auto ${className}`} />;
}

/** Soft pill label for dark surfaces (e.g. "Level 0 · Foundations"). */
export function DarkTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-white/15 px-2.5 py-1 text-[12px] font-medium text-white">
      {children}
    </span>
  );
}

export function Initials({ text }: { text: string; dark?: boolean }) {
  return (
    <span
      className={`flex size-10 shrink-0 items-center justify-center rounded-md text-[13px] font-semibold ${
        "bg-yellow text-ink-primary"
      }`}
    >
      {text}
    </span>
  );
}

/* ── Tile card: big centred option (Higgsfield-style), radio top-right ──── */
export function TileCard({
  selected,
  onClick,
  icon: Icon,
  dots,
  label,
  desc,
  compact = false,
  multi = false,
  className = "",
}: {
  selected: boolean;
  onClick: () => void;
  icon?: LucideIcon;
  dots?: 1 | 2 | 3 | 4;
  label: string;
  desc?: string;
  compact?: boolean;
  multi?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group relative flex w-full flex-col items-center justify-center rounded-2xl border text-center transition-colors ${
        compact ? "min-h-[124px] px-4 py-5" : "min-h-[156px] px-5 py-6 md:min-h-[172px]"
      } ${selected ? "border-ink-primary bg-[#222222]/[0.03]" : "border-gray-stroke bg-white hover:border-ink-primary/40 hover:bg-gray-hover"} ${className}`}
    >
      <span
        className={`absolute right-3.5 top-3.5 flex size-5 items-center justify-center border transition-colors ${multi ? "rounded-[5px]" : "rounded-full"} ${
          selected ? "border-ink-primary bg-ink-primary text-white" : "border-gray-stroke group-hover:border-ink-primary/40"
        }`}
      >
        {selected ? <Check size={12} strokeWidth={3} /> : null}
      </span>
      <span className={`flex items-center justify-center text-ink-primary ${compact ? "h-8" : "h-9"}`}>
        {dots ? <Dots n={dots} selected={selected} /> : Icon ? <Icon size={compact ? 24 : 26} strokeWidth={1.75} /> : null}
      </span>
      <span className={`block font-medium leading-tight ${compact ? "mt-3 text-[15px]" : "mt-3 text-[16px]"}`}>{label}</span>
      {desc ? <span className="mt-1 block max-w-[230px] text-[13px] leading-[1.4] text-gray-light">{desc}</span> : null}
    </button>
  );
}

/** 1–4 dots in the Higgsfield arrangement: single, diagonal, triangle, diamond.
 *  When `selected` flips to true the dots "settle": each takes a quick breath
 *  (scale 1 → 0.7 → 1.06 → 1 with a slight opacity dip) in a left-to-right
 *  sweep, 320ms per dot with a 40ms stagger. One-shot on the rising edge only:
 *  no replay on re-render, nothing on mount, nothing on deselect. */
const DOT_LAYOUTS: Record<number, [number, number][]> = {
  // ordered by cx asc, then cy asc — this is the stagger order
  1: [[14, 14]],
  2: [[9, 18], [19, 10]],
  3: [[8, 19], [14, 9], [20, 19]],
  4: [[6, 14], [14, 6], [14, 22], [22, 14]],
};
const SETTLE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Dots({ n, selected = false }: { n: 1 | 2 | 3 | 4; selected?: boolean }) {
  const [scope, animate] = useAnimate<SVGSVGElement>();
  const reduceMotion = useReducedMotion();
  const prev = useRef(selected);
  useEffect(() => {
    if (selected && !prev.current) {
      if (reduceMotion) {
        animate("circle", { opacity: [0.6, 1] }, { duration: 0.15, ease: SETTLE_EASE });
      } else {
        animate(
          "circle",
          { scale: [1, 0.7, 1.06, 1], opacity: [1, 0.55, 1, 1] },
          { duration: 0.32, times: [0, 0.35, 0.7, 1], ease: SETTLE_EASE, delay: stagger(0.04) },
        );
      }
    }
    prev.current = selected;
  }, [selected, animate, reduceMotion]);
  return (
    <svg ref={scope} width="28" height="28" viewBox="0 0 28 28" aria-hidden>
      {DOT_LAYOUTS[n].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3.2" fill="currentColor" style={{ transformBox: "fill-box", transformOrigin: "center" }} />
      ))}
    </svg>
  );
}

/** The step's primary action: full-width black button at the bottom of the
 *  column, in the same place on every screen. Disabled until the step is valid. */
export function StepContinue({
  children = "Continue",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <div className={`mt-18 ${className}`}>
      <Cta className="w-full" {...props}>
        {children} <ArrowRight size={16} />
      </Cta>
    </div>
  );
}

/* ── Chip: compact multi-select pill with an optional leading icon ──────── */
export function Chip({
  selected,
  onClick,
  icon: Icon,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  icon?: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[14px] font-medium leading-[1.2] transition-colors ${
        selected
          ? "border-ink-primary bg-ink-primary text-white"
          : "border-gray-stroke bg-white text-ink-primary hover:border-ink-primary/40 hover:bg-gray-hover"
      }`}
    >
      {Icon ? <Icon size={16} strokeWidth={1.75} className={selected ? "text-white" : "text-ink-secondary"} /> : null}
      {children}
    </button>
  );
}
