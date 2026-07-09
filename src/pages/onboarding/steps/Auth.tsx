import { useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ArrowLeft, X, Eye, EyeOff, Check, Loader2, ArrowRight } from "lucide-react";

import profileInMock from "../../../assets/onboarding/profile in mock.png";

/* ─────────────────────────────────────────────────────────────────────────
 * Screen 7 — Auth as the "prize". A phone mock (top half, faded out at the
 * bottom) shows the user's community profile assembled from their answers.
 * X-style auth: small monochrome provider circles + a black email pill.
 * ──────────────────────────────────────────────────────────────────────── */

/* ── real company brand marks, in color ── */
function AppleMark() {
  // Apple's mark is monochrome by brand — solid black, centered.
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="#000" aria-hidden>
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.51 4.09l-.02-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}
function GoogleMark() {
  // Multicolor "G", no background tile.
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden>
      <path fill="#4285F4" d="M23.52 12.27c0-.82-.07-1.6-.2-2.36H12v4.47h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.1 3.57-5.18 3.57-8.74z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.08 7.95-2.9l-3.88-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.28v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58v-3.1H1.28a12 12 0 0 0 0 10.78l3.99-3.1z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44A11.98 11.98 0 0 0 12 0 12 12 0 0 0 1.28 6.61l3.99 3.1C6.22 6.86 8.87 4.75 12 4.75z" />
    </svg>
  );
}
function LinkedInMark() {
  // Just the LinkedIn blue "in".
  return (
    <svg viewBox="0 0 24 24" width="21" height="21" fill="#0A66C2" aria-hidden>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21H9z" />
    </svg>
  );
}

/* ── keyboard inset (continue rides above the keyboard) ── */
function useKeyboardInset() {
  const [inset, setInset] = useState(0);
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const onResize = () =>
      setInset(Math.max(0, window.innerHeight - vv.height - vv.offsetTop));
    vv.addEventListener("resize", onResize);
    vv.addEventListener("scroll", onResize);
    onResize();
    return () => {
      vv.removeEventListener("resize", onResize);
      vv.removeEventListener("scroll", onResize);
    };
  }, []);
  return inset;
}

/* ── phone mock: real iPhone frame + profile screenshot, top half only,
      faded out at the bottom by a gradient. ── */
function PhoneMock({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex h-full justify-center" style={{ perspective: 1000 }}>
      <div
        className="relative w-[320px] max-w-full overflow-hidden"
        style={{
          maskImage: "linear-gradient(to bottom, #000 68%, transparent 96%)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 68%, transparent 96%)",
        }}
      >
        {/* entrance rise + settle */}
        <motion.div
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className="absolute inset-x-0 top-0"
        >
          {/* idle float — single pre-composited mock (frame + profile + island) */}
          <motion.div
            animate={reduced ? undefined : { y: [0, -3, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-full"
          >
            <img
              src={profileInMock}
              alt="Your community profile"
              draggable={false}
              className="relative block w-full select-none"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

/* ── full-screen email sign-up (prototype) ──
 * Replaces the old bottom sheet: email → password → success, as its own
 * full-screen step that slides in over the auth screen. Shared by every flow
 * that renders <Auth>. */
function EmailSignup({
  onBack,
  onExit,
  onSuccess,
  reduced,
}: {
  onBack: () => void;
  onExit: () => void;
  onSuccess: () => void;
  reduced: boolean;
}) {
  const kb = useKeyboardInset();
  const [phase, setPhase] = useState<"email" | "password" | "success">("email");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState(false);
  const emailValid = /\S+@\S+\.\S+/.test(email);

  const onContinue = () => {
    if (phase === "email") {
      if (!emailValid) return setErr(true);
      setErr(false);
      setPhase("password");
    } else if (phase === "password") {
      if (pw.length < 6) return setErr(true);
      setErr(false);
      setPhase("success");
      window.setTimeout(onSuccess, 1000);
    }
  };

  // Back steps within the flow before leaving it entirely.
  const back = () => {
    if (phase === "password") {
      setPhase("email");
      setErr(false);
    } else {
      onBack();
    }
  };

  return (
    <motion.div
      className="absolute inset-0 z-[80] flex flex-col bg-white"
      initial={reduced ? { opacity: 0 } : { x: "100%" }}
      animate={reduced ? { opacity: 1 } : { x: 0 }}
      exit={reduced ? { opacity: 0 } : { x: "100%" }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* top chrome */}
      <div className="flex shrink-0 items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2">
        <button
          onClick={back}
          className="flex h-9 w-9 items-center justify-center rounded-full text-gray-dark hover:bg-black/[0.05]"
          aria-label="Back"
        >
          <ArrowLeft size={19} />
        </button>
        <button
          onClick={onExit}
          className="flex h-9 w-9 items-center justify-center rounded-full text-gray-light hover:bg-black/[0.05]"
          aria-label="Exit"
        >
          <X size={18} />
        </button>
      </div>

      {phase === "success" ? (
        <div className="flex flex-1 flex-col items-center justify-center px-6 pb-16 text-center">
          <motion.div
            initial={reduced ? { opacity: 0 } : { scale: 0 }}
            animate={reduced ? { opacity: 1 } : { scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 16 }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-dark text-white"
          >
            <Check size={30} strokeWidth={3} />
          </motion.div>
          <h2 className="mt-5 font-serif text-[26px] text-gray-dark">You're in!</h2>
          <p className="mt-1 text-[14px] text-gray-light">Setting up your account…</p>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onContinue();
          }}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 px-6 pt-4">
            <h2 className="font-serif text-[28px] leading-tight text-gray-dark">
              {phase === "email" ? "What's your email?" : "Create a password"}
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-gray-light">
              {phase === "email"
                ? "We'll use this to save your progress and keep you posted."
                : "At least 6 characters. You can change it anytime."}
            </p>

            <div className="mt-6">
              {phase === "email" ? (
                <motion.input
                  key="email"
                  autoFocus
                  type="email"
                  name="username"
                  autoComplete="username"
                  enterKeyHint="next"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  animate={err ? { x: [0, -6, 6, -4, 4, 0] } : {}}
                  transition={{ duration: 0.3 }}
                  className={`w-full rounded-xl border bg-white px-4 py-3.5 text-[16px] text-gray-dark outline-none placeholder:text-gray-xlight ${
                    err ? "border-red" : "border-gray-stroke focus:border-gray-dark/40"
                  }`}
                />
              ) : (
                <div className="relative">
                  <motion.input
                    key="pw"
                    autoFocus
                    type={show ? "text" : "password"}
                    name="password"
                    autoComplete="new-password"
                    enterKeyHint="go"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    placeholder="Create a password"
                    animate={err ? { x: [0, -6, 6, -4, 4, 0] } : {}}
                    transition={{ duration: 0.3 }}
                    className={`w-full rounded-xl border bg-white px-4 py-3.5 pr-12 text-[16px] text-gray-dark outline-none placeholder:text-gray-xlight ${
                      err ? "border-red" : "border-gray-stroke focus:border-gray-dark/40"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-gray-light"
                    aria-label={show ? "Hide password" : "Show password"}
                  >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              )}
              {err ? (
                <p className="mt-2 text-[13px] text-red">
                  {phase === "email" ? "Enter a valid email." : "At least 6 characters."}
                </p>
              ) : null}
            </div>
          </div>

          {/* CTA — rides above the keyboard */}
          <div
            className="shrink-0 px-6 pt-3"
            style={{
              paddingBottom: `calc(max(1rem, env(safe-area-inset-bottom)) + ${kb}px)`,
            }}
          >
            <button
              type="submit"
              className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-gray-dark text-[15px] font-medium text-white transition-colors hover:bg-[#333]"
            >
              {phase === "email" ? "Continue" : "Create account"}
              <ArrowRight size={16} />
            </button>
          </div>
        </form>
      )}
    </motion.div>
  );
}

/* ── small monochrome provider circle ── */
function CircleButton({
  onClick,
  loading,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  label: string;
  children: ReactNode;
}) {
  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.94 }}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-14 w-14 items-center justify-center rounded-full border border-gray-stroke bg-white text-gray-dark transition-colors hover:bg-gray-hover disabled:opacity-50"
    >
      {loading ? <Loader2 size={20} className="animate-spin" /> : children}
    </motion.button>
  );
}

export default function Auth({
  cohortName,
  memberCount,
  onBack,
  onExit,
  onNext,
}: {
  cohortName: string;
  memberCount: number;
  onBack: () => void;
  onExit: () => void;
  onNext: () => void;
}) {
  const reduced = useReducedMotion() ?? false;
  const [emailOpen, setEmailOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  const oauth = (provider: string) => {
    if (loading) return;
    setLoading(provider);
    window.setTimeout(onNext, 1100);
  };

  return (
    <div className="flex h-full flex-col bg-white">
      {/* top chrome */}
      <div className="flex shrink-0 items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2">
        <button
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-full text-gray-dark hover:bg-black/[0.05]"
          aria-label="Back"
        >
          <ArrowLeft size={19} />
        </button>
        <button
          onClick={onExit}
          className="flex h-9 w-9 items-center justify-center rounded-full text-gray-light hover:bg-black/[0.05]"
          aria-label="Exit"
        >
          <X size={18} />
        </button>
      </div>

      {/* headline */}
      <div className="shrink-0 px-6 pt-1 text-center">
        <h2 className="font-serif text-[26px] leading-tight text-gray-dark">
          Save your spot in {cohortName}
        </h2>
        <p className="mt-1 text-[14px] text-gray-light">
          <span className="font-semibold text-gray-dark tabular-nums">{memberCount}</span>{" "}
          members are in there now.
        </p>
      </div>

      {/* phone mock — top half, faded */}
      <div className="min-h-0 flex-1 px-6 pt-4">
        <PhoneMock reduced={reduced} />
      </div>

      {/* thumb zone */}
      <motion.div
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="shrink-0 px-6 pb-[max(1rem,env(safe-area-inset-bottom))]"
      >
        {/* provider circles */}
        <div className="flex justify-center gap-4">
          <CircleButton
            onClick={() => oauth("apple")}
            loading={loading === "apple"}
            disabled={!!loading && loading !== "apple"}
            label="Continue with Apple"
          >
            <AppleMark />
          </CircleButton>
          <CircleButton
            onClick={() => oauth("google")}
            loading={loading === "google"}
            disabled={!!loading && loading !== "google"}
            label="Continue with Google"
          >
            <GoogleMark />
          </CircleButton>
          <CircleButton
            onClick={() => oauth("linkedin")}
            loading={loading === "linkedin"}
            disabled={!!loading && loading !== "linkedin"}
            label="Continue with LinkedIn"
          >
            <LinkedInMark />
          </CircleButton>
        </div>

        {/* or */}
        <div className="my-4 flex items-center gap-3 text-[12px] text-gray-xlight">
          <span className="h-px flex-1 bg-gray-stroke" />
          or
          <span className="h-px flex-1 bg-gray-stroke" />
        </div>

        {/* email — black pill */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setEmailOpen(true)}
          disabled={!!loading}
          className="flex h-14 w-full items-center justify-center rounded-full bg-gray-dark text-[15px] font-medium text-white transition-colors hover:bg-[#333] disabled:opacity-60"
        >
          Continue with email
        </motion.button>

        <p className="mt-3 text-center text-[12px] text-gray-xlight">
          By continuing you agree to Leland's Terms & Privacy Policy.
        </p>
      </motion.div>

      <AnimatePresence>
        {emailOpen ? (
          <EmailSignup
            onBack={() => setEmailOpen(false)}
            onExit={onExit}
            onSuccess={onNext}
            reduced={reduced}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
