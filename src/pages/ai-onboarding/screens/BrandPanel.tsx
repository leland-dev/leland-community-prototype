/* Split layout for the entry moments (welcome, invite auth): onboarding
 * content on the left, AI Builder brand panel on the right. The left column
 * matches the Shell (logo top-left, same column width) so the hand-off into
 * the questions is seamless. On mobile the brand panel becomes a short banner. */
import type { ReactNode } from "react";
import { Star } from "lucide-react";
import { AI_GRADIENT_VIDEO, type Peer } from "../data";
import { ORG_LOGOS } from "../../onboarding/data";
import { BrandLockup, LelandLogo } from "../ui";

export function SplitLayout({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-white text-ink-primary md:grid md:grid-cols-2">
      {/* brand panel: top banner on mobile, right column on desktop.
          min-w-0 stops wide content (marquees, long lines) from growing the column. */}
      <div className="order-first h-[200px] min-w-0 shrink-0 md:order-last md:h-auto">{right}</div>
      {/* No logo or avatar on the left: the brand panel carries the Leland |
          AI BuilderProgram lockup, and this is a welcome moment, not the app. */}
      <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex min-h-full w-full max-w-[560px] flex-col justify-center px-5 py-10 md:px-10 md:py-16">{left}</div>
      </main>
    </div>
  );
}

export function BrandQuotes({ quotes }: { quotes: Peer[] }) {
  return (
    <div className="hidden space-y-3 md:block">
      {quotes.map((q) => (
        <div key={q.name} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm">
          <div className="flex gap-0.5 text-yellow">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} fill="currentColor" />)}</div>
          <p className="mt-2 text-[15px] leading-[1.45] text-white/90">"{q.quote}"</p>
          <div className="mt-2.5 flex items-baseline gap-2 text-[13px]">
            <span className="font-medium text-white">{q.name}</span>
            <span className="text-white/50">{q.title}, {q.company}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function BrandPanel({ children, logos = false }: { children: ReactNode; logos?: boolean }) {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-black text-white">
      <video className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-70" src={AI_GRADIENT_VIDEO} autoPlay muted loop playsInline />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.7)_75%,#000_100%)]" />
      <div className="relative z-10 flex flex-1 flex-col px-5 pb-6 md:px-10 md:pb-10 lg:px-12 lg:pb-12">
        <div className="flex h-16 shrink-0 items-center gap-3">
          <LelandLogo theme="dark" />
          <span className="h-5 w-px bg-white/30" />
          <BrandLockup />
        </div>
        <div className="flex flex-1 flex-col justify-center">{children}</div>
        {logos ? (
          <div className="hidden md:block">
            <div className="mb-3 text-[12px] font-medium uppercase tracking-[0.14em] text-white/40">Trusted by builders at</div>
            <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
              <div className="flex w-max items-center gap-10" style={{ animation: "leland-marquee 45s linear infinite" }}>
                {[...ORG_LOGOS, ...ORG_LOGOS].map((l, i) => (
                  <img key={`${l.name}-${i}`} src={l.src} alt={l.name} style={{ height: Math.round(l.height * 0.85) }} className="w-auto shrink-0 opacity-60 brightness-0 invert" />
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
