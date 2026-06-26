// "Twitch for vibe coders" demo canvas. Two stitched-together panes:
//   LEFT 1/3 → Claude Code terminal (coach is driving)
//   RIGHT 2/3 → Live preview of the website being built — intentionally
//               half-finished so you read it as "under construction"
//
// The terminal "edits" index.html and the preview shows the result of
// those edits, telling a coherent live-coding story.

export default function VibeCodingScreen() {
  return (
    <div className="relative flex h-full w-full bg-black">
      {/* ── LEFT: Claude Code terminal (1/3) ── */}
      <div className="flex h-full w-[33%] flex-col bg-[#0E0E0D] font-mono text-[10px] leading-[1.55] text-[#D6D5CE] lg:text-[10px]">
        {/* Window chrome */}
        <div className="flex h-6 shrink-0 items-center gap-1 border-b border-white/10 bg-[#1A1A18] px-2 lg:h-7">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FF5F57]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#FEBC2E]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#28C840]" />
          <span className="ml-2 truncate text-[9px] text-[#7A7A75] lg:text-[10px]">
            claude code · index.html
          </span>
        </div>

        {/* Body */}
        <div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-hidden px-2.5 py-2 lg:px-3 lg:py-2.5">
          <div className="text-[#7A7A75]">
            <span className="text-[#A5E446]">claude</span>
            <span className="text-[#7A7A75]">@vibe</span> ~/site
          </div>

          <div className="flex items-start gap-1.5">
            <span className="select-none text-[#A5E446]">{">"}</span>
            <span className="text-[#E4E4DD]">
              add a hero with "The world's coders, live" and a primary CTA
            </span>
          </div>

          <div className="text-[#7A7A75]">
            <span className="text-[#CC7A5C]">●</span>{" "}
            <span className="text-[#CC7A5C]">Edit</span> index.html
          </div>

          {/* Diff block — compact */}
          <div className="flex-1 overflow-hidden rounded border border-white/10 bg-black/40 px-2 py-1.5">
            <div className="flex items-center justify-between pb-1 text-[8px] uppercase tracking-[0.1em] text-[#7A7A75] lg:text-[9px]">
              <span>index.html</span>
              <span>
                <span className="text-[#A5E446]">+14</span>{" "}
                <span className="text-[#E2574C]">-1</span>
              </span>
            </div>
            <div className="bg-[#A5E446]/10">
              <span className="select-none pr-1 text-[#A5E446]">+</span>
              <span className="text-[#569CD6]">&lt;section</span>{" "}
              <span className="text-[#9CDCFE]">class</span>=
              <span className="text-[#CE9178]">"hero"</span>
              <span className="text-[#569CD6]">&gt;</span>
            </div>
            <div className="bg-[#A5E446]/10">
              <span className="select-none pr-1 text-[#A5E446]">+</span>
              {"  "}
              <span className="text-[#569CD6]">&lt;h1&gt;</span>
              The world's coders, live
              <span className="text-[#569CD6]">&lt;/h1&gt;</span>
            </div>
            <div className="bg-[#A5E446]/10">
              <span className="select-none pr-1 text-[#A5E446]">+</span>
              {"  "}
              <span className="text-[#569CD6]">&lt;a</span>{" "}
              <span className="text-[#9CDCFE]">href</span>=
              <span className="text-[#CE9178]">"/live"</span>
              <span className="text-[#569CD6]">&gt;</span>Watch builds →
            </div>
            <div className="bg-[#A5E446]/10">
              <span className="select-none pr-1 text-[#A5E446]">+</span>
              <span className="text-[#569CD6]">&lt;/section&gt;</span>
              <span className="ml-0.5 inline-block h-2.5 w-1 -translate-y-px translate-x-0.5 bg-[#E4E4DD] align-middle [animation:vcblink_1s_steps(2,end)_infinite]" />
            </div>
          </div>

          <div className="flex items-center gap-1.5 pt-0.5 text-[9px] text-[#7A7A75] lg:text-[10px]">
            <span className="h-1 w-1 rounded-full bg-[#CC7A5C] [animation:vcpulse_1.4s_ease-in-out_infinite]" />
            Editing index.html
          </div>
        </div>
      </div>

      {/* ── RIGHT: Live preview of the website (2/3) ── */}
      <div className="relative flex h-full w-[67%] flex-col bg-[#F7F7F2] text-gray-dark">
        {/* Fake browser chrome */}
        <div className="flex h-6 shrink-0 items-center gap-2 border-b border-black/10 bg-[#E9E9E2] px-3 lg:h-7">
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF5F57]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#FEBC2E]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#28C840]" />
          </div>
          <div className="ml-2 flex h-4 flex-1 items-center rounded-md bg-white px-2 text-[10px] text-[#7A7A75]">
            vibe.live
          </div>
          <span className="text-[9px] uppercase tracking-[0.12em] text-[#A5A5A0]">live preview</span>
        </div>

        {/* Site header */}
        <div className="flex shrink-0 items-center justify-between px-6 py-3 lg:px-8 lg:py-4">
          <div className="flex items-center gap-1 text-[14px] font-bold tracking-tight text-gray-dark lg:text-[16px]">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#A5E446] text-[10px] text-black lg:h-6 lg:w-6 lg:text-[10px]">
              v
            </span>
            vibe.live
          </div>
          <nav className="hidden items-center gap-4 text-[10px] font-medium text-[#5C5C57] sm:flex lg:gap-5 lg:text-[10px]">
            <span>Browse</span>
            <span>Streams</span>
            <span>Programs</span>
            <span>Pricing</span>
          </nav>
          <div className="flex items-center gap-2">
            <button type="button" className="text-[10px] font-medium text-[#5C5C57] lg:text-[10px]">
              Sign in
            </button>
            <button
              type="button"
              className="rounded-md bg-gray-dark px-2.5 py-1 text-[10px] font-semibold text-white lg:px-3 lg:py-1.5 lg:text-[10px]"
            >
              Get started
            </button>
          </div>
        </div>

        {/* Hero */}
        <div className="flex flex-1 flex-col items-start gap-3 px-6 pb-4 pt-2 lg:px-8 lg:pb-6">
          <span className="rounded-full bg-[#A5E446]/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#3a6500] lg:text-[10px]">
            Now live · 47 watching
          </span>
          <h1 className="max-w-[80%] text-[20px] font-semibold leading-[1.05] tracking-tight text-gray-dark sm:text-[26px] lg:text-[38px]">
            The world's coders,
            <br />
            live
            <span className="ml-1 inline-block h-[0.8em] w-[6px] -translate-y-[0.05em] bg-gray-dark align-middle [animation:vcblink_1s_steps(2,end)_infinite]" />
          </h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-full bg-gray-dark px-3.5 py-2 text-[10px] font-semibold text-white lg:px-4 lg:py-2.5 lg:text-[11px]"
            >
              Watch builds →
            </button>
            <button
              type="button"
              className="rounded-full bg-transparent px-3.5 py-2 text-[10px] font-semibold text-gray-dark ring-1 ring-gray-stroke lg:px-4 lg:py-2.5 lg:text-[11px]"
            >
              Start streaming
            </button>
          </div>

          {/* Skeleton grid of "creator tiles" — half real, half skeleton so
              it reads as work-in-progress. */}
          <div className="mt-2 grid w-full grid-cols-3 gap-2 lg:mt-4 lg:gap-3">
            {[
              { title: "Building a CRM in Claude Code", who: "tanner", filled: true },
              { title: "Live shaders w/ p5.js", who: "anya", filled: true },
              { filled: false },
            ].map((t, i) => (
              <div
                key={i}
                className={`overflow-hidden rounded-md border border-black/10 bg-white ${
                  !t.filled ? "border-dashed" : ""
                }`}
              >
                <div
                  className={`relative h-12 w-full lg:h-16 ${
                    t.filled
                      ? i === 0
                        ? "bg-gradient-to-br from-[#1C1C1A] to-[#3a3a35]"
                        : "bg-gradient-to-br from-[#A5E446] to-[#7CBF1A]"
                      : "bg-[repeating-linear-gradient(45deg,#E5E5E0,#E5E5E0_4px,#F2F2EE_4px,#F2F2EE_8px)]"
                  }`}
                >
                  {t.filled && (
                    <span className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-full bg-black/70 px-1.5 py-[1px] text-[8px] font-semibold uppercase text-white lg:text-[9px]">
                      <span className="h-1 w-1 rounded-full bg-[#E2574C]" />
                      Live
                    </span>
                  )}
                </div>
                <div className="px-2 py-1.5 lg:px-2.5 lg:py-2">
                  {t.filled ? (
                    <>
                      <div className="truncate text-[10px] font-semibold text-gray-dark lg:text-[10px]">
                        {t.title}
                      </div>
                      <div className="truncate text-[9px] text-[#7A7A75] lg:text-[10px]">
                        @{t.who}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="h-2 w-3/4 rounded bg-[#E5E5E0]" />
                      <div className="mt-1 h-2 w-1/2 rounded bg-[#E5E5E0]" />
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @keyframes vcblink { 50% { opacity: 0 } }
        @keyframes vcpulse { 0%,100% { opacity: 0.35 } 50% { opacity: 1 } }
      `}</style>
    </div>
  );
}
