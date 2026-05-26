// Mocked "build" view used inside the V4 dual-pane player. Stands in for
// what viewers would normally see when the coach is sharing their full
// desktop — here, a Claude.ai-style chat with an in-flight code block.
//
// Pure markup (no live video). Inline SVG would scale by viewBox if we ever
// shrank the container, but in V4 the build tile lives in a fixed-ratio
// flex track on desktop, so plain HTML is good enough and stays readable.
export default function BuildScreen() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#FAFAF7] text-[12px] text-[#2D2C29]">
      {/* App chrome */}
      <div className="flex h-7 items-center gap-1.5 border-b border-[#E5E5E0] bg-white px-3">
        <span className="h-2 w-2 rounded-full bg-[#FF5F57]" />
        <span className="h-2 w-2 rounded-full bg-[#FEBC2E]" />
        <span className="h-2 w-2 rounded-full bg-[#28C840]" />
        <div className="ml-3 flex h-4 items-center rounded-md bg-[#F2F2EE] px-2 text-[10px] text-[#A5A5A0]">
          claude.ai/chat
        </div>
        <span className="ml-auto text-[10px] font-medium text-[#A5A5A0]">Sonnet 4.5</span>
      </div>

      {/* Conversation */}
      <div className="flex h-[calc(100%-1.75rem)] flex-col gap-2 overflow-hidden px-3 py-3">
        {/* User turn */}
        <div className="flex items-start gap-2">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2D2C29] text-[10px] font-semibold text-white">
            T
          </div>
          <div className="flex-1 leading-snug text-[#2D2C29]">
            Set up the tool router for our agent. We need search, calendar, and email — wire them
            so a single user message routes to the right one.
          </div>
        </div>

        {/* Claude turn */}
        <div className="flex items-start gap-2">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#CC7A5C] text-[10px] font-semibold text-white">
            C
          </div>
          <div className="flex-1 leading-snug text-[#2D2C29]">
            I'll start with a minimal Python skeleton — three tool stubs and one router that picks
            the right one based on the user's intent. Then we can layer in real implementations.
          </div>
        </div>

        {/* Code block — the bit you'd actually watch the coach work on */}
        <div className="ml-7 flex-1 overflow-hidden rounded-md bg-[#1C1C1A] px-3 py-2 font-mono text-[11px] leading-[1.55] text-[#E4E4DD]">
          <div className="flex items-center gap-1.5 pb-1.5 text-[9px] uppercase tracking-[0.1em] text-[#7A7A75]">
            <span>agent.py</span>
            <span className="ml-auto">python</span>
          </div>
          <div>
            <span className="text-[#C586C0]">from</span> anthropic{" "}
            <span className="text-[#C586C0]">import</span> Anthropic
          </div>
          <div>
            client <span className="text-[#C586C0]">=</span> Anthropic()
          </div>
          <div className="h-2" />
          <div className="text-[#7A7A75]"># tool router — keys are user intents</div>
          <div>
            TOOLS <span className="text-[#C586C0]">=</span> {"{"}
          </div>
          <div className="pl-4">
            <span className="text-[#CE9178]">"search"</span>: search_documents,
          </div>
          <div className="pl-4">
            <span className="text-[#CE9178]">"calendar"</span>: lookup_calendar,
          </div>
          <div className="pl-4">
            <span className="text-[#CE9178]">"email"</span>: draft_email,
          </div>
          <div>{"}"}</div>
          <div className="h-2" />
          <div>
            <span className="text-[#C586C0]">def</span>{" "}
            <span className="text-[#DCDCAA]">route</span>(intent: str, **kwargs):
          </div>
          <div className="pl-4">
            <span className="text-[#C586C0]">return</span> TOOLS[intent](**kwargs)
            <span className="ml-0.5 inline-block h-3 w-1.5 -translate-y-px translate-x-0.5 bg-[#E4E4DD] align-middle [animation:blink_1s_steps(2,end)_infinite]" />
          </div>
        </div>

        {/* Thinking indicator */}
        <div className="flex items-center gap-2 pt-1 text-[10px] text-[#A5A5A0]">
          <span className="flex h-1.5 w-1.5 rounded-full bg-[#CC7A5C] [animation:pulse_1.4s_ease-in-out_infinite]" />
          Claude is writing…
        </div>
      </div>

      {/* Keyframes — scoped via Tailwind arbitrary `@keyframes` isn't available,
          so use a tiny inline style block. Kept here for the prototype. */}
      <style>{`
        @keyframes blink { 50% { opacity: 0 } }
        @keyframes pulse { 0%,100% { opacity: 0.4 } 50% { opacity: 1 } }
      `}</style>
    </div>
  );
}
