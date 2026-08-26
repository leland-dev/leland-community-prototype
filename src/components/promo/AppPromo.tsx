import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { createPortal } from "react-dom";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../Button";
import lelandMark from "../../assets/leland-mark.svg";

// ────────────────────────────────────────────────────────────────────────────
// Mobile-app promo demo kit. Every piece is driven by the `promo` URL param
// (e.g. /dashboard?promo=toast,callout) so states are linkable; the floating
// toggle panel just edits that param. Local prototype only.
// ────────────────────────────────────────────────────────────────────────────

const APP_STORE_URL = "https://apps.apple.com/us/app/leland/id0000000000";

export type PromoToggle = "modal" | "toast" | "push" | "callout" | "message";

export function usePromoToggles(): {
  active: Set<PromoToggle>;
  toggle: (t: PromoToggle) => void;
  turnOff: (t: PromoToggle) => void;
} {
  const [params, setParams] = useSearchParams();
  const active = new Set(
    (params.get("promo") ?? "").split(",").filter(Boolean) as PromoToggle[],
  );

  const write = (next: Set<PromoToggle>) => {
    const p = new URLSearchParams(params);
    if (next.size === 0) p.delete("promo");
    else p.set("promo", [...next].join(","));
    setParams(p, { replace: true });
  };

  return {
    active,
    toggle: (t) => {
      const next = new Set(active);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      write(next);
    },
    turnOff: (t) => {
      const next = new Set(active);
      next.delete(t);
      write(next);
    },
  };
}

const TOGGLE_LABELS: Record<PromoToggle, string> = {
  modal: "Takeover modal",
  toast: "System toast (bottom)",
  push: "Push toast (top)",
  callout: "Inline callout",
  message: "Message from Leland",
};

export function PromoTogglePanel({ options }: { options: PromoToggle[] }) {
  const { active, toggle } = usePromoToggles();
  const [collapsed, setCollapsed] = useState(false);

  // Portaled to <body>: the pages render inside transformed motion wrappers,
  // which would anchor `fixed` to themselves instead of the viewport.
  if (collapsed) {
    return createPortal(
      <button
        onClick={() => setCollapsed(false)}
        className="fixed bottom-24 left-4 z-[120] rounded-full border border-gray-stroke bg-white px-3.5 py-2 text-[12px] font-semibold text-gray-dark shadow-xl md:bottom-6"
      >
        Demo
      </button>,
      document.body,
    );
  }

  return createPortal(
    <div className="fixed bottom-24 left-4 z-[120] w-56 rounded-2xl border border-gray-stroke bg-white p-4 shadow-xl md:bottom-6">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-light">
          App promo demo
        </p>
        <button
          onClick={() => setCollapsed(true)}
          aria-label="Collapse demo panel"
          className="-mr-1 flex h-6 w-6 items-center justify-center rounded-full text-gray-xlight hover:text-gray-dark"
        >
          <BoldX />
        </button>
      </div>
      <div className="mt-2 flex flex-col gap-2">
        {options.map((t) => (
          <label key={t} className="flex cursor-pointer items-center gap-2.5 text-[14px] text-gray-dark">
            <input
              type="checkbox"
              checked={active.has(t)}
              onChange={() => toggle(t)}
              className="h-4 w-4 accent-gray-dark"
            />
            {TOGGLE_LABELS[t]}
          </label>
        ))}
      </div>
    </div>,
    document.body,
  );
}

// ── Shared bits ─────────────────────────────────────────────────────────────

// The app icon: black tile, white mark (the mark asset is black, so invert).
function AppIcon({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-xl bg-black ${className}`}>
      <img src={lelandMark} alt="" className="h-3/5 w-3/5 brightness-0 invert" />
    </span>
  );
}

function StoreBadges({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="shrink-0">
        <img src="/promo/badge-app-store.svg" alt="Download on the App Store" className="h-11 w-auto" />
      </a>
      <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="shrink-0">
        <img src="/promo/badge-google-play.svg" alt="Get it on Google Play" className="h-11 w-auto" />
      </a>
    </div>
  );
}

function BoldX() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function PhoneVideo({ className = "w-52" }: { className?: string }) {
  return (
    <div className={`relative aspect-[830/1686] shrink-0 drop-shadow-2xl ${className}`}>
      <img src="/promo/iphone-frame.png" alt="" aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
      <div
        className="absolute overflow-hidden bg-black"
        style={{ left: "5.4%", right: "5.4%", top: "2.4%", bottom: "2.4%", borderRadius: "11.5% / 5.7%" }}
      >
        <video
          src="/promo/app-intro.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
          style={{ transform: "scale(1.06)" }}
        />
      </div>
      <div className="absolute left-1/2 top-[3.6%] z-10 h-[2.7%] w-[25%] -translate-x-1/2 rounded-full bg-black" />
    </div>
  );
}

// ── 1. Full-screen takeover modal ───────────────────────────────────────────

function useDeviceStore() {
  const isAndroid =
    typeof navigator !== "undefined" && /android/i.test(navigator.userAgent);
  return isAndroid
    ? { url: APP_STORE_URL, badge: "/promo/badge-google-play.svg", cta: "Get it on Google Play", alt: "Get it on Google Play" }
    : { url: APP_STORE_URL, badge: "/promo/badge-app-store.svg", cta: "Download on the App Store", alt: "Download on the App Store" };
}

export function AppPromoTakeover() {
  const { active, turnOff } = usePromoToggles();
  const store = useDeviceStore();
  if (!active.has("modal")) return null;

  const close = () => turnOff("modal");

  const closeButton = (
    <button
      onClick={close}
      aria-label="Close"
      className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-gray-hover text-gray-dark transition-colors hover:bg-gray-stroke"
    >
      <BoldX />
    </button>
  );

  return createPortal(
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/50 md:p-8" onClick={close}>
      {/* Mobile: white, auth-screen style. Title up top, device fading into
          the background, device-appropriate badge over one large CTA. */}
      <div
        className="relative flex h-full w-full flex-col overflow-hidden bg-white pt-[max(env(safe-area-inset-top),20px)] md:hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {closeButton}
        <h2 className="text-balance px-8 pt-9 text-center font-serif text-[30px] font-medium leading-[1.15] text-gray-dark">
          Keep making progress
        </h2>
        <p className="text-balance mt-2 px-8 text-center text-[15px] leading-normal text-gray-light">
          Stay connected to your experts and your goals.
        </p>
        <div className="relative mt-10 flex min-h-0 flex-1 justify-center">
          <div className="[mask-image:linear-gradient(to_bottom,black_45%,transparent_82%)]">
            <PhoneVideo className="w-64" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-8 px-6 pb-[max(env(safe-area-inset-bottom),64px)] pt-4">
          <img src={store.badge} alt={store.alt} className="h-11 w-auto" />
          <a
            href={store.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center rounded-full bg-[#FFD96F] py-4 text-[16px] font-semibold text-[#111111] transition-colors hover:bg-[#F3C948]"
          >
            Get the app
          </a>
        </div>
      </div>

      {/* Desktop: green split with the device video */}
      <div
        className="relative hidden h-full w-full flex-col overflow-hidden bg-white md:flex md:h-auto md:max-w-5xl md:flex-row md:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {closeButton}
        <div className="relative flex items-center justify-center overflow-hidden px-12 py-16 md:w-1/2">
          <img src="/promo/app-promo-bg.jpeg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10"
          >
            <PhoneVideo className="w-72" />
          </a>
        </div>
        <div className="flex grow flex-col items-start justify-center gap-10 p-16 md:w-1/2">
          <div>
            <h2 className="text-balance font-serif text-[44px] font-medium leading-[1.12] text-gray-dark">
              Keep making progress
            </h2>
            <p className="text-balance mt-4 max-w-[360px] text-[17px] leading-normal text-gray-light">
              Stay connected to your experts and your goals, wherever you are.
            </p>
          </div>
          <StoreBadges className="[&_img]:h-12" />
        </div>
      </div>
    </div>,
    document.body,
  );
}

// ── 2. Toast at the top ─────────────────────────────────────────────────────

export function AppPromoToast() {
  const { active, turnOff } = usePromoToggles();
  if (!active.has("toast")) return null;

  // Mirrors the product's system Toast: bottom-centered white card with a
  // full-height icon block on the left edge and a dismiss X on the right.
  return createPortal(
    <div className="fixed inset-x-2 bottom-6 z-[110] mx-auto max-w-xl">
      <div className="flex items-stretch overflow-hidden rounded-xl border border-gray-stroke bg-white shadow-xl">
        <div className="flex items-center justify-center bg-black p-3">
          <img src={lelandMark} alt="" className="h-7 w-7 brightness-0 invert" />
        </div>
        <div className="min-w-0 flex-1 self-center px-4 py-3">
          <p className="truncate text-[15px] font-semibold leading-tight text-gray-dark">
            Leland is better on the app
          </p>
          <p className="truncate text-[13px] leading-tight text-gray-light">
            Never miss a message.
          </p>
        </div>
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="self-center whitespace-nowrap rounded-full bg-gray-dark px-3.5 py-1.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-85"
        >
          Download
        </a>
        <button
          onClick={() => turnOff("toast")}
          aria-label="Dismiss"
          className="px-4 text-gray-xlight transition-colors hover:text-gray-dark"
        >
          <BoldX />
        </button>
      </div>
    </div>,
    document.body,
  );
}

// Swipe (or drag) horizontally past the threshold to dismiss.
function SwipeDismiss({
  onDismiss,
  children,
}: {
  onDismiss: () => void;
  children: ReactNode;
}) {
  const startX = useRef<number | null>(null);
  const [dx, setDx] = useState(0);

  return (
    <div
      style={{
        transform: `translateX(${dx}px)`,
        opacity: 1 - Math.min(Math.abs(dx) / 240, 0.9),
        touchAction: "pan-y",
        transition: startX.current === null ? "transform 0.2s, opacity 0.2s" : "none",
      }}
      onPointerDown={(e) => {
        startX.current = e.clientX;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (startX.current !== null) setDx(e.clientX - startX.current);
      }}
      onPointerUp={() => {
        if (Math.abs(dx) > 90) onDismiss();
        startX.current = null;
        setDx(0);
      }}
    >
      {children}
    </div>
  );
}

// ── 2b. Push-notification toast (top, industry standard) ───────────────────

const FULL_BLEED = {
  marginLeft: "calc(50% - 50vw)",
  marginRight: "calc(50% - 50vw)",
} as const;

export function AppPromoPushToast({ className = "" }: { className?: string }) {
  const { active } = usePromoToggles();
  if (!active.has("push")) return null;
  return <PushBanner className={className} />;
}

const SMART_BANNER_OFFSET = 64;
const BANNER_EASE = [0.45, 0, 0.25, 1] as const;
const BANNER_MS = 600;

function PushBanner({ className }: { className: string }) {
  const { turnOff } = usePromoToggles();
  const [isLeaving, setIsLeaving] = useState(false);

  const dismiss = () => {
    // Reverse the entrance, then actually remove.
    setIsLeaving(true);
    window.setTimeout(() => turnOff("push"), BANNER_MS);
  };

  // Mobile: the smart banner sits above EVERYTHING (nav included) and pushes
  // the whole app down; the app becomes a rounded sheet over a black backdrop.
  // Everything eases in together over BANNER_MS.
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const root = document.getElementById("root");
    const easing = `cubic-bezier(${BANNER_EASE.join(",")})`;

    // Match the real status bar to the banner black on device.
    let themeMeta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
    const prevTheme = themeMeta?.content ?? null;
    if (!themeMeta) {
      themeMeta = document.createElement("meta");
      themeMeta.name = "theme-color";
      document.head.appendChild(themeMeta);
    }

    document.body.style.transition = `padding-top ${BANNER_MS}ms ${easing}, background ${BANNER_MS}ms ${easing}`;
    if (root) root.style.transition = `border-radius ${BANNER_MS}ms ${easing}`;

    const apply = (on: boolean) => {
      document.documentElement.style.setProperty("--promo-banner-offset", on ? `${SMART_BANNER_OFFSET}px` : "0px");
      document.documentElement.style.setProperty("--promo-banner-radius", on ? "18px" : "0px");
      document.body.style.paddingTop = on ? `${SMART_BANNER_OFFSET}px` : "";
      document.documentElement.style.background = on ? "#000" : "";
      document.body.style.background = on ? "#000" : "";
      if (themeMeta) themeMeta.content = on ? "#000000" : (prevTheme ?? "");
      if (root) {
        root.style.borderRadius = on ? "18px 18px 0 0" : "";
        root.style.overflow = on ? "hidden" : "";
        root.style.background = on ? "#fff" : "";
        root.style.minHeight = on ? `calc(100vh - ${SMART_BANNER_OFFSET}px)` : "";
      }
    };

    const sync = () => apply(mql.matches && !isLeaving);
    // Start collapsed, then ease open on the next frame.
    apply(false);
    const raf = requestAnimationFrame(() => requestAnimationFrame(sync));
    mql.addEventListener("change", sync);
    return () => {
      cancelAnimationFrame(raf);
      mql.removeEventListener("change", sync);
      apply(false);
      document.body.style.transition = "";
      if (root) root.style.transition = "";
      if (themeMeta && prevTheme === null) themeMeta.remove();
    };
  }, [isLeaving]);

  return (
    <>
      {/* Mobile: black smart-app banner above the app */}
      {createPortal(
        <motion.div
          initial={{ y: "-100%" }}
          animate={{ y: isLeaving ? "-100%" : 0 }}
          transition={{ duration: BANNER_MS / 1000, ease: BANNER_EASE }}
          className="fixed inset-x-0 top-0 z-[60] h-16 bg-black md:hidden"
        >
          <div className="flex h-16 items-center gap-2.5 pl-3.5 pr-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#FFD96F]">
              <img src={lelandMark} alt="" className="h-5 w-5 brightness-0" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-semibold leading-tight text-white">
                Leland is better in the app
              </p>
              <p className="truncate text-[12px] leading-tight text-white/60">
                Download now
              </p>
            </div>
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-full bg-[#FFD96F] px-4 py-1.5 text-[13px] font-semibold text-[#111111]"
            >
              Open
            </a>
            <button
              onClick={dismiss}
              aria-label="Dismiss"
              className="flex h-7 w-7 shrink-0 items-center justify-center text-white/80 hover:text-white"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </motion.div>,
        document.body,
      )}

      {/* Desktop: in-flow, edge-to-edge banner */}
      <div
        className={`hidden border-b border-gray-stroke bg-white md:block ${className}`}
        style={FULL_BLEED}
      >
        <div className="flex items-center gap-3 py-2.5 pl-3 pr-2">
          <AppIcon className="h-9 w-9 rounded-[10px]" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold leading-tight text-gray-dark">
              Leland app
            </p>
            <p className="truncate text-[12px] leading-tight text-gray-light">
              Message Experts
            </p>
          </div>
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full bg-[#FFD96F] px-3.5 py-1.5 text-[13px] font-semibold text-[#111111] transition-colors hover:bg-[#F3C948]"
          >
            Download
          </a>
          <button
            onClick={() => turnOff("push")}
            aria-label="Dismiss"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-hover text-gray-dark transition-colors hover:bg-gray-stroke"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

// ── 3. Inline callout card ──────────────────────────────────────────────────

export function AppPromoCallout({
  variant = "row",
}: {
  variant?: "card" | "row";
}) {
  const { active, turnOff } = usePromoToggles();
  if (!active.has("callout")) return null;

  const dismiss = (
    <button
      onClick={() => turnOff("callout")}
      aria-label="Dismiss"
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-hover text-gray-dark transition-colors hover:bg-gray-stroke"
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </button>
  );

  const row = (
    <div
      className={
        variant === "card"
          ? // Matches the DashCard sections below it.
            "flex w-full items-center gap-3.5 rounded-2xl bg-white py-4 pl-4 pr-3 shadow-[0_1px_2px_0_rgba(16,24,40,0.06)] ring-1 ring-[#222222]/10"
          : // Sits in the messages list like a conversation row.
            "flex w-full items-center gap-3 rounded-xl px-2 py-3"
      }
    >
      <AppIcon className="h-12 w-12" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[16px] font-semibold text-gray-dark">
          <span className="sm:hidden">Leland app</span>
          <span className="hidden sm:inline">Keep making progress</span>
        </p>
        <p className="truncate text-[15px] text-gray-light">
          <span className="sm:hidden">Message Experts</span>
          <span className="hidden sm:inline">
            Your experts and goals, wherever you are.
          </span>
        </p>
      </div>
      <Button
        size="sm"
        variant="primary"
        rounded="rounded-full"
        style={{ fontWeight: 600 }}
        className="shrink-0"
        onClick={() => window.open(APP_STORE_URL, "_blank", "noopener")}
      >
        Download
      </Button>
      {dismiss}
    </div>
  );

  return <SwipeDismiss onDismiss={() => turnOff("callout")}>{row}</SwipeDismiss>;
}

// ── 4. Message from Leland (conversation row + thread) ─────────────────────

export function LelandConversationRow() {
  const { active } = usePromoToggles();
  const navigate = useNavigate();
  if (!active.has("message")) return null;

  return (
    <button
      onClick={() => navigate("/messages/leland")}
      className="flex w-full items-center gap-3 rounded-xl px-2 py-3 text-left transition-colors hover:bg-gray-hover"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-black">
        <img src={lelandMark} alt="" className="h-6 w-6 brightness-0 invert" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate text-[16px] font-semibold text-gray-dark">Leland</p>
          <span className="shrink-0 text-[13px] text-gray-xlight">now</span>
        </div>
        <p className="text-[13px] leading-tight text-primary">Official</p>
        <p className="mt-0.5 truncate text-[15px] text-gray-light">
          Keep making progress, get the app
        </p>
      </div>
    </button>
  );
}

const LELAND_MESSAGES = [
  { id: 1, text: "Hi Alex! Did you know Leland has a mobile app? 👋", time: "4:02 PM" },
  {
    id: 2,
    text: "Your experts, sessions, and messages, all in your pocket. You get a ping the moment an expert replies.",
    time: "4:02 PM",
  },
];

export function LelandThread() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[100dvh] flex-col bg-white">
      <div className="sticky top-0 z-20 flex items-center gap-2 border-b border-gray-stroke bg-white px-3 py-2.5 pt-[calc(env(safe-area-inset-top)+10px)]">
        <button
          onClick={() => navigate(-1)}
          aria-label="Back to messages"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-dark transition-colors hover:bg-gray-hover"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex min-w-0 flex-1 items-center justify-center">
          <p className="text-[15px] font-semibold leading-tight text-gray-dark">Conversation</p>
        </div>
        <span className="h-9 w-9 shrink-0" />
      </div>

      <div className="flex shrink-0 items-center gap-3 border-b border-gray-stroke px-4 py-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black">
          <img src={lelandMark} alt="" className="h-5 w-5 brightness-0 invert" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold leading-tight text-gray-dark">Leland</p>
          <p className="truncate text-[13px] leading-tight text-primary">Official</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 px-4 py-4">
        <p className="my-2 text-center text-[12px] text-gray-xlight">Today</p>
        {LELAND_MESSAGES.map((m) => (
          <div key={m.id} className="flex max-w-[78%] flex-col items-start self-start">
            <div className="rounded-2xl rounded-bl-md bg-gray-hover px-3.5 py-2 text-[15px] leading-[1.35] text-gray-dark">
              {m.text}
            </div>
          </div>
        ))}

        {/* Promo card in the thread */}
        <div className="mt-1 flex max-w-[85%] flex-col items-center gap-4 self-start rounded-2xl rounded-bl-md border border-gray-stroke bg-white p-5 text-center shadow-sm">
          <AppIcon className="h-14 w-14" />
          <div>
            <p className="font-serif text-[22px] font-medium leading-snug text-gray-dark">
              Keep making progress
            </p>
            <p className="mt-1 text-[14px] leading-normal text-gray-light">
              Stay connected to your experts and your goals, wherever you are.
            </p>
          </div>
          <Button
            size="md"
            variant="primary"
            className="w-full"
            onClick={() => window.open(APP_STORE_URL, "_blank", "noopener")}
          >
            Download the app
          </Button>
        </div>
        <span className="mt-1 px-1 text-[11px] text-gray-xlight">4:02 PM</span>
      </div>

      <div className="sticky bottom-0 z-20 shrink-0 border-t border-gray-stroke bg-white px-3 py-2.5 pb-[calc(env(safe-area-inset-bottom)+10px)]">
        <input
          type="text"
          placeholder="Message Leland"
          className="w-full rounded-full bg-gray-hover px-4 py-2.5 text-[15px] text-gray-dark outline-none placeholder:text-gray-light"
        />
      </div>
    </div>
  );
}
