import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { AGENTS, type AgentDef } from "../lib/agents";
import { AGENT_ASSETS } from "../lib/agentAssets";

type Attachment = { name: string; mediaType: string; data: string };
type Message = { role: "user" | "assistant"; content: string; attachments?: Attachment[] };

const MAX_PDF_BYTES = 10 * 1024 * 1024;
const MAX_TEXT_BYTES = 200_000;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1] || "";
      resolve(base64);
    };
    reader.onerror = () => reject(reader.error || new Error("File read failed"));
    reader.readAsDataURL(file);
  });
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2.5l1.9 5.4 5.4 1.9-5.4 1.9-1.9 5.4-1.9-5.4L4.7 9.8l5.4-1.9L12 2.5z"
        fill="currentColor"
      />
      <path d="M19 14.5l.95 2.55L22.5 18l-2.55.95L19 21.5l-.95-2.55L15.5 18l2.55-.95L19 14.5z" fill="currentColor" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
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

function PaperclipIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function CoachAgent() {
  const { agentSlug } = useParams<{ agentSlug: string }>();
  const fallback = agentSlug ? AGENTS[agentSlug] : undefined;
  const assets = agentSlug ? AGENT_ASSETS[agentSlug] : undefined;
  const [agent, setAgent] = useState<AgentDef | undefined>(fallback);

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
    document.title = agent ? `Leland Prototype | ${agent.agentName}` : "Leland Prototype | Agent";
  }, [agent]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>([]);
  const threadRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const userTurnCount = useMemo(
    () => messages.filter((m) => m.role === "user").length,
    [messages],
  );
  const showHandoff = userTurnCount >= 3 && !streaming;

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streamingText, streaming]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 180)}px`;
  }, [input]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  if (!agent || !assets) {
    return (
      <div className="mx-auto max-w-[600px] px-4 py-16 text-center">
        <p className="text-[18px] font-medium text-gray-dark">Agent not found</p>
        <p className="mt-2 text-[16px] text-[#707070]">We couldn't find an agent with that link.</p>
        <Link
          to="/coach-profile"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#222222]/5 px-4 py-2.5 text-[16px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/[0.08]"
        >
          Back to coach profile
        </Link>
      </div>
    );
  }

  const handleFile = async (file: File) => {
    setErrorBanner(null);
    const lower = file.name.toLowerCase();
    const isPdf = file.type === "application/pdf" || lower.endsWith(".pdf");
    const isText = file.type.startsWith("text/") || lower.endsWith(".md") || lower.endsWith(".markdown") || lower.endsWith(".txt");

    if (isPdf) {
      if (file.size > MAX_PDF_BYTES) {
        setErrorBanner("PDF too large (max 10MB).");
        return;
      }
      try {
        const data = await fileToBase64(file);
        setPendingAttachments((prev) => [...prev, { name: file.name, mediaType: "application/pdf", data }]);
        if (!input.trim()) {
          setInput(`Here's ${file.name} — please review.`);
        }
      } catch {
        setErrorBanner("Could not read that file.");
      }
      return;
    }

    if (isText) {
      if (file.size > MAX_TEXT_BYTES) {
        setErrorBanner("Text file too large (max ~200KB).");
        return;
      }
      const text = await file.text();
      const note = `[Attached file: ${file.name}]\n\n${text}`;
      setInput((prev) => (prev ? `${prev}\n\n${note}` : note));
      return;
    }

    setErrorBanner("Unsupported file type. Use .pdf, .md, or .txt.");
  };

  const removeAttachment = (idx: number) => {
    setPendingAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  const sendMessage = async (raw: string) => {
    const text = raw.trim();
    if ((!text && pendingAttachments.length === 0) || streaming) return;

    const userMessage: Message = {
      role: "user",
      content: text || "(attached file)",
      attachments: pendingAttachments.length > 0 ? pendingAttachments : undefined,
    };
    const nextMessages: Message[] = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setPendingAttachments([]);
    setStreaming(true);
    setStreamingText("");
    setErrorBanner(null);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/agent-chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ agentSlug: agent.slug, messages: nextMessages }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(errBody.error || `HTTP ${res.status}`);
      }
      if (!res.body) {
        throw new Error("Empty response body");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setStreamingText(accumulated);
      }
      accumulated += decoder.decode();

      setMessages((prev) => [...prev, { role: "assistant", content: accumulated }]);
      setStreamingText("");
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        // User navigated away or canceled — silently drop
      } else {
        const message = err instanceof Error ? err.message : "Something went wrong";
        setErrorBanner(message);
        // Roll back the user message so they can retry
        setMessages(messages);
        setInput(text);
      }
      setStreamingText("");
    } finally {
      setStreaming(false);
      abortRef.current = null;
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
        <div className="relative shrink-0">
          <img src={assets.coachAvatar} alt={agent.coachName} className="h-10 w-10 rounded-full object-cover" />
          <span className="absolute -bottom-0.5 -right-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#3B7DFD] text-white ring-2 ring-white">
            <SparkleIcon className="h-[10px] w-[10px]" />
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[16px] font-semibold text-gray-dark">{agent.agentName}</p>
          <p className="truncate text-[14px] text-[#707070]">
            AI agent · curated by{" "}
            <Link to={agent.coachProfileHref} className="underline decoration-[0.5px] underline-offset-2 hover:text-gray-dark">
              {agent.coachName}
            </Link>
          </p>
        </div>
        <Link
          to={agent.coachProfileHref}
          className="hidden shrink-0 cursor-pointer rounded-lg bg-[#222222]/5 px-4 py-2.5 text-[14px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/[0.08] md:inline-flex md:items-center"
        >
          Book 1:1 with {agent.coachName.split(" ")[0]}
        </Link>
      </div>

      {/* Error banner */}
      {errorBanner && (
        <div className="border-b border-[#F5C6CB] bg-[#FDECEA] px-4 py-2 text-[14px] text-[#9F2F2F] md:px-6">
          {errorBanner}
          <button
            onClick={() => setErrorBanner(null)}
            className="ml-3 cursor-pointer text-[13px] font-medium underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Thread */}
      <div ref={threadRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-[760px] flex-col gap-5 px-4 py-6 md:px-6 md:py-8">
          {/* Greeting */}
          <div className="flex gap-3">
            <div className="relative shrink-0">
              <img src={assets.categoryImage} alt="" className="h-9 w-9 rounded-[6px] object-cover" />
              <span className="absolute -bottom-1 -right-1 flex h-[16px] w-[16px] items-center justify-center rounded-full bg-[#3B7DFD] text-white ring-2 ring-white">
                <SparkleIcon className="h-[9px] w-[9px]" />
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-medium text-gray-dark">{agent.agentName}</p>
              <div className="mt-1.5 rounded-2xl rounded-tl-sm bg-[#F5F5F5] px-4 py-3 text-[16px] leading-snug text-gray-dark whitespace-pre-wrap">
                {agent.greeting}
              </div>
            </div>
          </div>

          {/* Starter chips (only when no user input yet) */}
          {messages.length === 0 && !streaming && (
            <div className="ml-12 flex flex-wrap gap-2">
              {agent.starters.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="cursor-pointer rounded-full border border-gray-stroke bg-white px-3.5 py-2 text-[14px] font-medium text-gray-dark transition-colors hover:bg-gray-hover"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Messages */}
          {messages.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="flex justify-end">
                <div className="flex max-w-[80%] flex-col items-end gap-1.5">
                  {m.attachments && m.attachments.length > 0 && (
                    <div className="flex flex-wrap justify-end gap-1.5">
                      {m.attachments.map((a, j) => (
                        <span key={j} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-stroke bg-white px-2.5 py-1.5 text-[12px] font-medium text-gray-dark">
                          <FileIcon />
                          <span className="max-w-[160px] truncate">{a.name}</span>
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="rounded-2xl rounded-tr-sm bg-[#222222] px-4 py-3 text-[16px] leading-snug text-white whitespace-pre-wrap">
                    {m.content}
                  </div>
                </div>
              </div>
            ) : (
              <div key={i} className="flex gap-3">
                <div className="relative shrink-0">
                  <img src={assets.categoryImage} alt="" className="h-9 w-9 rounded-[6px] object-cover" />
                  <span className="absolute -bottom-1 -right-1 flex h-[16px] w-[16px] items-center justify-center rounded-full bg-[#3B7DFD] text-white ring-2 ring-white">
                    <SparkleIcon className="h-[9px] w-[9px]" />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="rounded-2xl rounded-tl-sm bg-[#F5F5F5] px-4 py-3 text-[16px] leading-snug text-gray-dark whitespace-pre-wrap">
                    {m.content}
                  </div>
                </div>
              </div>
            ),
          )}

          {/* Streaming partial assistant message */}
          {streaming && (
            <div className="flex gap-3">
              <div className="relative shrink-0">
                <img src={assets.categoryImage} alt="" className="h-9 w-9 rounded-[6px] object-cover" />
                <span className="absolute -bottom-1 -right-1 flex h-[16px] w-[16px] items-center justify-center rounded-full bg-[#3B7DFD] text-white ring-2 ring-white">
                  <SparkleIcon className="h-[9px] w-[9px]" />
                </span>
              </div>
              <div className="min-w-0 flex-1">
                {streamingText ? (
                  <div className="rounded-2xl rounded-tl-sm bg-[#F5F5F5] px-4 py-3 text-[16px] leading-snug text-gray-dark whitespace-pre-wrap">
                    {streamingText}
                    <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-[#9B9B9B] align-text-bottom" />
                  </div>
                ) : (
                  <div className="rounded-2xl rounded-tl-sm bg-[#F5F5F5] px-4 py-3">
                    <span className="inline-flex gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#9B9B9B] [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#9B9B9B] [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#9B9B9B]" />
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Handoff suggestion */}
          {showHandoff && (
            <div className="rounded-2xl border border-[#E5E5E5] bg-[#FAFAFA] p-4">
              <div className="flex items-start gap-3">
                <img src={assets.coachAvatar} alt={agent.coachName} className="h-10 w-10 shrink-0 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-medium text-gray-dark">Want to take this further with {agent.coachName.split(" ")[0]}?</p>
                  <p className="mt-1 text-[14px] text-[#707070]">
                    I can take you most of the way, but the judgment calls — your specific story, your specific tradeoffs — are where {agent.coachName.split(" ")[0]} really shines. A 1:1 might be the right next step.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      to={agent.coachProfileHref}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#038561] px-4 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-[#038561]/90"
                    >
                      Book 1:1 with {agent.coachName.split(" ")[0]}
                    </Link>
                    <Link
                      to={agent.coachProfileHref}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#222222]/5 px-4 py-2.5 text-[14px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/[0.08]"
                    >
                      See all offerings
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Composer */}
      <div className="border-t border-gray-stroke bg-white px-4 py-3 md:px-6 md:py-4">
        <div className="mx-auto max-w-[760px]">
          {/* Pending attachment chips */}
          {pendingAttachments.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {pendingAttachments.map((a, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-stroke bg-[#F5F5F5] py-1.5 pl-2.5 pr-1.5 text-[13px] font-medium text-gray-dark">
                  <FileIcon />
                  <span className="max-w-[200px] truncate">{a.name}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(idx)}
                    className="ml-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-[#707070] transition-colors hover:bg-gray-hover"
                    aria-label={`Remove ${a.name}`}
                  >
                    <XIcon />
                  </button>
                </span>
              ))}
            </div>
          )}
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
              accept=".pdf,application/pdf,.md,.markdown,.txt,text/markdown,text/plain"
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
              disabled={streaming}
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-dark transition-colors hover:bg-gray-hover disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Attach file"
            >
              <PaperclipIcon />
            </button>
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder={`Message ${agent.coachName.split(" ")[0]}'s agent…`}
              className="max-h-[180px] flex-1 resize-none bg-transparent py-1.5 text-[16px] leading-snug text-gray-dark placeholder:text-[#9B9B9B] focus:outline-none"
              disabled={streaming}
            />
            <Button
              type="submit"
              size="sm"
              variant="primary"
              disabled={(!input.trim() && pendingAttachments.length === 0) || streaming}
              className="!px-3"
              aria-label="Send"
            >
              <SendIcon />
            </Button>
          </form>
          <p className="mt-2 text-center text-[12px] text-[#9B9B9B]">
            Attach an essay (.md / .txt) or a PDF (deck, document) for review. Curated by {agent.coachName}.
          </p>
        </div>
      </div>
    </div>
  );
}
