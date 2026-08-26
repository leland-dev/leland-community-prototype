import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { createPortal } from "react-dom";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../Button";
import lelandMark from "../../assets/leland-mark.svg";
import aibpImg from "../../assets/placeholder images/courses/AIBP.png";
import samWielenImg from "../../assets/placeholder images/courses/HERO-Sam-Vander-Wielen-case-study-scaled.avif";
import pic1 from "../../assets/profile photos/pic-1.png";
import pic2 from "../../assets/profile photos/pic-2.png";
import pic3 from "../../assets/profile photos/pic-3.png";
import pic4 from "../../assets/profile photos/pic-4.png";
import pic5 from "../../assets/profile photos/pic-5.png";
import pic6 from "../../assets/profile photos/pic-6.png";

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

export function PromoToggleList({ options }: { options: PromoToggle[] }) {
  const { active, toggle } = usePromoToggles();
  return (
    <div className="flex flex-col gap-2">
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
  );
}

// Designer versioning controls. Deliberately inconspicuous — a low-opacity dot
// button in the corner — so demos and screen recordings don't advertise the
// machinery to other users.
export function PromoTogglePanel({ options }: { options: PromoToggle[] }) {
  const [open, setOpen] = useState(false);
  const [params] = useSearchParams();
  // Hidden when this page renders inside the takeover's mini phone iframe.
  if (params.has("mini")) return null;

  // Portaled to <body>: the pages render inside transformed motion wrappers,
  // which would anchor `fixed` to themselves instead of the viewport.
  return createPortal(
    <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+72px)] right-4 z-[120] flex flex-col items-end gap-2 md:bottom-6 md:right-6">
      {open ? (
        <div className="w-56 rounded-2xl border border-gray-stroke bg-white p-4 shadow-xl">
          <p className="pb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-light">
            App promo demo
          </p>
          <PromoToggleList options={options} />
        </div>
      ) : null}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Designer controls"
        className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-[#B1B1B1]/20 backdrop-blur-[12px] transition-opacity ${open ? "opacity-100" : "opacity-20 hover:opacity-100"}`}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="3" cy="8" r="1.5" fill="#222222" />
          <circle cx="8" cy="8" r="1.5" fill="#222222" />
          <circle cx="13" cy="8" r="1.5" fill="#222222" />
        </svg>
      </button>
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

function PhoneFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative aspect-[830/1686] shrink-0 drop-shadow-2xl ${className}`}>
      <img src="/promo/iphone-frame.png" alt="" aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
      <div
        className="absolute overflow-hidden bg-black"
        style={{ left: "5.4%", right: "5.4%", top: "2.4%", bottom: "2.4%", borderRadius: "11.5% / 5.7%" }}
      >
        {children}
      </div>
    </div>
  );
}

function PhoneVideo({ className = "w-52" }: { className?: string }) {
  return (
    <PhoneFrame className={className}>
      <video
        src="/promo/app-intro.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="h-full w-full object-cover"
        style={{ transform: "scale(1.06)" }}
      />
    </PhoneFrame>
  );
}

/* ── Benefit screens for the desktop takeover carousel ─────────────────── */

function MiniChatScreen() {
  return (
    <div className="flex h-full flex-col bg-white pt-[14%]">
      <div className="flex items-center gap-2 border-b border-gray-stroke px-3 pb-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFD96F] text-[11px] font-semibold text-[#111]">P</span>
        <div>
          <p className="text-[12px] font-semibold leading-tight text-gray-dark">Priya Shah</p>
          <p className="text-[10px] leading-tight text-primary">Expert</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 px-3 py-3">
        <div className="max-w-[80%] self-start rounded-xl rounded-bl-sm bg-gray-hover px-2.5 py-1.5 text-[11px] leading-snug text-gray-dark">
          Just reviewed your essay draft, it&apos;s in great shape!
        </div>
        <div className="max-w-[80%] self-end rounded-xl rounded-br-sm bg-gray-dark px-2.5 py-1.5 text-[11px] leading-snug text-white">
          Amazing, anything left to tighten?
        </div>
        <div className="max-w-[80%] self-start rounded-xl rounded-bl-sm bg-gray-hover px-2.5 py-1.5 text-[11px] leading-snug text-gray-dark">
          Two small notes, sending them now.
        </div>
      </div>
      <div className="px-3 pb-4">
        <div className="rounded-full bg-gray-hover px-3 py-2 text-[11px] text-gray-xlight">Message Priya</div>
      </div>
    </div>
  );
}

function MiniNotifyScreen() {
  return (
    <div className="relative h-full">
      <img src="/promo/app-promo-bg.jpeg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
      <div className="relative flex h-full flex-col items-center pt-[18%]">
        <p className="font-serif text-[34px] font-medium leading-none text-white drop-shadow">9:41</p>
        <div className="mt-5 flex w-full flex-col gap-2 px-2.5">
          {[
            ["Priya sent you a message", "now"],
            ["Session with Jessica in 15 min", "13m ago"],
          ].map(([text, time]) => (
            <div key={text} className="flex items-center gap-2 rounded-xl bg-white/90 p-2 shadow-sm backdrop-blur">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-[#FFD96F]">
                <img src={lelandMark} alt="" className="h-4 w-4 brightness-0" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-semibold leading-tight text-gray-dark">Leland</p>
                <p className="truncate text-[11px] leading-tight text-gray-dark">{text}</p>
              </div>
              <span className="shrink-0 text-[9px] text-gray-light">{time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SlideVideo({
  src,
  fit = "cover",
  active = true,
}: {
  src: string;
  fit?: "cover" | "contain";
  active?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  // Restart from the top each time this slide comes into view, so the
  // animation always plays through for the viewer.
  useEffect(() => {
    if (active && ref.current) {
      ref.current.currentTime = 0;
      void ref.current.play();
    }
  }, [active]);
  return (
    <div className="h-full w-full bg-white">
      <video
        ref={ref}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        className={`h-full w-full ${fit === "cover" ? "object-cover" : "object-contain"}`}
      />
    </div>
  );
}

// Dashboard slide: cascades its cards in, holds, then scrolls down — the
// carousel returns to the intro video when the cycle completes.
const DASH_CYCLE_MS = 10500;

const INBOX_ROWS: Array<{
  name: string;
  time: string;
  preview: string;
  avatar: string;
  unread?: boolean;
  tag?: [string, string];
}> = [
  { name: "Liam S.", time: "12m", preview: "That all sounds great! Looking forward t…", avatar: pic2, tag: ["Package in-progress", "bg-[#E4ECFB] text-[#3B5BDB]"] },
  { name: "Mia R.", time: "16h", preview: "Can you tell me more about your proce…", avatar: pic3 },
  { name: "Jess P.", time: "12m", preview: "Looking good, let's keep refining this on…", avatar: pic4, tag: ["Pending order", "bg-[#FBEEDD] text-[#B8741A]"] },
  { name: "Ethan G.", time: "2w", preview: "Looking forward to our first session", avatar: pic5 },
  { name: "Olivia P.", time: "2d", preview: "Sent a recommended offering", avatar: pic6, tag: ["1h 20m remaining", "bg-[#E4ECFB] text-[#3B5BDB]"] },
  { name: "Peter L.", time: "May 2", preview: "Thanks for all your help here.", avatar: pic1 },
  { name: "Casey T.", time: "1w", preview: "Perfect, see you Thursday!", avatar: pic5, tag: ["Package in-progress", "bg-[#E3EFDF] text-[#3E6B34]"] },
  { name: "Jordan K.", time: "2w", preview: "Sent the revised deck over", avatar: pic2 },
  { name: "Sarah O.", time: "3w", preview: "Thanks again for everything!", avatar: pic3 },
  { name: "James P.", time: "1mo", preview: "Really appreciate the mock interview.", avatar: pic6 },
];

function InboxRow({
  row,
}: {
  row: (typeof INBOX_ROWS)[number];
}) {
  return (
    <div className="flex gap-2 py-1.5">
      <span className="relative shrink-0">
        <img src={row.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
        {row.unread ? (
          <span className="absolute -right-0 -top-0 h-2 w-2 rounded-full bg-[#DC2B23] ring-2 ring-white" />
        ) : null}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] leading-tight text-gray-dark">
          <span className="font-semibold">{row.name}</span>
          <span className="pl-1 text-[9px] text-gray-xlight">{row.time}</span>
        </p>
        <p className="truncate text-[10px] leading-snug text-gray-light">{row.preview}</p>
        {row.tag ? (
          <span className={`mt-0.5 inline-block rounded-full px-1.5 py-0.5 text-[8px] font-medium ${row.tag[1]}`}>
            {row.tag[0]}
          </span>
        ) : null}
      </div>
    </div>
  );
}

// Inbox slide: title → chips/search → conversations cascade in one by one,
// then Alex's new message arrives at the top and the list shifts down.
function MiniInboxScreen({ active = true }: { active?: boolean }) {
  const [run, setRun] = useState(0);
  const [showNew, setShowNew] = useState(false);
  useEffect(() => {
    if (active) setRun((r) => r + 1);
  }, [active]);
  useEffect(() => {
    if (!active) return;
    setShowNew(false);
    const t = window.setTimeout(() => setShowNew(true), 3000);
    return () => window.clearTimeout(t);
  }, [active, run]);

  const item = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const } },
  };

  return (
    <div key={run} className="h-full overflow-hidden bg-white px-3 pt-[15%]">
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.16, delayChildren: 0.3 } } }}
      >
        <motion.div variants={item} className="flex items-center justify-between">
          <p className="font-serif text-[20px] font-medium text-gray-dark">Inbox</p>
          <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 text-gray-dark" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </motion.div>
        <motion.div variants={item} className="mt-2 flex gap-1.5 pb-1">
          <span className="flex items-center gap-1 rounded-full bg-gray-hover px-2.5 py-1 text-[9px] font-semibold text-gray-dark">
            All clients
            <svg viewBox="0 0 24 24" fill="none" className="h-2 w-2" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="m6 9 6 6 6-6"/></svg>
          </span>
          <span className="rounded-full px-2.5 py-1 text-[9px] font-semibold text-gray-dark ring-1 ring-gray-stroke">Tags</span>
        </motion.div>
        <div className="mt-1">
          <AnimatePresence>
            {showNew ? (
              <motion.div
                layout
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <InboxRow
                  row={{ name: "Alex W.", time: "now", preview: "Thank you so much!!", avatar: pic1, unread: true, tag: ["New client", "bg-[#E3EFDF] text-[#3E6B34]"] }}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
          {INBOX_ROWS.map((row) => (
            <motion.div key={row.name} layout variants={item}>
              <InboxRow row={row} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// The real /dashboard page rendered inside the device at phone width — true
// 1:1 with the product (its own entrance animations play on load). After the
// entrance settles we scroll the page, then the carousel loops onward.
let miniFrameSeq = Date.now();

function MiniDashboardScreen({ active = true }: { active?: boolean }) {
  const [run, setRun] = useState(0);
  // A never-repeating token: Chrome restores scroll per iframe URL, so a
  // reused query string would drop us back where the last run ended.
  const [token, setToken] = useState(() => ++miniFrameSeq);
  const frameRef = useRef<HTMLIFrameElement>(null);

  // Reload the page each time the slide becomes visible so its cascade
  // replays; park it back at the top when it rotates away.
  useEffect(() => {
    if (active) {
      setToken(++miniFrameSeq);
      setRun((r) => r + 1);
    } else {
      frameRef.current?.contentWindow?.scrollTo(0, 0);
    }
  }, [active]);

  // Once the cascade has filled in, imitate a user swiping: one burst, a
  // pause to read, then a second burst. Stops at the "Get help" card rather
  // than the empty tail below it.
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const timers: number[] = [];

    const glide = (from: number, to: number, dur: number) =>
      new Promise<void>((resolve) => {
        const w = frameRef.current?.contentWindow;
        if (!w) return resolve();
        // easeInOutCubic, seeded from the iframe's own clock
        const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
        let t0: number | null = null;
        const step = (now: number) => {
          if (t0 === null) t0 = now;
          const prog = Math.min(1, (now - t0) / dur);
          w.scrollTo(0, from + (to - from) * ease(prog));
          if (prog < 1) raf = w.requestAnimationFrame(step);
          else resolve();
        };
        raf = w.requestAnimationFrame(step);
      });

    const run = async () => {
      const w = frameRef.current?.contentWindow;
      const d = frameRef.current?.contentDocument;
      if (!w || !d) return;
      // Rest with the last real card ("Get help") sitting at the bottom of the
      // screen, so the page's trailing whitespace never comes into view.
      const help = [...d.querySelectorAll("h2, h3")].find((el) =>
        el.textContent?.trim().startsWith("Get help"),
      );
      const card = help?.closest("section") ?? help?.parentElement;
      const maxScroll = d.documentElement.scrollHeight - w.innerHeight;
      // Constraint A: don't scroll past the last card (no empty tail).
      const noTail = card
        ? Math.max(0, card.getBoundingClientRect().bottom + w.scrollY + 24 - w.innerHeight)
        : maxScroll;
      // Constraint B: leave breathing room between the topmost visible card
      // and the bottom of the sticky nav, so nothing tucks under it.
      const goals = [...d.querySelectorAll("h2, h3")].find((el) =>
        el.textContent?.trim().startsWith("My goals"),
      );
      const goalsCard = goals?.closest("section") ?? goals?.parentElement;
      const navH = d.querySelector("header.fixed")?.getBoundingClientRect().height ?? 80;
      const clearNav = goalsCard
        ? Math.max(0, goalsCard.getBoundingClientRect().top + w.scrollY - navH - 28)
        : maxScroll;
      const end = Math.min(maxScroll, noTail, clearNav);
      const mid = end * 0.52;
      await glide(0, mid, 1500);
      await new Promise<void>((r) => timers.push(window.setTimeout(r, 1100)));
      await glide(mid, end, 1500);
    };

    const start = window.setTimeout(() => void run(), 4200);
    timers.push(start);
    return () => {
      timers.forEach(window.clearTimeout);
      frameRef.current?.contentWindow?.cancelAnimationFrame?.(raf);
    };
  }, [active, run]);

  // The screen slot of the w-72 frame is ~257x557px — a 390x844 page at 0.66
  // fills it almost exactly (same aspect as the device).
  return (
    <div className="h-full w-full overflow-hidden bg-white">
      <iframe
        key={token}
        ref={frameRef}
        src={`/dashboard?mini=1&r=${token}`}
        title="Leland dashboard preview"
        onLoad={() => frameRef.current?.contentWindow?.scrollTo(0, 0)}
        style={{
          width: 390,
          height: 845,
          transform: "scale(0.66)",
          transformOrigin: "top left",
          border: 0,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

const BENEFITS = [
  {
    id: "app",
    title: "Leland, in your pocket",
    sub: "The full experience, anywhere",
    Screen: ({ active }: { active?: boolean }) => <SlideVideo src="/promo/app-intro.mp4" active={active} />,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="2" width="12" height="20" rx="3" />
        <path d="M11 18h2" />
      </svg>
    ),
  },
  {
    id: "message",
    title: "Message your experts",
    sub: "Your whole inbox, on the go",
    Screen: MiniInboxScreen,
    holdMs: 5800,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
  },
  {
    id: "dashboard",
    title: "Run it all from your pocket",
    sub: "Sessions, goals, and programs",
    Screen: MiniDashboardScreen,
    holdMs: DASH_CYCLE_MS,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
];

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

      {/* Desktop: green split; benefit list synced to the phone carousel */}
      <DesktopTakeoverBody onClickInside={(e) => e.stopPropagation()} closeButton={closeButton} />
    </div>,
    document.body,
  );
}

function DesktopTakeoverBody({
  onClickInside,
  closeButton,
}: {
  onClickInside: (e: React.MouseEvent) => void;
  closeButton: ReactNode;
}) {
  const [active, setActive] = useState(0);
  const [showQr, setShowQr] = useState(false);
  // Bumped when the already-active slide is chosen again, to replay it.
  const [restartTick, setRestartTick] = useState(0);
  const activeRef = useRef(0);
  const autoRef = useRef(true);

  const goTo = (i: number) => {
    if (i === activeRef.current) setRestartTick((t) => t + 1);
    activeRef.current = i;
    setActive(i);
  };

  // Gentle auto-advance until the user interacts; each slide can set its own
  // hold time (the dashboard holds longer while it builds and scrolls).
  useEffect(() => {
    if (!autoRef.current) return;
    const hold = (BENEFITS[active] as { holdMs?: number }).holdMs ?? 3500;
    const id = window.setTimeout(() => {
      if (autoRef.current) goTo((active + 1) % BENEFITS.length);
    }, hold);
    return () => window.clearTimeout(id);
  }, [active]);

  return (
    <div
      className="relative hidden h-full w-full flex-col overflow-hidden bg-white md:flex md:h-auto md:max-w-5xl md:flex-row md:rounded-3xl"
      onClick={onClickInside}
    >
      {closeButton}
      <div className="relative flex flex-col items-center justify-center gap-5 overflow-hidden px-12 py-14 md:w-1/2">
        <img src="/promo/app-promo-bg.jpeg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
        <PhoneFrame className="relative z-10 w-72">
          {/* Slides pass through white between each other: the outgoing one
              fades out fully before the next fades in. */}
          <div className="relative h-full w-full bg-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${BENEFITS[active].id}-${restartTick}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="h-full w-full"
              >
                {(() => {
                  const Screen = BENEFITS[active].Screen;
                  return <Screen active />;
                })()}
              </motion.div>
            </AnimatePresence>
          </div>
        </PhoneFrame>
        <div className="relative z-10 flex items-center gap-2">
          {BENEFITS.map((b, i) => (
            <button
              key={b.id}
              aria-label={`Show ${b.title}`}
              onClick={() => {
                autoRef.current = false;
                goTo(i);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === active ? "w-5 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>
      <div className="relative flex grow flex-col items-start justify-center gap-8 p-14 text-left md:w-1/2">
        {showQr ? (
          <motion.div
            key="qr"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.45, 0, 0.25, 1] }}
            className="flex flex-col items-start gap-7 text-left"
          >
            <h2 className="text-balance font-serif text-[38px] font-medium leading-[1.12] text-gray-dark">
              Scan to download
            </h2>
            <span className="inline-block rounded-2xl bg-white p-4 ring-1 ring-gray-stroke">
              <img src="/promo/qr-app-store.svg" alt="QR code linking to the Leland app" className="h-32 w-32" />
            </span>
            <p className="text-balance max-w-[300px] text-[15px] leading-normal text-gray-light">
              Point your phone&apos;s camera at the QR code to download the app.
            </p>
            <button
              onClick={() => setShowQr(false)}
              className="text-[14px] font-medium text-gray-light underline underline-offset-4 hover:text-gray-dark"
            >
              Back
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="benefits"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.45, 0, 0.25, 1] }}
            className="flex flex-col items-start gap-11"
          >
            <h2 className="text-balance font-serif text-[40px] font-medium leading-[1.12] text-gray-dark">
              Keep making progress
            </h2>
            <div className="flex flex-col gap-7">
              {BENEFITS.map((b, i) => (
                <button
                  key={b.id}
                  onClick={() => {
                    autoRef.current = false;
                    goTo(i);
                  }}
                  className={`flex w-80 items-center gap-3.5 text-left transition-opacity duration-500 ease-in-out ${
                    i === active ? "opacity-100" : "opacity-40 hover:opacity-70"
                  }`}
                >
                  <span className="relative flex h-10 w-10 shrink-0 items-center justify-center text-gray-dark">
                    {i === active ? (
                      <motion.span
                        layoutId="benefit-halo"
                        transition={{ type: "spring", stiffness: 300, damping: 28 }}
                        className="absolute inset-0 rounded-full bg-gray-hover"
                      />
                    ) : null}
                    <span className="relative">{b.icon}</span>
                  </span>
                  <div>
                    <p className="text-[16px] font-semibold leading-tight text-gray-dark">{b.title}</p>
                    <p className="mt-0.5 text-[13px] leading-tight text-gray-light">{b.sub}</p>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowQr(true)}
              className="w-80 rounded-full bg-[#FFD96F] py-3.5 text-[16px] font-semibold text-[#111111] transition-colors hover:bg-[#F3C948]"
            >
              Get the app
            </button>
            <StoreBadges className="w-80 justify-between gap-3 [&_img]:h-12 [&_img]:w-auto" />
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ── 2. Toast at the top
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

// ── 2b. Push banner (mobile: black smart banner; desktop: in-flow bar) ─────

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
