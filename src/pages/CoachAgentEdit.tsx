import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { AGENTS, type AgentDef } from "../lib/agents";
import { AGENT_ASSETS } from "../lib/agentAssets";
import type { ProposedUpdate } from "../lib/agentEdit";

type Message = { role: "user" | "assistant"; content: string };

const FIELD_LABELS: Record<keyof Omit<ProposedUpdate, "summary">, string> = {
  scope: "Scope",
  playbook: "Playbook",
  handoffTriggers: "Handoff triggers",
  greeting: "Greeting",
  starters: "Starter prompts",
};

function ArrowLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function PaperclipIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function CurrentContextPanel({ agent }: { agent: AgentDef }) {
  return (
    <div className="flex flex-col gap-5 p-5 md:p-6">
      <div>
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9B9B9B]">Scope</h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-gray-dark">{agent.scope}</p>
      </div>
      <div>
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9B9B9B]">Playbook</h3>
        <ol className="mt-1.5 list-decimal pl-5 text-[13px] leading-relaxed text-gray-dark">
          {agent.playbook.map((p, i) => (
            <li key={i} className="mb-1">{p}</li>
          ))}
        </ol>
      </div>
      <div>
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9B9B9B]">Handoff triggers</h3>
        <ul className="mt-1.5 list-disc pl-5 text-[13px] leading-relaxed text-gray-dark">
          {agent.handoffTriggers.map((t, i) => (
            <li key={i} className="mb-1">{t}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9B9B9B]">Greeting</h3>
        <p className="mt-1.5 rounded-lg bg-[#F5F5F5] p-3 text-[13px] leading-relaxed text-gray-dark">{agent.greeting}</p>
      </div>
      <div>
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9B9B9B]">Starter prompts</h3>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {agent.starters.map((s, i) => (
            <span key={i} className="rounded-full border border-gray-stroke bg-white px-3 py-1.5 text-[11px] font-medium text-gray-dark">
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProposedUpdateCard({
  proposal,
  agent,
  saving,
  onSave,
  onDiscard,
}: {
  proposal: ProposedUpdate;
  agent: AgentDef;
  saving: boolean;
  onSave: () => void;
  onDiscard: () => void;
}) {
  const fields = (Object.keys(FIELD_LABELS) as Array<keyof typeof FIELD_LABELS>).filter(
    (k) => proposal[k] !== undefined,
  );
  return (
    <div className="rounded-2xl border border-[#3B7DFD]/30 bg-[#F4F8FF] p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#3B7DFD] text-white">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.5l1.9 5.4 5.4 1.9-5.4 1.9-1.9 5.4-1.9-5.4L4.7 9.8l5.4-1.9L12 2.5z" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-gray-dark">Proposed update</p>
          <p className="mt-0.5 text-[12px] text-gray-dark">{proposal.summary}</p>
        </div>
      </div>

      {fields.length === 0 ? (
        <p className="mt-3 text-[11px] italic text-[#707070]">(No field changes — clarification only.)</p>
      ) : (
        <div className="mt-3 flex flex-col gap-3">
          {fields.map((key) => (
            <FieldDiff key={key} fieldKey={key} agent={agent} proposal={proposal} />
          ))}
        </div>
      )}

      {fields.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" variant="primary" onClick={onSave} disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
          <Button size="sm" variant="secondary" onClick={onDiscard} disabled={saving}>
            Discard
          </Button>
        </div>
      )}
    </div>
  );
}

function FieldDiff({
  fieldKey,
  agent,
  proposal,
}: {
  fieldKey: keyof typeof FIELD_LABELS;
  agent: AgentDef;
  proposal: ProposedUpdate;
}) {
  const before = agent[fieldKey];
  const after = proposal[fieldKey]!;

  const renderValue = (v: string | string[]) =>
    Array.isArray(v) ? (
      <ul className="list-disc pl-4">
        {v.map((item, i) => (
          <li key={i} className="mb-0.5">{item}</li>
        ))}
      </ul>
    ) : (
      <p>{v}</p>
    );

  return (
    <div className="rounded-lg border border-gray-stroke bg-white p-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#3B7DFD]">{FIELD_LABELS[fieldKey]}</p>
      <div className="mt-2 grid gap-2 md:grid-cols-2">
        <div>
          <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-[#9B9B9B]">Before</p>
          <div className="text-[11px] leading-relaxed text-[#707070]">{renderValue(before)}</div>
        </div>
        <div>
          <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-[#038561]">After</p>
          <div className="text-[11px] leading-relaxed text-gray-dark">{renderValue(after)}</div>
        </div>
      </div>
    </div>
  );
}

export default function CoachAgentEdit() {
  const { agentSlug } = useParams<{ agentSlug: string }>();
  const fallback = agentSlug ? AGENTS[agentSlug] : undefined;
  const assets = agentSlug ? AGENT_ASSETS[agentSlug] : undefined;

  const [agent, setAgent] = useState<AgentDef | undefined>(fallback);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingProposal, setPendingProposal] = useState<ProposedUpdate | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // On mount, fetch the store-resolved agent so any saved overrides surface.
  useEffect(() => {
    if (!agentSlug) return;
    let cancelled = false;
    fetch(`/api/agent?slug=${encodeURIComponent(agentSlug)}`)
      .then(async (res) => {
        if (!res.ok) return;
        const data = (await res.json()) as { agent: AgentDef };
        if (!cancelled && data.agent) setAgent(data.agent);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [agentSlug]);

  useEffect(() => {
    document.title = agent ? `Edit | ${agent.agentName}` : "Edit agent";
  }, [agent]);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking, pendingProposal]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
  }, [input]);

  if (!agent || !assets) {
    return (
      <div className="mx-auto max-w-[600px] px-4 py-16 text-center">
        <p className="text-[16px] font-medium text-gray-dark">Agent not found</p>
        <Link
          to="/coach-profile"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#222222]/5 px-4 py-2.5 text-[14px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/[0.08]"
        >
          Back to coach profile
        </Link>
      </div>
    );
  }

  const sendMessage = async (raw: string) => {
    const text = raw.trim();
    if (!text || thinking) return;

    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setThinking(true);
    setError(null);
    setPendingProposal(null);

    try {
      const res = await fetch("/api/agent-edit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ agentSlug: agent.slug, messages: next }),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(errBody.error || `HTTP ${res.status}`);
      }
      const data = (await res.json()) as { text: string; proposedUpdate: ProposedUpdate | null };
      setMessages((prev) => [...prev, { role: "assistant", content: data.text || "(thinking…)" }]);
      if (data.proposedUpdate) {
        setPendingProposal(data.proposedUpdate);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      setMessages(messages);
      setInput(text);
    } finally {
      setThinking(false);
    }
  };

  const handleFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".md") && !file.type.startsWith("text/")) {
      setError("Only text or markdown files are supported.");
      return;
    }
    if (file.size > 200_000) {
      setError("File too large (max ~200KB).");
      return;
    }
    const text = await file.text();
    const note = `[Attached file: ${file.name}]\n\n${text}`;
    setInput((prev) => (prev ? `${prev}\n\n${note}` : note));
  };

  const saveProposal = async () => {
    if (!pendingProposal) return;
    setSaving(true);
    setError(null);
    try {
      const updates = {
        scope: pendingProposal.scope,
        playbook: pendingProposal.playbook,
        handoffTriggers: pendingProposal.handoffTriggers,
        greeting: pendingProposal.greeting,
        starters: pendingProposal.starters,
      };
      const res = await fetch("/api/agent-save", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ agentSlug: agent.slug, updates }),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(errBody.error || `HTTP ${res.status}`);
      }
      const data = (await res.json()) as { agent: AgentDef };
      setAgent(data.agent);
      setPendingProposal(null);
      setSavedAt(Date.now());
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Saved. The agent will use the updated context on its next turn." },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-56px)] flex-col bg-white md:h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-stroke px-4 py-3 md:px-6">
        <Link
          to={agent.coachProfileHref}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-dark transition-colors hover:bg-gray-hover"
          aria-label="Back"
        >
          <ArrowLeftIcon />
        </Link>
        <img src={assets.coachAvatar} alt={agent.coachName} className="h-9 w-9 shrink-0 rounded-full object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold text-gray-dark">Edit · {agent.agentName}</p>
          <p className="truncate text-[11px] text-[#707070]">
            Updates are saved to the live agent. Currently editing as {agent.coachName}.
          </p>
        </div>
        <Link
          to={`/agent/${agent.slug}`}
          className="hidden shrink-0 cursor-pointer rounded-lg bg-[#222222]/5 px-4 py-2.5 text-[12px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/[0.08] md:inline-flex md:items-center"
        >
          Preview chat
        </Link>
      </div>

      {error && (
        <div className="border-b border-[#F5C6CB] bg-[#FDECEA] px-4 py-2 text-[12px] text-[#9F2F2F] md:px-6">
          {error}
          <button onClick={() => setError(null)} className="ml-3 cursor-pointer text-[11px] font-medium underline">
            Dismiss
          </button>
        </div>
      )}
      {savedAt && Date.now() - savedAt < 3000 && (
        <div className="border-b border-[#A7E3CB] bg-[#E8F8F0] px-4 py-2 text-[12px] text-[#0F6E4D] md:px-6">
          Saved.
        </div>
      )}

      {/* Body: split panel */}
      <div className="flex flex-1 min-h-0 flex-col md:flex-row">
        {/* Current context panel */}
        <div className="flex-1 min-h-0 overflow-y-auto border-b border-gray-stroke md:border-b-0 md:border-r">
          <div className="px-5 pt-5 md:px-6 md:pt-6">
            <h2 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#9B9B9B]">Current context</h2>
          </div>
          <CurrentContextPanel agent={agent} />
        </div>

        {/* Editor chat panel */}
        <div className="flex flex-1 min-h-0 flex-col">
          <div ref={threadRef} className="flex-1 overflow-y-auto px-4 py-5 md:px-6">
            <div className="mx-auto flex max-w-[680px] flex-col gap-4">
              {messages.length === 0 && !thinking && (
                <div className="rounded-2xl border border-dashed border-gray-stroke bg-[#FAFAFA] p-4 text-[12px] leading-relaxed text-[#707070]">
                  <p className="text-gray-dark"><span className="font-semibold">Edit your agent.</span> Tell me what to change about how this agent coaches.</p>
                  <p className="mt-2">You can:</p>
                  <ul className="mt-1 list-disc pl-5">
                    <li>Paste a doc you've written, or upload a markdown file.</li>
                    <li>Describe a specific framework you want it to use.</li>
                    <li>Tell me when it should hand off to you instead of trying to coach.</li>
                  </ul>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex"}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-[13px] leading-snug whitespace-pre-wrap ${
                      m.role === "user"
                        ? "rounded-tr-sm bg-[#222222] text-white"
                        : "rounded-tl-sm bg-[#F5F5F5] text-gray-dark"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {thinking && (
                <div className="flex">
                  <div className="rounded-2xl rounded-tl-sm bg-[#F5F5F5] px-4 py-3">
                    <span className="inline-flex gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#9B9B9B] [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#9B9B9B] [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#9B9B9B]" />
                    </span>
                  </div>
                </div>
              )}

              {pendingProposal && (
                <ProposedUpdateCard
                  proposal={pendingProposal}
                  agent={agent}
                  saving={saving}
                  onSave={saveProposal}
                  onDiscard={() => setPendingProposal(null)}
                />
              )}
            </div>
          </div>

          {/* Composer */}
          <div className="border-t border-gray-stroke bg-white px-4 py-3 md:px-6 md:py-4">
            <div className="mx-auto max-w-[680px]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
                className="flex items-end gap-2 rounded-2xl border border-gray-stroke bg-white px-3 py-2 focus-within:border-[#222222]"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".md,.markdown,.txt,text/markdown,text/plain"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                    e.target.value = "";
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={thinking}
                  className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-dark transition-colors hover:bg-gray-hover disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Attach markdown file"
                >
                  <PaperclipIcon />
                </button>
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && !e.metaKey) {
                      e.preventDefault();
                      sendMessage(input);
                    }
                  }}
                  placeholder="Tell the editor what to change…"
                  className="max-h-[200px] flex-1 resize-none bg-transparent py-1.5 text-[13px] leading-snug text-gray-dark placeholder:text-[#9B9B9B] focus:outline-none"
                  disabled={thinking}
                />
                <Button type="submit" size="sm" variant="primary" disabled={!input.trim() || thinking} className="!px-3" aria-label="Send">
                  <SendIcon />
                </Button>
              </form>
              <p className="mt-2 text-center text-[10px] text-[#9B9B9B]">
                Attach a .md or .txt file to seed the agent's context, or describe changes in chat.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
