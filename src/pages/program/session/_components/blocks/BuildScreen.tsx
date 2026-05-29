// Dark-mode Claude Code terminal mockup. Stands in for the coach's live
// screenshare during the build portion of the session. Pure markup, no real
// video — sized to fit the V4 main canvas (16:9 on desktop).
//
// Dark on dark on purpose so the surrounding page chrome (also white) doesn't
// clash with a bright app on top of the player.
export default function BuildScreen() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0E0E0D] font-mono text-[12px] text-[#D6D5CE]">
      {/* Window chrome */}
      <div className="flex h-7 shrink-0 items-center gap-1.5 border-b border-white/10 bg-[#1A1A18] px-3">
        <span className="h-2 w-2 rounded-full bg-[#FF5F57]" />
        <span className="h-2 w-2 rounded-full bg-[#FEBC2E]" />
        <span className="h-2 w-2 rounded-full bg-[#28C840]" />
        <span className="ml-3 text-[10px] text-[#7A7A75]">
          ~/projects/agent-team — claude code
        </span>
        <span className="ml-auto text-[10px] text-[#7A7A75]">v0.18.2 · sonnet-4.5</span>
      </div>

      {/* Body */}
      <div className="flex h-[calc(100%-1.75rem)] flex-col gap-2 overflow-hidden px-4 py-3 leading-[1.55]">
        {/* Prompt header */}
        <div className="text-[#7A7A75]">
          <span className="text-[#A5E446]">claude</span>
          <span className="text-[#7A7A75]">@build</span>{" "}
          <span className="text-[#7A7A75]">|</span> session 3
        </div>

        {/* User turn */}
        <div className="flex items-start gap-2">
          <span className="select-none text-[#A5E446]">{">"}</span>
          <span className="text-[#E4E4DD]">
            Wire the tool router so a single user message routes to search, calendar, or email.
            Keep stubs for the implementations.
          </span>
        </div>

        {/* Claude tool call */}
        <div className="ml-4 mt-1 text-[#7A7A75]">
          <span className="text-[#CC7A5C]">●</span>{" "}
          <span className="text-[#CC7A5C]">Edit</span>{" "}
          <span className="text-[#D6D5CE]">agent.py</span>
        </div>

        {/* Diff block */}
        <div className="ml-4 flex-1 overflow-hidden rounded-md border border-white/10 bg-[#15151310] bg-black/30 px-3 py-2">
          <div className="flex items-center gap-3 pb-1.5 text-[9px] uppercase tracking-[0.1em] text-[#7A7A75]">
            <span>agent.py</span>
            <span className="text-[#A5E446]">+18</span>
            <span className="text-[#E2574C]">-2</span>
            <span className="ml-auto">unified diff</span>
          </div>
          <div className="text-[#D6D5CE]">
            <div>
              <span className="text-[#C586C0]">from</span> anthropic{" "}
              <span className="text-[#C586C0]">import</span> Anthropic
            </div>
            <div>
              client <span className="text-[#C586C0]">=</span> Anthropic()
            </div>
            <div className="h-1.5" />
            <div className="bg-[#A5E446]/10">
              <span className="select-none pr-2 text-[#A5E446]">+</span>
              TOOLS <span className="text-[#C586C0]">=</span> {"{"}
            </div>
            <div className="bg-[#A5E446]/10">
              <span className="select-none pr-2 text-[#A5E446]">+</span>
              {"  "}
              <span className="text-[#CE9178]">"search"</span>: search_documents,
            </div>
            <div className="bg-[#A5E446]/10">
              <span className="select-none pr-2 text-[#A5E446]">+</span>
              {"  "}
              <span className="text-[#CE9178]">"calendar"</span>: lookup_calendar,
            </div>
            <div className="bg-[#A5E446]/10">
              <span className="select-none pr-2 text-[#A5E446]">+</span>
              {"  "}
              <span className="text-[#CE9178]">"email"</span>: draft_email,
            </div>
            <div className="bg-[#A5E446]/10">
              <span className="select-none pr-2 text-[#A5E446]">+</span>
              {"}"}
            </div>
            <div className="h-1.5" />
            <div className="bg-[#A5E446]/10">
              <span className="select-none pr-2 text-[#A5E446]">+</span>
              <span className="text-[#C586C0]">def</span>{" "}
              <span className="text-[#DCDCAA]">route</span>(intent: str, **kwargs):
            </div>
            <div className="bg-[#A5E446]/10">
              <span className="select-none pr-2 text-[#A5E446]">+</span>
              {"    "}
              <span className="text-[#C586C0]">return</span> TOOLS[intent](**kwargs)
              <span className="ml-0.5 inline-block h-3 w-1.5 -translate-y-px translate-x-0.5 bg-[#E4E4DD] align-middle [animation:bsblink_1s_steps(2,end)_infinite]" />
            </div>
          </div>
        </div>

        {/* Status line */}
        <div className="flex items-center gap-2 pt-1 text-[10px] text-[#7A7A75]">
          <span className="flex h-1.5 w-1.5 rounded-full bg-[#CC7A5C] [animation:bspulse_1.4s_ease-in-out_infinite]" />
          Editing agent.py · ⌥+enter to accept
        </div>
      </div>

      <style>{`
        @keyframes bsblink { 50% { opacity: 0 } }
        @keyframes bspulse { 0%,100% { opacity: 0.35 } 50% { opacity: 1 } }
      `}</style>
    </div>
  );
}
