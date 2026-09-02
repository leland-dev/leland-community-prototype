import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { CaptionClip, LiveReplayCard } from "./Home";
import type { Post, ImageEntry } from "./Home";
import profilePhoto from "../assets/profile photos/profile photo.png";
import articlePhoto from "../assets/photography/talking.jpeg";
import { useFeedDemo } from "../contexts/FeedDemoContext";
import ComposerMediaButton from "../components/ComposerMediaButton";
import composerImageIcon from "../assets/icons/image.svg";
import composerCameraIcon from "../assets/icons/camera.svg";
import composerVideoIcon from "../assets/icons/video-icon.svg";
import composerPollIcon from "../assets/icons/bar-chart.svg";

// ─── Composer — Substack architecture, Leland skin ────────────────────
// Default surface is a quick post (text, images, poll). Long-form and live are
// full-screen takeovers entered from cards at the bottom of the quick
// composer, each with an "Exit … mode" pill to return. Scheduling lives in the
// header ⋯ menu and opens a calendar sheet; drafts and scheduled posts live in
// a tabbed sheet behind the Drafts pill. Both stores are session-scoped module
// arrays, same pattern as the comment store.

type ComposerMode = "post" | "article" | "live" | "golive";

// Everything the livestream editor can mutate — one snapshot per gesture for Undo.
type EditorSnap = {
  clipStart: number;
  clipEnd: number;
  viewStart: number;
  viewEnd: number;
  cropAspect: "Original" | "16:9" | "1:1" | "4:5" | "9:16";
  cropX: number;
  cropY: number;
  captionsOn: boolean;
  chatOn: boolean;
};

interface DraftEntry {
  id: number;
  mode: ComposerMode;
  text: string;
  title: string;
  subtitle: string;
  topic: string;
  poll: string[] | null;
  articleHtml: string;
  editedAt: number;
}

interface ScheduledEntry {
  id: number;
  mode: ComposerMode;
  snippet: string;
  scheduledFor: string;
  editedAt: number;
  text: string;
  title: string;
  subtitle: string;
  topic: string;
  poll: string[] | null;
  articleHtml: string;
}

const draftStore: DraftEntry[] = [];
const scheduledStore: ScheduledEntry[] = [];

const POLL_DURATIONS = ["1 day", "3 days", "7 days"] as const;
const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const DRAFT_TABS = ["Drafts", "Scheduled"] as const;
type DraftTab = (typeof DRAFT_TABS)[number];

// The coach's recent live sessions — mock data for the replay picker. In
// production this would come from their session-recording history.
const RECORDINGS = [
  { id: "sabrina", title: "Resume teardown: 5 real resumes, live edits", src: "/videos/sabrina.mp4", meta: "August 15, 2026", duration: "48:12", watched: 412, chatCount: 96, peak: 87 },
  { id: "corinna", title: "MBA essays: what readers skim vs. read twice", src: "/videos/corinna.mp4", meta: "August 12, 2026", duration: "36:05", watched: 268, chatCount: 54, peak: 61 },
  { id: "garritt", title: "Case interview drills: market sizing warm-ups", src: "/videos/garritt.mp4", meta: "August 8, 2026", duration: "52:40", watched: 187, chatCount: 41, peak: 44 },
] as const;

// Auto-generated highlight clips, chopped from the coach's livestreams and
// served back ready to post — short and vertical.
// Footage-free caption clip: the LLM pairs the best audience question with
// the host's answer and renders it as animated type over brand yellow, using
// the real session audio — no need for the host to look camera-ready.
const CAPTION_CLIP = {
  id: "clip-cap",
  title: "What's the best way to make my resume stand out?",
  from: "Resume teardown",
  duration: "0:18",
  reason: "Best questions of the session",
  segments: [
    {
      q: "What's the best way to make my resume stand out?",
      a: "One story. Every bullet earns its place in it.",
      qAudio: "/audio/clip-q.m4a",
      aAudio: "/audio/clip-a.m4a",
    },
    {
      q: "Is a non-target school a dealbreaker?",
      a: "No. Just lead with outcomes nobody can argue with.",
      qAudio: "/audio/clip-q2.m4a",
      aAudio: "/audio/clip-a2.m4a",
    },
    {
      q: "How many bullets should each role get?",
      a: "Three, max. If everything's important, nothing is.",
      qAudio: "/audio/clip-q3.m4a",
      aAudio: "/audio/clip-a3.m4a",
    },
  ],
};

// Each clip is anchored on the question that was asked — an LLM reads the
// transcript and picks the moments worth posting; `reason` says why.
const CLIPS = [
  { id: "clip-1", title: "How do I make my resume tell one story?", from: "Resume teardown", src: "/videos/sabrina.mp4", t: 6, duration: "0:42", reason: "Most replayed moment" },
  { id: "clip-2", title: "What do essay readers actually skim?", from: "MBA essays", src: "/videos/corinna.mp4", t: 4, duration: "0:58", reason: "Chat spiked here" },
  { id: "clip-3", title: "How do I size a market in 90 seconds?", from: "Case drills", src: "/videos/garritt.mp4", t: 8, duration: "1:14", reason: "Watch-time peak" },
  { id: "clip-4", title: "Cold email or the recruiting pipeline?", from: "Resume teardown", src: "/videos/sabrina.mp4", t: 20, duration: "0:37", reason: "Most shared segment" },
] as const;

const SELF = {
  author: "Jamie Allen",
  avatar: profilePhoto,
  time: "now",
  verified: true,
  headline: "Interactive Lead at Airbnb",
  likes: 0,
  comments: 0,
  reposts: 0,
  shares: 0,
};

const stripHtml = (html: string) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.textContent ?? "").trim();
};

const toSeconds = (clock: string) => {
  const [m, sec] = clock.split(":").map(Number);
  return m * 60 + sec;
};
const toClock = (secs: number) => `${Math.floor(secs / 60)}:${String(Math.round(secs % 60)).padStart(2, "0")}`;

const editedLabel = (ts: number) =>
  new Date(ts).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

// ─── Calendar sheet ────────────────────

// Shared snap-wheel column for the pickers (time of day, clip length).
const WHEEL_ITEM_H = 36;
function pickerWheel(items: string[], selected: number, onPick: (i: number) => void) {
  return (
    <div
      ref={el => {
        if (el && el.dataset.init !== "1") { el.dataset.init = "1"; el.scrollTop = selected * WHEEL_ITEM_H; }
      }}
      onScroll={e => {
        const i = Math.max(0, Math.min(items.length - 1, Math.round(e.currentTarget.scrollTop / WHEEL_ITEM_H)));
        if (i !== selected) onPick(i);
      }}
      className="relative z-10 h-[144px] w-16 snap-y snap-mandatory overflow-y-auto py-[54px] text-center [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {items.map((it, i) => (
        <div key={it} className={`flex h-9 snap-center items-center justify-center text-[16px] tabular-nums transition-colors ${i === selected ? "font-semibold text-gray-dark" : "text-gray-xlight"}`}>
          {it}
        </div>
      ))}
    </div>
  );
}

function ClipLengthSheet({ seconds, maxSeconds, onDone, onClose }: { seconds: number; maxSeconds: number; onDone: (s: number) => void; onClose: () => void }) {
  const [min, setMin] = useState(Math.floor(seconds / 60));
  const [sec, setSec] = useState(seconds % 60);
  const maxMin = Math.max(0, Math.floor(maxSeconds / 60));
  const MINS = Array.from({ length: maxMin + 1 }, (_, i) => String(i));
  const SECS = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0"));
  return (
    <motion.div
      initial={{ y: "110%" }} animate={{ y: 0 }} exit={{ y: "110%" }} transition={{ type: "spring", stiffness: 380, damping: 38 }}
      className="fixed inset-x-0 bottom-0 z-[71] mx-auto max-w-[600px] rounded-t-3xl bg-white px-5 pb-[max(env(safe-area-inset-bottom),20px)] pt-1"
    >
      <div className="mx-auto mb-3 mt-2 h-1 w-10 rounded-full bg-gray-stroke" />
      <div className="relative flex h-10 items-center justify-center">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute left-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-dark transition-colors hover:bg-gray-200"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
        </button>
        <p className="text-[16px] font-semibold text-gray-dark">Clip length</p>
      </div>
      <div className="relative mt-2 flex items-stretch justify-center gap-2">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-9 w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-gray-100" />
        {pickerWheel(MINS, Math.min(min, maxMin), i => setMin(i))}
        <span className="z-10 self-center text-[13px] font-medium text-gray-light">min</span>
        {pickerWheel(SECS, Math.min(11, Math.round(sec / 5)), i => setSec(i * 5))}
        <span className="z-10 self-center text-[13px] font-medium text-gray-light">sec</span>
      </div>
      <button
        onClick={() => onDone(Math.max(5, Math.min(maxSeconds, min * 60 + sec)))}
        className="mt-4 w-full cursor-pointer rounded-full bg-gray-dark py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#333]"
      >
        Done
      </button>
    </motion.div>
  );
}

function CalendarSheet({ onSave, onClose }: { onSave: (label: string) => void; onClose: () => void }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState<Date>(() => new Date(today));
  const [time, setTime] = useState(() => {
    const next = new Date();
    next.setHours(next.getHours() + 1, 0, 0, 0);
    return `${String(next.getHours()).padStart(2, "0")}:00`;
  });

  const [timeOpen, setTimeOpen] = useState(false);
  const [h24, mm] = time.split(":").map(Number);
  const ampm = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const setParts = (h: number, m: number, ap: string) => {
    const H = ap === "PM" ? (h % 12) + 12 : h % 12;
    setTime(`${String(H).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  };
  const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
  const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0"));
  // iOS-style snap wheel: 4 rows tall, padded so first/last items can center.
  const ITEM_H = 36;
  const wheel = (items: string[], selected: number, onPick: (i: number) => void) => (
    <div
      ref={el => {
        if (el && el.dataset.init !== "1") { el.dataset.init = "1"; el.scrollTop = selected * ITEM_H; }
      }}
      onScroll={e => {
        const i = Math.max(0, Math.min(items.length - 1, Math.round(e.currentTarget.scrollTop / ITEM_H)));
        if (i !== selected) onPick(i);
      }}
      className="relative z-10 h-[144px] w-16 snap-y snap-mandatory overflow-y-auto py-[54px] text-center [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {items.map((it, i) => (
        <div key={it} className={`flex h-9 snap-center items-center justify-center text-[16px] tabular-nums transition-colors ${i === selected ? "font-semibold text-gray-dark" : "text-gray-xlight"}`}>
          {it}
        </div>
      ))}
    </div>
  );

  const monthLabel = month.toLocaleString(undefined, { month: "long", year: "numeric" });
  const firstWeekday = month.getDay();
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const isCurrentMonth = month.getFullYear() === today.getFullYear() && month.getMonth() === today.getMonth();

  const save = () => {
    const [h, m] = time.split(":").map(Number);
    const when = new Date(selected);
    when.setHours(h, m, 0, 0);
    onSave(when.toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }));
  };

  return (
    <motion.div
      initial={{ y: "110%" }} animate={{ y: 0 }} exit={{ y: "110%" }} transition={{ type: "spring", stiffness: 380, damping: 38 }}
      className="fixed inset-x-0 bottom-0 z-[71] mx-auto max-w-[600px] rounded-t-3xl bg-white px-5 pb-[max(env(safe-area-inset-bottom),20px)] pt-1"
    >
      <div className="mx-auto mb-3 mt-2 h-1 w-10 rounded-full bg-gray-stroke" />
      <div className="relative flex h-9 items-center justify-center">
        <button onClick={onClose} className="absolute left-0 cursor-pointer text-[15px] text-gray-light transition-colors hover:text-gray-dark">Cancel</button>
        <p className="text-[16px] font-semibold text-gray-dark">Schedule post</p>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-[17px] font-semibold text-gray-dark">{monthLabel}</p>
        <div className="-mr-2 flex items-center gap-1">
          <button
            onClick={() => setMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
            disabled={isCurrentMonth}
            aria-label="Previous month"
            className="cursor-pointer rounded-full p-2 text-gray-dark transition-colors hover:bg-gray-hover disabled:cursor-default disabled:opacity-30"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <button
            onClick={() => setMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
            aria-label="Next month"
            className="cursor-pointer rounded-full p-2 text-gray-dark transition-colors hover:bg-gray-hover"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
          </button>
        </div>
      </div>

      <div className="-mx-1 mt-2 grid grid-cols-7 text-center">
        {WEEKDAYS.map(d => (
          <span key={d} className="py-1 text-[11px] font-semibold tracking-wide text-gray-xlight">{d}</span>
        ))}
        {Array.from({ length: firstWeekday }, (_, i) => <span key={`pad-${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const date = new Date(month.getFullYear(), month.getMonth(), day);
          const isPast = date < today;
          const isSelected = date.getTime() === selected.getTime();
          return (
            <button
              key={day}
              onClick={() => setSelected(date)}
              disabled={isPast}
              className={`mx-auto flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[15px] transition-colors disabled:cursor-default disabled:text-gray-xlight/60 ${
                isSelected ? "bg-gray-dark font-semibold text-white" : "text-gray-dark hover:bg-gray-hover"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="mt-3 border-t border-gray-stroke/60 pt-3">
        <div className="flex items-center justify-between">
          <p className="text-[15px] font-semibold text-gray-dark">Time</p>
          <button
            onClick={() => setTimeOpen(o => !o)}
            className={`cursor-pointer rounded-full px-3.5 py-1.5 text-[14px] font-semibold tabular-nums transition-colors ${timeOpen ? "bg-gray-dark text-white" : "bg-gray-100 text-gray-dark hover:bg-gray-200"}`}
          >
            {h12}:{String(mm).padStart(2, "0")} {ampm}
          </button>
        </div>
        <AnimatePresence initial={false}>
          {timeOpen ? (
            <motion.div
              key="time-wheels"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="relative mt-1 flex items-stretch justify-center gap-3">
                <div className="pointer-events-none absolute left-1/2 top-1/2 h-9 w-[248px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-gray-100" />
                {wheel(HOURS, HOURS.indexOf(String(h12)), i => setParts(Number(HOURS[i]), mm, ampm))}
                {wheel(MINUTES, Math.round(mm / 5), i => setParts(h12, i * 5, ampm))}
                {wheel(["AM", "PM"], ampm === "AM" ? 0 : 1, i => setParts(h12, mm, i === 0 ? "AM" : "PM"))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <button onClick={save} className="mt-4 w-full cursor-pointer rounded-full bg-gray-dark py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#333]">
        Schedule
      </button>
    </motion.div>
  );
}

// ─── Composer ────────────────────

export function Composer({ onClose, onPublish, onDraftSaved, onScheduled, openDraftsOnMount, draftsTabOnMount }: { onClose: () => void; onPublish: (post: Post) => void; onDraftSaved?: () => void; onScheduled?: () => void; openDraftsOnMount?: boolean; draftsTabOnMount?: DraftTab }) {
  const { hasLivestreams } = useFeedDemo();
  const [mode, setMode] = useState<ComposerMode>("post");
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [selectedRecording, setSelectedRecording] = useState<string | null>(null);
  const [selectedClip, setSelectedClip] = useState<string | null>(null);
  const [liveStep, setLiveStep] = useState<"list" | "edit" | "share">("list");
  const [liveTab, setLiveTab] = useState<"Livestreams" | "Clips">("Livestreams");
  const [cropGrid, setCropGrid] = useState(false);
  const [cropAspect, setCropAspect] = useState<"Original" | "16:9" | "1:1" | "4:5" | "9:16">("Original");
  const [cropX, setCropX] = useState(50);
  const [cropY, setCropY] = useState(50);
  const [editorPlaying, setEditorPlaying] = useState(true);
  const [playheadPct, setPlayheadPct] = useState(0);
  const editorVideoRef = useRef<HTMLVideoElement>(null);
  const [replayCaption, setReplayCaption] = useState("");
  const [goLiveTitle, setGoLiveTitle] = useState("");
  // Clip window, as percentages of the recording (Instagram-style trim).
  const [clipStart, setClipStart] = useState(0);
  const [clipWindow, setClipWindow] = useState(15);
  const [clipLenOpen, setClipLenOpen] = useState(false);
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [clipEnd, setClipEnd] = useState(100);
  const trimTrackRef = useRef<HTMLDivElement>(null);
  // Zoomed window of the trim strip (Apple-style: trimming re-fits the view).
  const [viewStart, setViewStart] = useState(0);
  const [viewEnd, setViewEnd] = useState(100);
  const [trimDrag, setTrimDrag] = useState<"start" | "end" | "move" | null>(null);
  const [editorHistory, setEditorHistory] = useState<EditorSnap[]>([]);
  const replayCaptionRef = useRef<HTMLTextAreaElement>(null);
  const articleTitleRef = useRef<HTMLTextAreaElement>(null);
  const subtitleRef = useRef<HTMLTextAreaElement>(null);
  const demoToken = useRef(0);
  const [captionsOn, setCaptionsOn] = useState(true);
  const [chatOn, setChatOn] = useState(false);
  const [subtitle, setSubtitle] = useState("");
  const [topic, setTopic] = useState("");
  const [articleHtml, setArticleHtml] = useState("");
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [pollOptions, setPollOptions] = useState<string[] | null>(null);
  const [pollDuration, setPollDuration] = useState<string>(POLL_DURATIONS[0]);
  const [scheduledFor, setScheduledFor] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  // Drives the modal's entrance/exit. dismiss() plays the exit; the real onClose
  // (which unmounts us in the parent) fires on AnimatePresence's onExitComplete.
  const [open, setOpen] = useState(true);
  const dismiss = () => setOpen(false);
  const [draftsOpen, setDraftsOpen] = useState(openDraftsOnMount ?? false);
  const [draftsTab, setDraftsTab] = useState<DraftTab>(draftsTabOnMount ?? "Drafts");
  const [discardOpen, setDiscardOpen] = useState(false);
  const [confirmTrash, setConfirmTrash] = useState<{ kind: "draft" | "scheduled"; id: number } | null>(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const [styleMenuOpen, setStyleMenuOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [storeVersion, setStoreVersion] = useState(0);
  void storeVersion;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const editorImageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const pendingEditorHtml = useRef<string | null>(null);

  // The replay caption is prefilled programmatically, so onChange's autogrow
  // never fires — resize it whenever the picked recording changes.
  useEffect(() => {
    const el = replayCaptionRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [selectedRecording]);

  // Restore a draft's rich body once the editor exists (mode switch renders it
  // a tick after loadDraft runs).
  useEffect(() => {
    if (mode === "article" && editorRef.current && pendingEditorHtml.current !== null) {
      editorRef.current.innerHTML = pendingEditorHtml.current;
      pendingEditorHtml.current = null;
    }
  }, [mode]);

  // Size the subtitle after render — programmatic sets (typewriter demo,
  // draft restore) never fire onChange, so autoGrow alone leaves it clipped.
  useEffect(() => {
    const el = subtitleRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [subtitle, mode]);

  const articlePlain = stripHtml(articleHtml);
  const isDirty =
    text.trim() !== "" || title.trim() !== "" || replayCaption.trim() !== "" || selectedRecording !== null || selectedClip !== null || goLiveTitle.trim() !== "" || subtitle.trim() !== "" || topic.trim() !== "" ||
    pollOptions !== null || images.length > 0 || articlePlain !== "";
  const pollReady = pollOptions !== null && pollOptions.filter(o => o.trim()).length >= 2;
  const canSubmit =
    mode === "post" ? (pollOptions !== null ? text.trim() !== "" && pollReady : text.trim() !== "" || images.length > 0)
    : mode === "article" ? title.trim() !== "" && articlePlain !== ""
    : mode === "golive" ? goLiveTitle.trim() !== ""
    : liveStep === "share" && (selectedRecording !== null || selectedClip !== null);

  const primaryLabel =
    scheduledFor && mode !== "live" ? "Schedule"
    : mode === "article" ? "Publish"
    : mode === "live" ? "Post"
    : "Post";

  // Prototype magic: entering article mode writes a complete article in a
  // typewriter effect — title, subtitle, bold, headings, list, quote, image —
  // to demo every element of the editor.
  const runArticleDemo = async () => {
    const token = ++demoToken.current;
    const live = () => demoToken.current === token;
    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
    const growTitle = () => {
      const el = articleTitleRef.current;
      if (el) { el.style.height = "auto"; el.style.height = `${el.scrollHeight}px`; }
    };
    const setBody = (html: string) => {
      setArticleHtml(html);
      if (editorRef.current) editorRef.current.innerHTML = html;
    };
    // Time-based typing: renders as many characters as the elapsed time calls
    // for, so the cadence holds even when background tabs throttle timers.
    const typeText = async (text: string, perChar: number, render: (t: string) => void) => {
      const t0 = performance.now();
      let i = 0;
      while (i < text.length) {
        if (!live()) return false;
        await sleep(16);
        if (!live()) return false;
        i = Math.min(text.length, Math.max(i + 1, Math.round((performance.now() - t0) / perChar)));
        render(text.slice(0, i));
      }
      return true;
    };

    await sleep(450);
    const TITLE = "The interview question nobody preps for";
    if (!(await typeText(TITLE, 30, t => { setTitle(t); growTitle(); }))) return;
    await sleep(250);
    const SUB = "And the three-part answer that works every time.";
    if (!(await typeText(SUB, 16, t => setSubtitle(t)))) return;
    await sleep(300);

    type Seg = { t: string; b?: boolean; i?: boolean; li?: boolean };
    type Block =
      | { pre: string; post: string; segs: Seg[] }
      | { insert: string };
    const BLOCKS: Block[] = [
      { pre: "<div>", post: "</div>", segs: [
        { t: "Every cycle I watch brilliant candidates freeze on the same prompt: " },
        { t: "\u201cwalk me through a decision you got wrong.\u201d", b: true },
      ]},
      { pre: "<div><br/></div><div>", post: "</div>", segs: [
        { t: "Not because they lack material \u2014 because they\u2019ve never rehearsed being wrong " },
        { t: "out loud", i: true },
        { t: "." },
      ]},
      { pre: "<h2>", post: "</h2>", segs: [{ t: "Start with the moment, not the lesson" }] },
      { pre: "<div>", post: "</div>", segs: [
        { t: "If your first sentence could open anyone else\u2019s answer, cut it. Tell the scene you\u2019d be embarrassed to read aloud \u2014 then earn the reflection." },
      ]},
      { insert: `<img src="${articlePhoto}" alt="" />` },
      { pre: "<h3>", post: "</h3>", segs: [{ t: "The three parts" }] },
      { pre: "<ul>", post: "</ul>", segs: [
        { t: "One decision you own completely", li: true },
        { t: "What it cost, in a single sentence", li: true },
        { t: "What you do differently now", li: true },
      ]},
      { pre: "<blockquote>", post: "</blockquote>", segs: [
        { t: "A safe answer sounds like everyone\u2019s. A specific one can only be yours." },
      ]},
      { insert: "<hr/>" },
      { pre: "<div>", post: "</div>", segs: [
        { t: "Bring one story to Thursday\u2019s live session \u2014 we\u2019ll pressure-test it together." },
      ]},
    ];

    const wrap = (seg: Seg, text: string) => {
      let out = text;
      if (seg.b) out = `<b>${out}</b>`;
      if (seg.i) out = `<i>${out}</i>`;
      if (seg.li) out = `<li>${out}</li>`;
      return out;
    };

    let built = "";
    for (const block of BLOCKS) {
      if (!live()) return;
      if ("insert" in block) {
        built += block.insert;
        setBody(built);
        await sleep(600);
        continue;
      }
      let done = "";
      for (const seg of block.segs) {
        const ok = await typeText(seg.t, 10, t => setBody(built + block.pre + done + wrap(seg, t) + block.post));
        if (!ok) return;
        done += wrap(seg, seg.t);
      }
      built += block.pre + done + block.post;
      setBody(built);
      await sleep(280);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 4 - images.length);
    files.forEach(file => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        setImages(prev => (prev.length >= 4 ? prev : [...prev, { original: url, cropped: url, aspectRatio: img.naturalWidth / img.naturalHeight }]));
      };
      img.src = url;
    });
    e.target.value = "";
  };

  // ── Rich text commands — editor keeps focus via onMouseDown preventDefault ──
  const exec = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    setArticleHtml(editorRef.current?.innerHTML ?? "");
  };

  // Press-and-drag an image (or divider) to lift its block and reorder it —
  // top-level editor children are the drag units, a marker shows the drop slot.
  const handleBlockDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName !== "IMG" && target.tagName !== "HR") return;
    const editor = editorRef.current;
    if (!editor) return;
    let block: HTMLElement = target;
    while (block.parentElement && block.parentElement !== editor) block = block.parentElement;
    e.preventDefault();
    const startY = e.clientY;
    let lifted = false;
    let marker: HTMLElement | null = null;
    const move = (ev: PointerEvent) => {
      if (!lifted && Math.abs(ev.clientY - startY) > 8) {
        lifted = true;
        block.style.opacity = "0.35";
        marker = document.createElement("div");
        marker.style.cssText = "height:3px;border-radius:2px;background:#222;margin:10px 0;";
        editor.insertBefore(marker, block.nextSibling);
      }
      if (!lifted || !marker) return;
      let before: Element | null = null;
      for (const b of Array.from(editor.children)) {
        if (b === block || b === marker) continue;
        const r = b.getBoundingClientRect();
        if (ev.clientY < r.top + r.height / 2) { before = b; break; }
      }
      editor.insertBefore(marker, before);
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      block.style.opacity = "";
      if (marker) {
        editor.insertBefore(block, marker);
        marker.remove();
        setArticleHtml(editor.innerHTML);
      }
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const openLinkSheet = () => {
    const sel = window.getSelection();
    savedRangeRef.current = sel && sel.rangeCount > 0 ? sel.getRangeAt(0).cloneRange() : null;
    setLinkUrl("");
    setLinkOpen(true);
  };

  const insertLink = () => {
    const url = linkUrl.trim();
    setLinkOpen(false);
    if (!url) return;
    const href = /^https?:\/\//.test(url) ? url : `https://${url}`;
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (savedRangeRef.current && sel) {
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    }
    if (sel && !sel.isCollapsed) {
      document.execCommand("createLink", false, href);
    } else {
      document.execCommand("insertHTML", false, `<a href="${href}">${href}</a>`);
    }
    setArticleHtml(editorRef.current?.innerHTML ?? "");
  };

  const handleEditorImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) exec("insertImage", URL.createObjectURL(file));
    e.target.value = "";
  };

  // A picked video drops straight into the livestream editor — same trim,
  // crop, and burn-in tools — then posts like any other video.
  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedVideo(URL.createObjectURL(file));
    setSelectedRecording("upload");
    setSelectedClip(null);
    setClipStart(0);
    setClipEnd(100);
    setViewStart(0);
    setViewEnd(100);
    setEditorHistory([]);
    setCropGrid(false);
    setCropAspect("Original");
    setCropX(50);
    setCropY(50);
    setMode("live");
    setLiveStep("edit");
    e.target.value = "";
  };

  const buildPost = (): Post => {
    const base = { ...SELF, id: Date.now() };
    if (mode === "article") {
      const words = articlePlain.split(/\s+/).length;
      return {
        ...base,
        type: "article",
        title: title.trim(),
        subtitle: subtitle.trim() || undefined,
        body: articlePlain,
        bodyHtml: articleHtml,
        readMinutes: Math.max(1, Math.round(words / 200)),
      };
    }
    if (mode === "golive") {
      return {
        ...base,
        type: "live",
        body: text.trim() || "Join my livestream \u{1F44B}",
        live: {
          variant: "tiktok",
          title: goLiveTitle.trim(),
          topic: "Live",
          videoId: "1cfIAVasP6E",
          videoSrc: "/videos/sabrina.mp4",
          viewers: 1,
        },
      };
    }
    if (mode === "live" && selectedClip === CAPTION_CLIP.id) {
      return {
        ...base,
        type: "live",
        body: replayCaption.trim() || CAPTION_CLIP.title,
        live: {
          variant: "tiktok",
          title: CAPTION_CLIP.title,
          topic: "Clip",
          videoId: "1cfIAVasP6E",
          viewers: 0,
          replay: true,
          duration: CAPTION_CLIP.duration,
          horizontal: true,
          captionCard: CAPTION_CLIP.segments,
        },
      };
    }
    if (mode === "live" && selectedClip !== null) {
      const clip = CLIPS.find(c => c.id === selectedClip) ?? CLIPS[0];
      return {
        ...base,
        type: "live",
        body: replayCaption.trim() || clip.title,
        live: {
          variant: "tiktok",
          title: clip.title,
          topic: "Clip",
          videoId: "1cfIAVasP6E",
          videoSrc: clip.src,
          viewers: 0,
          replay: true,
          duration: clip.duration,
          hideDeck: true,
          horizontal: true,
          showCaptions: captionsOn,
          showChat: chatOn,
          cropAspect: cropAspect === "Original" ? "9:16" : cropAspect,
          cropX,
          cropY,
        },
      };
    }
    if (mode === "live") {
      const isUpload = selectedRecording === "upload" && uploadedVideo !== null;
      const rec = RECORDINGS.find(r => r.id === selectedRecording) ?? RECORDINGS[0];
      const recDuration = isUpload ? "1:00" : rec.duration;
      const total = toSeconds(recDuration);
      const isClipped = clipStart > 0 || clipEnd < 100;
      const clipLabel = isClipped ? toClock(((clipEnd - clipStart) / 100) * total) : recDuration;
      return {
        ...base,
        type: "live",
        body: replayCaption.trim() || (isUpload ? "New video" : rec.title),
        live: {
          variant: "tiktok",
          title: isUpload ? (replayCaption.trim() || "New video") : rec.title,
          topic: isUpload ? "Video" : "Replay",
          videoId: "1cfIAVasP6E",
          videoSrc: isUpload ? uploadedVideo! : rec.src,
          viewers: 0,
          replay: true,
          duration: clipLabel,
          horizontal: true,
          showCaptions: captionsOn,
          showChat: chatOn,
          peakViewers: isUpload ? undefined : rec.peak,
          cropAspect,
          cropX,
          cropY,
        },
      };
    }
    if (pollOptions !== null) {
      return {
        ...base,
        type: "poll",
        body: text.trim(),
        poll: {
          options: pollOptions.filter(o => o.trim()).map(label => ({ label: label.trim(), votes: 0 })),
          durationLabel: `${pollDuration} left`,
        },
      };
    }
    if (images.length > 0) {
      return {
        ...base,
        type: "image",
        body: text.trim(),
        images: images.map(i => i.cropped),
        imageAspectRatios: images.map(i => i.aspectRatio),
      };
    }
    return { ...base, type: "text", body: text.trim() };
  };

  const submit = () => {
    if (!canSubmit) return;
    if (scheduledFor && mode !== "live") {
      scheduledStore.unshift({
        id: Date.now(),
        mode,
        snippet: mode === "article" ? title.trim() : text.trim(),
        scheduledFor,
        editedAt: Date.now(),
        text,
        title,
        subtitle,
        topic,
        poll: pollOptions,
        articleHtml,
      });
      dismiss();
      return;
    }
    onPublish(buildPost());
    dismiss();
  };

  const saveDraft = () => {
    draftStore.unshift({ id: Date.now(), mode, text: mode === "live" ? replayCaption : text, title: mode === "golive" ? goLiveTitle : title, subtitle, topic: mode === "live" ? (selectedRecording ?? "") : topic, poll: pollOptions, articleHtml, editedAt: Date.now() });
    dismiss();
    onDraftSaved?.();
  };

  const loadDraft = (draft: DraftEntry) => {
    setMode(draft.mode);
    if (draft.mode === "live") {
      setReplayCaption(draft.text);
      setSelectedRecording(draft.topic || null);
    } else if (draft.mode === "golive") {
      setGoLiveTitle(draft.title);
    } else {
      setText(draft.text);
      setTitle(draft.title);
      setTopic(draft.topic);
    }
    setSubtitle(draft.subtitle);
    setPollOptions(draft.poll);
    setArticleHtml(draft.articleHtml);
    if (draft.mode === "article") {
      if (editorRef.current) editorRef.current.innerHTML = draft.articleHtml;
      else pendingEditorHtml.current = draft.articleHtml;
    }
    draftStore.splice(draftStore.indexOf(draft), 1);
    setDraftsOpen(false);
    setStoreVersion(v => v + 1);
  };

  const loadScheduled = (s: ScheduledEntry) => {
    setMode(s.mode);
    if (s.mode === "golive") setGoLiveTitle(s.title);
    else { setText(s.text); setTitle(s.title); setTopic(s.topic); }
    setSubtitle(s.subtitle);
    setPollOptions(s.poll);
    setArticleHtml(s.articleHtml);
    if (s.mode === "article") {
      if (editorRef.current) editorRef.current.innerHTML = s.articleHtml;
      else pendingEditorHtml.current = s.articleHtml;
    }
    setScheduledFor(s.scheduledFor);
    scheduledStore.splice(scheduledStore.indexOf(s), 1);
    setDraftsOpen(false);
    setStoreVersion(v => v + 1);
  };

  const handleCancel = () => {
    demoToken.current++;
    if (isDirty) setDiscardOpen(true);
    else dismiss();
  };

  const storedCount = draftStore.length + scheduledStore.length;
  const tabDrafts = draftsTab === "Drafts" ? draftStore : [];

  const autoGrow = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const scheduledChip = scheduledFor ? (
    <div className="mt-2 flex items-center gap-2">
      <span className="rounded-full bg-gray-100 px-3 py-1 text-[12px] font-medium text-gray-dark">Will post {scheduledFor}</span>
      <button onClick={() => setScheduledFor(null)} className="cursor-pointer text-[12px] font-medium text-gray-light transition-colors hover:text-gray-dark">
        Clear
      </button>
    </div>
  ) : null;

  const toolbarButton = (label: string, onAction: () => void, icon: React.ReactNode, active = false) => (
    <button
      onMouseDown={e => e.preventDefault()}
      onClick={onAction}
      aria-label={label}
      className={`shrink-0 cursor-pointer rounded-full p-2 transition-colors hover:bg-gray-hover hover:text-gray-dark ${active ? "text-gray-dark" : "text-gray-light"}`}
    >
      {icon}
    </button>
  );

  // Portal to <body>: Home's <main> is a z-0 stacking context, which would
  // trap the overlay underneath the app's fixed header and tab bar.
  return createPortal(
    <AnimatePresence onExitComplete={onClose}>
      {open && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
      onClick={e => { if (e.target === e.currentTarget) handleCancel(); }}
      className="fixed inset-0 z-[60] flex flex-col bg-white md:items-center md:justify-center md:bg-black/50 md:p-6"
    >
      <motion.div
        initial={{ scale: 0.98, y: 8 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.98, y: 8 }}
        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="mx-auto flex h-full w-full max-w-[600px] flex-col md:h-[min(880px,92dvh)] md:overflow-hidden md:rounded-2xl md:border md:border-gray-stroke md:bg-white"
      >
        {/* Header (the dark editor step brings its own chrome) */}
        {!(mode === "live" && liveStep === "edit") ? (
        <div className="flex h-14 shrink-0 items-center justify-between px-4">
          {mode === "post" || mode === "article" ? (
            <button
              onClick={handleCancel}
              aria-label="Close composer"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-dark transition-colors hover:bg-gray-200"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </button>
          ) : (
            <button
              onClick={() => {
                if (mode === "live" && liveStep === "share") {
                  if (selectedClip === CAPTION_CLIP.id) { setSelectedClip(null); setLiveStep("list"); }
                  else setLiveStep("edit");
                } else if (mode === "live" && liveStep === "edit") {
                  setSelectedRecording(null);
                  setSelectedClip(null);
                  setLiveStep("list");
                } else {
                  demoToken.current++;
                  setMode("post");
                }
              }}
              aria-label="Back"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-dark transition-colors hover:bg-gray-200"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            </button>
          )}
          {/* Substack pattern: ⋯ plus ONE pill. Pristine composer shows Drafts;
              the moment you type it swaps to the submit button. Drafts stay
              reachable from the ⋯ menu after that. */}
          <div className="flex shrink-0 items-center gap-2">
            {mode === "post" || mode === "article" ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(o => !o)}
                  aria-label="More options"
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-dark transition-colors hover:bg-gray-200"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>
                </button>
                {menuOpen ? (
                  <>
                    <div className="fixed inset-0 z-[65]" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 top-11 z-[66] w-44 overflow-hidden rounded-xl border border-gray-stroke bg-white py-1">
                      <button
                        onClick={() => { setMenuOpen(false); setScheduleOpen(true); }}
                        className="flex w-[calc(100%-8px)] mx-1 cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left text-[14px] font-medium text-gray-dark transition-colors hover:bg-gray-hover active:bg-gray-hover"
                      >
                        <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
                        Schedule
                      </button>
                      {isDirty ? (
                        <button
                          onClick={() => { setMenuOpen(false); setDraftsTab("Drafts"); setDraftsOpen(true); }}
                          className="flex w-[calc(100%-8px)] mx-1 cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left text-[14px] font-medium text-gray-dark transition-colors hover:bg-gray-hover active:bg-gray-hover"
                        >
                          <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M14 3v6h6" /></svg>
                          Drafts
                        </button>
                      ) : null}
                    </div>
                  </>
                ) : null}
              </div>
            ) : null}
            {mode === "golive" ? (
              <button
                onClick={submit}
                disabled={!canSubmit}
                className="inline-flex h-10 cursor-pointer items-center whitespace-nowrap rounded-full bg-[#D6204C] px-5 text-[14px] font-semibold text-white transition-colors hover:bg-[#b81b41] disabled:cursor-default disabled:opacity-35"
              >
                Go live
              </button>
            ) : mode === "live" ? (
              <button
                onClick={submit}
                disabled={!canSubmit}
                className="inline-flex h-10 cursor-pointer items-center whitespace-nowrap rounded-full bg-gray-dark px-5 text-[14px] font-semibold text-white transition-colors hover:bg-[#333] disabled:cursor-default disabled:opacity-35"
              >
                Post
              </button>
            ) : !isDirty ? (
              <button
                onClick={() => { setDraftsTab("Drafts"); setDraftsOpen(true); }}
                className="inline-flex h-10 cursor-pointer items-center whitespace-nowrap rounded-full bg-gray-100 px-4 text-[14px] font-semibold text-gray-dark transition-colors hover:bg-gray-200"
              >
                Drafts
                {storedCount > 0 ? (
                  <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-dark px-1.5 text-[11px] font-bold leading-none text-white">{storedCount}</span>
                ) : null}
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={!canSubmit}
                className="inline-flex h-10 cursor-pointer items-center whitespace-nowrap rounded-full bg-gray-dark px-5 text-[14px] font-semibold text-white transition-colors hover:bg-[#333] disabled:cursor-default disabled:opacity-35"
              >
                {primaryLabel}
              </button>
            )}
          </div>
        </div>
        ) : null}

        {mode === "post" ? (
          <>
            <div className="flex-1 overflow-y-auto px-4 pt-3 pb-6">
              {/* Identity row above the input, Substack-style */}
              <div className="flex items-center gap-3">
                <img src={profilePhoto} alt="You" className="h-10 w-10 rounded-full object-cover" />
                <span className="text-[16px] font-semibold text-gray-dark">{SELF.author}</span>
              </div>
              {/* Single line that grows — keeps the toolbar hugging the text
                  instead of floating several empty lines below it. */}
              <textarea
                autoFocus
                value={text}
                onChange={e => { setText(e.target.value); autoGrow(e); }}
                placeholder={pollOptions !== null ? "Ask a question…" : "What's on your mind?"}
                rows={1}
                className="zoom-ok mt-3 w-full resize-none text-[19px] leading-[1.45] text-gray-dark outline-none placeholder:text-gray-light"
              />

              {/* Media toolbar sits right under the input */}
              <div className="-ml-2.5 mt-1.5 flex items-center gap-1">
                <ComposerMediaButton label="Add image" src={composerImageIcon} onClick={() => fileInputRef.current?.click()} active={images.length > 0} />
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageSelect} />
                <ComposerMediaButton label="Take photo" src={composerCameraIcon} onClick={() => cameraInputRef.current?.click()} />
                <input ref={cameraInputRef} type="file" accept="image/*" capture="user" className="hidden" onChange={handleImageSelect} />
                <ComposerMediaButton label="Add video" src={composerVideoIcon} onClick={() => videoInputRef.current?.click()} />
                <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={handleVideoSelect} />
                <ComposerMediaButton label="Add poll" src={composerPollIcon} onClick={() => setPollOptions(opts => (opts === null ? ["", ""] : opts))} active={pollOptions !== null} />
              </div>

              {scheduledChip}

              {images.length > 0 ? (
                <div className={`mt-3 grid gap-2 ${images.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                  {images.map((img, i) => (
                    <div key={img.cropped} className="relative overflow-hidden rounded-xl border border-gray-stroke/60">
                      <img src={img.cropped} alt="" className="h-full max-h-[280px] w-full object-cover" />
                      <button
                        onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                        aria-label="Remove image"
                        className="absolute right-2 top-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
                      >
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}

              {pollOptions !== null ? (
                <div className="mt-3 rounded-2xl border border-gray-stroke p-3.5">
                  <div className="mb-2.5 flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-gray-dark">Poll</span>
                    <button
                      onClick={() => setPollOptions(null)}
                      aria-label="Remove poll"
                      className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-dark transition-colors hover:bg-gray-200"
                    >
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    </button>
                  </div>
                  <div className="space-y-2">
                    {pollOptions.map((option, i) => (
                      <input
                        key={i}
                        value={option}
                        onChange={e => setPollOptions(opts => opts!.map((o, j) => (j === i ? e.target.value : o)))}
                        placeholder={`Choice ${i + 1}${i >= 2 ? " (optional)" : ""}`}
                        className="w-full rounded-xl border border-gray-stroke px-3.5 py-2.5 text-[14px] text-gray-dark outline-none transition-[border] focus:border-gray-dark"
                      />
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    {pollOptions.length < 4 ? (
                      <button onClick={() => setPollOptions(opts => [...opts!, ""])} className="cursor-pointer text-[13px] font-medium text-gray-dark hover:underline">
                        + Add option
                      </button>
                    ) : <span />}
                    <div className="flex gap-1.5">
                      {POLL_DURATIONS.map(d => (
                        <button
                          key={d}
                          onClick={() => setPollDuration(d)}
                          className={`cursor-pointer rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${
                            pollDuration === d ? "bg-gray-dark text-white" : "bg-gray-100 text-gray-dark hover:bg-gray-200"
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Long-form entry points, Substack-style cards — hidden while a
                poll is being built so the focused card isn't crowded out */}
            {pollOptions === null ? (
            <div className="shrink-0 pb-[max(env(safe-area-inset-bottom),16px)]">
              <div className="flex gap-3 overflow-x-auto px-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <button
                  onClick={() => { setMode("article"); runArticleDemo(); }}
                  className="flex w-[164px] shrink-0 cursor-pointer flex-col items-start gap-2.5 rounded-2xl bg-gray-100 p-4 text-left transition-colors hover:bg-gray-200"
                >
                  <svg className="h-6 w-6 text-gray-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M14 3v6h6" /><path d="M8 13h8" /><path d="M8 17h5" /></svg>
                  <span className="text-[15px] font-semibold text-gray-dark">Write an article</span>
                </button>
                <button
                  onClick={() => { setMode("live"); setLiveStep("list"); setSelectedRecording(null); setSelectedClip(null); setCropGrid(false); setCropAspect("Original"); setCropX(50); setCropY(50); }}
                  className="flex w-[164px] shrink-0 cursor-pointer flex-col items-start gap-2.5 rounded-2xl bg-gray-100 p-4 text-left transition-colors hover:bg-gray-200"
                >
                  <svg className="h-6 w-6 text-gray-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z" /><rect x="2" y="6" width="14" height="12" rx="2" /></svg>
                  <span className="text-[15px] font-semibold text-gray-dark">Post Livestream</span>
                </button>
                <button
                  onClick={() => setMode("golive")}
                  className="flex w-[164px] shrink-0 cursor-pointer flex-col items-start gap-2.5 rounded-2xl bg-gray-100 p-4 text-left transition-colors hover:bg-gray-200"
                >
                  <span className="rounded bg-[#D6204C] px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white">LIVE</span>
                  <span className="text-[15px] font-semibold text-gray-dark">Go Live</span>
                </button>
              </div>
            </div>
            ) : null}
          </>
        ) : null}

        {mode === "article" ? (
          <>
            <div className="flex-1 overflow-y-auto px-4 pt-1 pb-6">
              <div className="flex items-center gap-2">
                <img src={profilePhoto} alt="You" className="h-5 w-5 rounded-full object-cover" />
                <span className="text-[13px] font-medium text-gray-light">{SELF.author}</span>
              </div>
              {scheduledChip}
              <textarea
                autoFocus
                ref={articleTitleRef}
                value={title}
                onChange={e => { setTitle(e.target.value); autoGrow(e); }}
                placeholder="Title"
                rows={1}
                className="zoom-ok mt-4 w-full resize-none font-serif text-[32px] leading-[1.2] text-gray-dark outline-none placeholder:text-gray-xlight"
              />
              <textarea
                ref={subtitleRef}
                value={subtitle}
                onChange={e => { setSubtitle(e.target.value); autoGrow(e); }}
                placeholder="Add a subtitle…"
                rows={1}
                className="zoom-ok mt-3 w-full resize-none text-[18px] leading-[1.45] text-gray-light outline-none placeholder:text-gray-xlight"
              />
              <div
                ref={editorRef}
                contentEditable
                onPointerDown={handleBlockDrag}
                onInput={e => { setArticleHtml(e.currentTarget.innerHTML); }}
                data-placeholder="Start writing an article…"
                data-empty={articlePlain === "" && !articleHtml.includes("<img") ? "true" : "false"}
                className="article-body mt-8 min-h-[40dvh] w-full text-[16px] leading-[1.65] text-gray-dark outline-none"
              />
            </div>

            <div className="shrink-0 pb-[max(env(safe-area-inset-bottom),28px)]">
              {/* Formatting toolbar — Substack's editing row */}
              <div className="flex items-center gap-1.5 overflow-x-auto border-t border-gray-stroke/60 px-4 pb-1 pt-2.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="relative">
                  {toolbarButton("Text style", () => setStyleMenuOpen(o => !o), (
                    <span className="flex h-[22px] items-center text-[16px] font-semibold leading-none">Aa</span>
                  ), styleMenuOpen)}
                  {styleMenuOpen ? (
                    <>
                      <div className="fixed inset-0 z-[65]" onMouseDown={() => setStyleMenuOpen(false)} />
                      <div className="fixed bottom-[calc(max(env(safe-area-inset-bottom),28px)+50px)] left-4 z-[66] w-44 overflow-hidden rounded-xl border border-gray-stroke bg-white py-1">
                        <button
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => { exec("formatBlock", "h2"); setStyleMenuOpen(false); }}
                          className="w-full cursor-pointer px-3.5 py-2.5 text-left font-serif text-[20px] font-medium leading-tight text-gray-dark transition-colors hover:bg-gray-hover"
                        >
                          Heading
                        </button>
                        <button
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => { exec("formatBlock", "h3"); setStyleMenuOpen(false); }}
                          className="w-full cursor-pointer px-3.5 py-2 text-left font-serif text-[16px] font-medium leading-tight text-gray-dark transition-colors hover:bg-gray-hover"
                        >
                          Subheading
                        </button>
                        <button
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => { exec("formatBlock", "div"); setStyleMenuOpen(false); }}
                          className="w-full cursor-pointer px-3.5 py-2 text-left text-[15px] text-gray-dark transition-colors hover:bg-gray-hover"
                        >
                          Body
                        </button>
                      </div>
                    </>
                  ) : null}
                </div>
                {toolbarButton("Insert image", () => editorImageInputRef.current?.click(), (
                  <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.5-3.5a2 2 0 0 0-2.83 0L6 20" /></svg>
                ))}
                <input ref={editorImageInputRef} type="file" accept="image/*" className="hidden" onChange={handleEditorImage} />
                {toolbarButton("Bold", () => exec("bold"), (
                  <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 5h6a3.5 3.5 0 0 1 0 7H7z" /><path d="M7 12h7a3.5 3.5 0 0 1 0 7H7z" /></svg>
                ))}
                {toolbarButton("Italic", () => exec("italic"), (
                  <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" /></svg>
                ))}
                {toolbarButton("Link", openLinkSheet, (
                  <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                ))}
                {toolbarButton("Bulleted list", () => exec("insertUnorderedList"), (
                  <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><line x1="9" y1="6" x2="20" y2="6" /><line x1="9" y1="12" x2="20" y2="12" /><line x1="9" y1="18" x2="20" y2="18" /><circle cx="5" cy="6" r="0.5" fill="currentColor" /><circle cx="5" cy="12" r="0.5" fill="currentColor" /><circle cx="5" cy="18" r="0.5" fill="currentColor" /></svg>
                ))}
                {toolbarButton("Quote", () => exec("formatBlock", document.queryCommandValue("formatBlock") === "blockquote" ? "div" : "blockquote"), (
                  <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="currentColor"><path d="M10 8c-2.2 0-4 1.8-4 4v4h4v-4H8c0-1.1.9-2 2-2zm8 0c-2.2 0-4 1.8-4 4v4h4v-4h-2c0-1.1.9-2 2-2z" /></svg>
                ))}
                {toolbarButton("Divider", () => exec("insertHorizontalRule"), (
                  <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><line x1="4" y1="12" x2="20" y2="12" /><circle cx="8" cy="6" r="0.5" fill="currentColor" stroke="none" /><circle cx="12" cy="6" r="0.5" fill="currentColor" stroke="none" /><circle cx="16" cy="6" r="0.5" fill="currentColor" stroke="none" /><circle cx="8" cy="18" r="0.5" fill="currentColor" stroke="none" /><circle cx="12" cy="18" r="0.5" fill="currentColor" stroke="none" /><circle cx="16" cy="18" r="0.5" fill="currentColor" stroke="none" /></svg>
                ))}
                {toolbarButton("Undo", () => exec("undo"), (
                  <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 14 4 9l5-5" /><path d="M4 9h10a6 6 0 0 1 6 6v1" /></svg>
                ))}
              </div>
            </div>
          </>
        ) : null}

        {mode === "live" ? (
          liveStep === "list" ? (
            !hasLivestreams ? (
              /* Empty state: sell the format, then send them to Go Live */
              <div className="flex flex-1 flex-col items-center justify-center px-8 pb-24 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <svg className="h-7 w-7 text-gray-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z" /><rect x="2" y="6" width="14" height="12" rx="2" /></svg>
                </div>
                <p className="mt-5 font-serif text-[24px] leading-tight text-gray-dark">No livestreams yet</p>
                <p className="mt-2.5 max-w-[300px] text-[14px] leading-[1.55] text-gray-light">
                  Livestreams are the fastest way to build trust with the community —
                  and every stream becomes a replay you can post to the feed, working
                  for you long after it ends.
                </p>
                <button
                  onClick={() => setMode("golive")}
                  className="mt-6 cursor-pointer rounded-full bg-[#D6204C] px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#b81b41]"
                >
                  Go Live
                </button>
              </div>
            ) : (
              /* Step 1 — pick a livestream or an auto-generated clip */
              <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6">
                <div className="flex rounded-full bg-gray-100 p-1">
                  {(["Livestreams", "Clips"] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setLiveTab(t)}
                      className="relative flex-1 cursor-pointer rounded-full py-2.5 text-[14px] font-semibold"
                    >
                      {liveTab === t ? (
                        <motion.span
                          layoutId="liveTabPill"
                          transition={{ type: "spring", stiffness: 520, damping: 42 }}
                          className="absolute inset-0 rounded-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.04)]"
                        />
                      ) : null}
                      <span className={`relative z-10 transition-colors ${liveTab === t ? "text-gray-dark" : "text-gray-light"}`}>{t === "Livestreams" ? "Your livestreams" : t}</span>
                    </button>
                  ))}
                </div>

                {liveTab === "Livestreams" ? (
                  <div className="mt-4 space-y-3">
                    {RECORDINGS.map(rec => (
                      <button
                        key={rec.id}
                        onClick={() => { setSelectedRecording(rec.id); setClipStart(0); setClipEnd(100); setViewStart(0); setViewEnd(100); setEditorHistory([]); setLiveStep("edit"); setCropGrid(false); setReplayCaption(c => c.trim() ? c : rec.title); }}
                        className="w-full cursor-pointer rounded-2xl bg-gray-100 p-4 text-left transition-colors hover:bg-gray-200/60"
                      >
                        <div className="flex gap-3.5">
                          <div className="relative h-[124px] w-[88px] shrink-0 overflow-hidden rounded-xl bg-black">
                            {/* #t=0.5 makes the browser paint that frame as the thumbnail */}
                            <video src={`${rec.src}#t=0.5`} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                            <span className="absolute bottom-1.5 left-1.5 rounded bg-black/70 px-1 py-0.5 text-[10px] font-semibold text-white">{rec.duration}</span>
                          </div>
                          <div className="flex min-w-0 flex-1 flex-col">
                            <div className="flex items-start gap-2">
                              <div className="min-w-0 flex-1">
                                <p className="line-clamp-2 text-[15px] font-semibold leading-snug text-gray-dark">{rec.title}</p>
                                <p className="mt-1 text-[12px] text-gray-light">{rec.meta}</p>
                              </div>
                              <svg className="mt-1 h-4 w-4 shrink-0 text-gray-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                            </div>
                            {/* Stats hug the bottom edge of the thumbnail; download sits in the card's corner */}
                            <div className="mt-auto flex items-center gap-4 text-[12px] text-gray-light">
                              <span className="flex items-center gap-1.5 whitespace-nowrap text-gray-dark">
                                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                                <span className="text-[13px] font-semibold">{rec.watched}</span>
                              </span>
                              <span className="flex items-center gap-1.5 whitespace-nowrap text-gray-dark">
                                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 8.5-8.5 8.38 8.38 0 0 1 8.5 8.5Z" /></svg>
                                <span className="text-[13px] font-semibold">{rec.chatCount}</span>
                              </span>
                              <span
                                role="button"
                                aria-label="Download recording"
                                onClick={e => {
                                  e.stopPropagation();
                                  const a = document.createElement("a");
                                  a.href = rec.src;
                                  a.download = `${rec.id}-livestream.mp4`;
                                  a.click();
                                }}
                                className="ml-auto cursor-pointer rounded-full p-1 text-gray-light transition-colors hover:bg-white hover:text-gray-dark"
                              >
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15V3" /><path d="m7 10 5 5 5-5" /><path d="M20 17v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2" /></svg>
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <>
                    <p className="mt-4 text-[14px] font-semibold leading-snug text-gray-dark">
                      Highlights cut from your livestreams.
                    </p>
                    <div className="mt-4 space-y-3">
                      <button
                        onClick={() => { setSelectedClip(CAPTION_CLIP.id); setSelectedRecording(null); setReplayCaption(c => c.trim() ? c : CAPTION_CLIP.title); setLiveStep("share"); }}
                        className="w-full cursor-pointer rounded-2xl bg-gray-100 p-4 text-left transition-colors hover:bg-gray-200/60"
                      >
                        <div className="flex gap-3.5">
                          <div className="relative h-[124px] w-[88px] shrink-0 overflow-hidden rounded-xl bg-[#FFD96F] p-2.5">
                            <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#111]/45">Q</p>
                            <p className="mt-0.5 font-serif text-[11px] leading-[1.35] text-[#111]">{CAPTION_CLIP.segments[0].q}</p>
                            <span className="absolute bottom-1.5 left-1.5 rounded bg-black/70 px-1 py-0.5 text-[10px] font-semibold text-white">{CAPTION_CLIP.duration}</span>
                          </div>
                          <div className="flex min-w-0 flex-1 flex-col">
                            <div className="flex items-start gap-2">
                              <div className="min-w-0 flex-1">
                                <p className="line-clamp-2 text-[15px] font-semibold leading-snug text-gray-dark">{CAPTION_CLIP.title}</p>
                                <p className="mt-1 text-[12px] text-gray-light">From {CAPTION_CLIP.from} · Caption clip</p>
                              </div>
                              <svg className="mt-1 h-4 w-4 shrink-0 text-gray-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                            </div>
                            <div className="mt-auto flex items-center gap-1.5 text-[13px]">
                              <svg className="h-3.5 w-3.5 shrink-0 text-gray-dark" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.9 5.7a2 2 0 0 0 1.3 1.3L21 11l-5.8 2a2 2 0 0 0-1.3 1.3L12 20l-1.9-5.7a2 2 0 0 0-1.3-1.3L3 11l5.8-2a2 2 0 0 0 1.3-1.3L12 2z"/></svg>
                              <span className="font-medium text-gray-dark">{CAPTION_CLIP.reason}</span>
                            </div>
                          </div>
                        </div>
                      </button>
                      {CLIPS.map(clip => (
                        <button
                          key={clip.id}
                          onClick={() => { setSelectedClip(clip.id); setClipWindow(15); setClipStart(0); setClipEnd(Math.min(100, (15 / toSeconds(clip.duration)) * 100)); setViewStart(0); setViewEnd(100); setEditorHistory([]); setLiveStep("edit"); setCropGrid(false); setReplayCaption(c => c.trim() ? c : clip.title); }}
                          className="w-full cursor-pointer rounded-2xl bg-gray-100 p-4 text-left transition-colors hover:bg-gray-200/60"
                        >
                          <div className="flex gap-3.5">
                            <div className="relative h-[124px] w-[88px] shrink-0 overflow-hidden rounded-xl bg-black">
                              <video src={`${clip.src}#t=${clip.t}`} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                              <span className="absolute bottom-1.5 left-1.5 rounded bg-black/70 px-1 py-0.5 text-[10px] font-semibold text-white">{clip.duration}</span>
                            </div>
                            <div className="flex min-w-0 flex-1 flex-col">
                              <div className="flex items-start gap-2">
                                <div className="min-w-0 flex-1">
                                  <p className="line-clamp-2 text-[15px] font-semibold leading-snug text-gray-dark">{clip.title}</p>
                                  <p className="mt-1 text-[12px] text-gray-light">From {clip.from}</p>
                                </div>
                                <svg className="mt-1 h-4 w-4 shrink-0 text-gray-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                              </div>
                              <div className="mt-auto flex items-center gap-1.5 text-[13px]">
                                <svg className="h-3.5 w-3.5 shrink-0 text-gray-dark" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.9 5.7a2 2 0 0 0 1.3 1.3L21 11l-5.8 2a2 2 0 0 0-1.3 1.3L12 20l-1.9-5.7a2 2 0 0 0-1.3-1.3L3 11l5.8-2a2 2 0 0 0 1.3-1.3L12 2z"/></svg>
                                <span className="font-medium text-gray-dark">{clip.reason}</span>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )
          ) : liveStep === "edit" ? (
            /* Step 2 — the editor: trim, crop, and what gets burned in */
            (() => {
              const media = selectedClip !== null
                ? (() => { const c = CLIPS.find(x => x.id === selectedClip)!; return { src: c.src, duration: c.duration }; })()
                : selectedRecording === "upload" && uploadedVideo
                  ? { src: uploadedVideo, duration: "1:00" }
                  : (() => { const r = RECORDINGS.find(x => x.id === selectedRecording)!; return { src: r.src, duration: r.duration }; })();
              const total = toSeconds(media.duration);
              // The strip shows a window of the recording; trimming re-fits it.
              const span = Math.max(viewEnd - viewStart, 0.001);
              const toView = (p: number) => ((p - viewStart) / span) * 100;
              const dispStart = toView(clipStart);
              const dispEnd = toView(clipEnd);
              const dispPlay = toView(playheadPct);
              const refitEase = "cubic-bezier(0.22, 1, 0.36, 1)";
              const trimTrans = trimDrag ? undefined : `left 320ms ${refitEase}, width 320ms ${refitEase}`;
              const pushEditorSnap = () => {
                setEditorHistory(h => [...h.slice(-19), { clipStart, clipEnd, viewStart, viewEnd, cropAspect, cropX, cropY, captionsOn, chatOn }]);
              };
              const undoEditor = () => {
                const last = editorHistory[editorHistory.length - 1];
                if (!last) return;
                setClipStart(last.clipStart);
                setClipEnd(last.clipEnd);
                setViewStart(last.viewStart);
                setViewEnd(last.viewEnd);
                setCropAspect(last.cropAspect);
                setCropX(last.cropX);
                setCropY(last.cropY);
                setCaptionsOn(last.captionsOn);
                setChatOn(last.chatOn);
                setEditorHistory(h => h.slice(0, -1));
              };
              const dragHandle = (which: "start" | "end") => (e: React.PointerEvent<HTMLDivElement>) => {
                e.stopPropagation();
                e.currentTarget.setPointerCapture(e.pointerId);
                pushEditorSnap();
                setTrimDrag(which);
                let s = clipStart;
                let en = clipEnd;
                const minGap = Math.max(1.5, span * 0.08);
                const move = (ev: PointerEvent) => {
                  const r = trimTrackRef.current?.getBoundingClientRect();
                  if (!r) return;
                  const view = Math.min(100, Math.max(0, ((ev.clientX - r.left) / r.width) * 100));
                  const full = viewStart + (view / 100) * span;
                  if (which === "start") { s = Math.min(full, en - minGap); setClipStart(s); }
                  else { en = Math.max(full, s + minGap); setClipEnd(en); }
                };
                const up = () => {
                  window.removeEventListener("pointermove", move);
                  window.removeEventListener("pointerup", up);
                  setTrimDrag(null);
                  // Apple-style: the trimmed range re-fits the strip width (with
                  // breathing room) so a short moment stays easy to fine-tune.
                  const pad = Math.max((en - s) * 0.2, 1.5);
                  if (en - s < 94) {
                    setViewStart(Math.max(0, s - pad));
                    setViewEnd(Math.min(100, en + pad));
                  } else {
                    setViewStart(0);
                    setViewEnd(100);
                  }
                };
                window.addEventListener("pointermove", move);
                window.addEventListener("pointerup", up);
              };
              // Drag the film to pan it UNDER the stationary yellow box —
              // view and selection slide together, so the box never moves.
              const dragFilm = (e: React.PointerEvent<HTMLDivElement>) => {
                if (viewEnd - viewStart >= 99.9) return;
                e.currentTarget.setPointerCapture(e.pointerId);
                pushEditorSnap();
                setTrimDrag("move");
                const startX = e.clientX;
                const v0 = viewStart;
                const v1 = viewEnd;
                const s0 = clipStart;
                const len = clipEnd - clipStart;
                const move = (ev: PointerEvent) => {
                  const r = trimTrackRef.current?.getBoundingClientRect();
                  if (!r) return;
                  const dRaw = -((ev.clientX - startX) / r.width) * (v1 - v0);
                  const d = Math.max(-v0, Math.min(100 - v1, dRaw));
                  setViewStart(v0 + d);
                  setViewEnd(v1 + d);
                  setClipStart(s0 + d);
                  setClipEnd(s0 + len + d);
                };
                const up = () => {
                  window.removeEventListener("pointermove", move);
                  window.removeEventListener("pointerup", up);
                  setTrimDrag(null);
                };
                window.addEventListener("pointermove", move);
                window.addEventListener("pointerup", up);
              };
              // True-to-post crop: the stage itself takes the chosen ratio and the
              // oversized video is dragged into place behind it (object-position pan).
              // Pixel dims + a CSS width/height transition resize the box smoothly
              // while object-cover re-crops each frame — no transform stretch.
              const stageW = Math.min(window.innerWidth, 600) - 32;
              const stageDims =
                cropAspect === "16:9" ? { width: stageW, height: (stageW * 9) / 16 }
                : cropAspect === "1:1" ? { width: stageW, height: stageW }
                : cropAspect === "4:5" ? { width: stageW * 0.8, height: stageW }
                : selectedClip !== null ? { width: 256, height: (256 * 13) / 9 }
                : { width: stageW, height: (stageW * 3) / 4 };
              // Tallest possible stage for this media — the box never resizes,
              // only the video inside morphs.
              const stageBoxH = selectedClip !== null ? Math.max((256 * 13) / 9, stageW) : stageW;
              const dragVideo = (e: React.PointerEvent<HTMLDivElement>) => {
                if (!cropGrid) return;
                e.preventDefault();
                pushEditorSnap();
                const box = e.currentTarget.getBoundingClientRect();
                const startX = e.clientX;
                const startY = e.clientY;
                const sx = cropX;
                const sy = cropY;
                const move = (ev: PointerEvent) => {
                  setCropX(Math.min(100, Math.max(0, sx - ((ev.clientX - startX) / box.width) * 130)));
                  setCropY(Math.min(100, Math.max(0, sy - ((ev.clientY - startY) / box.height) * 130)));
                };
                const up = () => {
                  window.removeEventListener("pointermove", move);
                  window.removeEventListener("pointerup", up);
                };
                window.addEventListener("pointermove", move);
                window.addEventListener("pointerup", up);
              };
              const togglePlay = () => {
                const v = editorVideoRef.current;
                if (!v) return;
                if (v.paused) { v.play(); setEditorPlaying(true); }
                else { v.pause(); setEditorPlaying(false); }
              };
              const editorTool = (label: string, icon: React.ReactNode, onTap: () => void, active: boolean) => (
                <button key={label} onClick={onTap} className="flex cursor-pointer flex-col items-center gap-1.5">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-colors ${active ? "bg-gray-dark text-white" : "bg-gray-100 text-gray-dark"}`}>{icon}</span>
                  <span className="text-[11px] font-medium text-gray-dark">{label}</span>
                </button>
              );
              return (
                <div className="flex min-h-0 flex-1 flex-col">
                  {/* Editor chrome */}
                  <div className="flex shrink-0 items-center justify-between px-4 pt-3">
                    <button
                      onClick={() => {
                        setSelectedRecording(null);
                        setSelectedClip(null);
                        if (selectedRecording === "upload") { setUploadedVideo(null); setMode("post"); }
                        else setLiveStep("list");
                      }}
                      aria-label="Back to livestreams"
                      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-dark transition-colors hover:bg-gray-200"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    </button>
                    <button
                      onClick={() => setLiveStep("share")}
                      className="cursor-pointer rounded-full bg-gray-dark px-5 py-2 text-[14px] font-semibold text-white transition-colors hover:bg-[#333]"
                    >
                      Next
                    </button>
                  </div>

                  {/* Fixed-cap spacer keeps the video anchored when crop chips appear */}
                  <div className="max-h-44 min-h-3 flex-1" />

                  {/* Preview — crop chips render below, so toggling never shifts it */}
                  <div className="shrink-0 px-4">
                    <div className="flex items-center justify-center" style={{ height: stageBoxH }}>
                    <div
                      data-crop-stage
                      onPointerDown={dragVideo}
                      className={`relative mx-auto overflow-hidden rounded-xl bg-black ${cropGrid ? "cursor-grab touch-none active:cursor-grabbing" : ""}`}
                      style={{ ...stageDims, transition: `width 350ms ${refitEase}, height 350ms ${refitEase}` }}
                    >
                      <video
                        ref={editorVideoRef}
                        src={media.src}
                        autoPlay
                        muted
                        loop
                        playsInline
                        onTimeUpdate={e => {
                          const v = e.currentTarget;
                          const d = v.duration || 1;
                          const pct = (v.currentTime / d) * 100;
                          // Preview playback loops within the trimmed range.
                          if (pct < clipStart - 0.5 || pct > clipEnd + 0.5) { v.currentTime = (clipStart / 100) * d; return; }
                          setPlayheadPct(pct);
                        }}
                        className="h-full w-full object-cover"
                        style={{ objectPosition: `${cropX}% ${cropY}%` }}
                      />
                      {captionsOn ? (
                        <div className="pointer-events-none absolute inset-x-0 bottom-0">
                          <div className="h-16 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                          <p className="absolute inset-x-0 bottom-2 truncate px-3 text-center text-[12px] font-medium text-white">
                            …one story per bullet, that's the whole trick…
                          </p>
                        </div>
                      ) : null}
                      {chatOn ? (
                        <div className="pointer-events-none absolute left-3 top-3 flex w-[70%] flex-col gap-1">
                          <p className="text-[11px] leading-snug text-white/70 drop-shadow"><span className="font-semibold">priya_t</span> Should I cold email partners?</p>
                          <p className="text-[11px] leading-snug text-white/70 drop-shadow"><span className="font-semibold">jliu_biz</span> This is so useful 🙌</p>
                        </div>
                      ) : null}
                      {cropGrid ? (
                        <div className="pointer-events-none absolute inset-0">
                          <div className="absolute inset-y-0 left-1/3 w-px bg-white/40" />
                          <div className="absolute inset-y-0 left-2/3 w-px bg-white/40" />
                          <div className="absolute inset-x-0 top-1/3 h-px bg-white/40" />
                          <div className="absolute inset-x-0 top-2/3 h-px bg-white/40" />
                        </div>
                      ) : null}
                    </div>
                    </div>
                  </div>

                  {/* Crop aspect chips slide open; everything below eases down */}
                  <AnimatePresence initial={false}>
                    {cropGrid ? (
                      <motion.div
                        key="aspect-chips"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="shrink-0 overflow-hidden"
                      >
                        <div className="flex items-center justify-center gap-2 pb-1 pt-4">
                          {(["Original", "16:9", "1:1", "4:5"] as const).map(a => (
                            <button
                              key={a}
                              onClick={() => { pushEditorSnap(); setCropAspect(a); setCropX(50); setCropY(50); }}
                              className={`cursor-pointer rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${
                                cropAspect === a ? "bg-gray-dark text-white" : "bg-gray-100 text-gray-dark hover:bg-gray-200"
                              }`}
                            >
                              {a}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  <div className="min-h-3 flex-1" />

                  {selectedClip !== null ? (
                    (() => {
                      const winPct = Math.min(100, (clipWindow / total) * 100);
                      const stripPct = Math.max((total / clipWindow) * 58, 58);
                      const nTiles = Math.min(24, Math.max(6, Math.round((total / clipWindow) * 3)));
                      const progress = Math.min(100, Math.max(0, ((playheadPct - clipStart) / Math.max(clipEnd - clipStart, 0.001)) * 100));
                      const dragStrip = (e: React.PointerEvent<HTMLDivElement>) => {
                        if (e.pointerType !== "mouse") return;
                        const el = e.currentTarget;
                        const startX = e.clientX;
                        const startScroll = el.scrollLeft;
                        const move = (ev: PointerEvent) => { el.scrollLeft = startScroll - (ev.clientX - startX); };
                        const up = () => {
                          window.removeEventListener("pointermove", move);
                          window.removeEventListener("pointerup", up);
                        };
                        window.addEventListener("pointermove", move);
                        window.addEventListener("pointerup", up);
                      };
                      return (
                        <>
                          {/* Stories-style transport: pause left, progress through the window, length right */}
                          <div className="flex shrink-0 items-center gap-3 px-6 pb-3">
                            <button
                              onClick={togglePlay}
                              aria-label={editorPlaying ? "Pause" : "Play"}
                              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-dark transition-colors hover:bg-gray-200"
                            >
                              {editorPlaying ? (
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
                              ) : (
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z" /></svg>
                              )}
                            </button>
                            <div className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-gray-stroke">
                              <div className="absolute inset-y-0 left-0 rounded-full bg-[#FFD60A]" style={{ width: `${progress}%` }} />
                            </div>
                            <button
                              onClick={() => setClipLenOpen(true)}
                              aria-label="Clip length"
                              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-[11px] font-bold tabular-nums text-gray-dark transition-colors hover:bg-gray-200"
                            >
                              {toClock(clipWindow)}
                            </button>
                          </div>
                          {/* The yellow window stays put — drag the film underneath it */}
                          <div className="shrink-0 px-6 pb-3">
                            <div className="relative">
                              <div
                                onPointerDown={dragStrip}
                                onScroll={e => {
                                  const scroller = e.currentTarget;
                                  const strip = scroller.querySelector("[data-strip]") as HTMLElement | null;
                                  if (!strip) return;
                                  const startPct = Math.max(0, Math.min(100 - winPct, (scroller.scrollLeft / strip.offsetWidth) * 100));
                                  setClipStart(startPct);
                                  setClipEnd(Math.min(100, startPct + winPct));
                                }}
                                className="h-14 cursor-grab touch-pan-x overflow-x-auto active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                              >
                                <div className="flex h-full items-stretch">
                                  <div style={{ flex: "0 0 21%" }} />
                                  <div data-strip className="flex h-full overflow-hidden rounded-xl bg-gray-100" style={{ flex: `0 0 ${stripPct}%` }}>
                                    {Array.from({ length: nTiles }, (_, i) => (
                                      <video
                                        key={i}
                                        src={`${media.src}#t=${Math.max(0.5, ((i + 0.5) / nTiles) * total).toFixed(1)}`}
                                        muted
                                        playsInline
                                        preload="metadata"
                                        className="h-full min-w-0 flex-1 object-cover"
                                      />
                                    ))}
                                  </div>
                                  <div style={{ flex: "0 0 21%" }} />
                                </div>
                              </div>
                              <div className="pointer-events-none absolute inset-y-0 left-1/2 w-[58%] -translate-x-1/2 rounded-xl border-[3px] border-[#FFD60A]" />
                            </div>
                          </div>
                        </>
                      );
                    })()
                  ) : (
                  <>
                  {/* Engagement — SoundCloud-style columns, windowed to the zoom; bars darken as the playhead passes */}
                  <div className="shrink-0 pl-[72px] pr-5">
                    {/* Bars resample to the zoom window: constant column width, more
                        detail as you zoom — never stretched. */}
                    <div className="flex h-9 w-full items-end gap-[2px]">
                      {Array.from({ length: 64 }, (_, i) => {
                        const t = (viewStart + ((i + 0.5) / 64) * span) / 100;
                        const peak = (c: number, w: number) => Math.exp(-((t - c) * (t - c)) / (2 * w * w));
                        // Jitter keys off the moment in the video, so bars stay put across zooms.
                        const q = Math.round(t * 200);
                        const jitter = 0.55 + 0.45 * Math.abs((Math.sin(q * 12.9898 + 4.1) * 43758.5453) % 1);
                        const h = Math.max(0.08, Math.min(1, (0.2 + 0.85 * peak(0.15, 0.05) + 0.7 * peak(0.66, 0.045) + 0.12 * peak(0.42, 0.18)) * jitter));
                        return (
                          <div
                            key={i}
                            className="min-w-0 flex-1 rounded-full"
                            style={{ height: `${h * 100}%`, backgroundColor: t <= playheadPct / 100 ? "#555555" : "#DEDEDE" }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Play sits beside the strip, Apple Photos style */}
                  <div className="flex shrink-0 items-center gap-2 px-5 pb-4 pt-1">
                    <button
                      onClick={togglePlay}
                      aria-label={editorPlaying ? "Pause" : "Play"}
                      className="flex h-14 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-gray-100 text-gray-dark transition-colors hover:bg-gray-200"
                    >
                      {editorPlaying ? (
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
                      ) : (
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z" /></svg>
                      )}
                    </button>
                    <div ref={trimTrackRef} onPointerDown={dragFilm} className="relative h-14 flex-1 cursor-grab touch-none select-none active:cursor-grabbing">
                      <div className="absolute inset-x-0 inset-y-[3px] flex overflow-hidden rounded-xl bg-gray-100">
                        {[0, 1, 2, 3, 4, 5].map(i => (
                          <video
                            key={i}
                            src={`${media.src}#t=${Math.max(0.5, ((viewStart + ((i + 0.5) / 6) * span) / 100) * total).toFixed(1)}`}
                            muted
                            playsInline
                            preload="metadata"
                            className="h-full w-1/6 object-cover"
                          />
                        ))}
                      </div>
                      <div className="pointer-events-none absolute inset-y-[3px] left-0 rounded-l-xl bg-white/70" style={{ width: `${dispStart}%`, transition: trimTrans }} />
                      <div className="pointer-events-none absolute inset-y-[3px] right-0 rounded-r-xl bg-white/70" style={{ width: `${100 - dispEnd}%`, transition: trimTrans }} />
                      <div
                        className="pointer-events-none absolute inset-y-0 border-y-[3px] border-[#FFD60A]"
                        style={{ left: `calc(${dispStart}% + 20px)`, width: `calc(${dispEnd - dispStart}% - 40px)`, transition: trimTrans }}
                      />
                      {dispPlay >= dispStart && dispPlay <= 100 ? (
                        <div
                          className="pointer-events-none absolute inset-y-[-3px] z-20 w-[3px] rounded-full bg-white"
                          style={{ left: `${dispPlay}%`, boxShadow: "0 0 3px rgba(0,0,0,0.45)" }}
                        />
                      ) : null}
                      <div
                        onPointerDown={dragHandle("start")}
                        className="absolute inset-y-0 z-10 flex w-[20px] cursor-ew-resize items-center justify-center rounded-l-xl bg-[#FFD60A]"
                        style={{ left: `${dispStart}%`, transition: trimTrans }}
                      >
                        <svg className="h-3.5 w-3.5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                      </div>
                      <div
                        onPointerDown={dragHandle("end")}
                        className="absolute inset-y-0 z-10 flex w-[20px] cursor-ew-resize items-center justify-center rounded-r-xl bg-[#FFD60A]"
                        style={{ left: `calc(${dispEnd}% - 20px)`, transition: trimTrans }}
                      >
                        <svg className="h-3.5 w-3.5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                      </div>
                      {/* Trim time pops up over the handle being dragged */}
                      {trimDrag && trimDrag !== "move" ? (
                        <div
                          className="pointer-events-none absolute -top-9 z-20 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-dark px-2 py-1 text-[11px] font-semibold tabular-nums text-white"
                          style={{ left: `${Math.min(96, Math.max(4, trimDrag === "start" ? dispStart : dispEnd))}%` }}
                        >
                          {toClock(((trimDrag === "start" ? clipStart : clipEnd) / 100) * total)}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  </>
                  )}

                  {/* What gets burned into the post */}
                  <div className="flex shrink-0 items-start justify-center gap-7 px-5 pb-[max(env(safe-area-inset-bottom),80px)] pt-4">
                    {editorTool("Crop", <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2v14a2 2 0 0 0 2 2h14" /><path d="M18 22V8a2 2 0 0 0-2-2H2" /></svg>, () => setCropGrid(v => !v), cropGrid)}
                    {editorTool("Captions", <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="3" /><path d="M6 14h6" /><path d="M15 14h3" /><path d="M6 10h3" /><path d="M12 10h6" /></svg>, () => { pushEditorSnap(); setCaptionsOn(v => !v); }, captionsOn)}
                    {editorTool("Comments", <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 8.5-8.5 8.38 8.38 0 0 1 8.5 8.5Z" /></svg>, () => { pushEditorSnap(); setChatOn(v => !v); }, chatOn)}
                    <button
                      onClick={undoEditor}
                      disabled={editorHistory.length === 0}
                      className={`flex flex-col items-center gap-1.5 ${editorHistory.length ? "cursor-pointer" : "opacity-35"}`}
                    >
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-dark">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" /></svg>
                      </span>
                      <span className="text-[11px] font-medium text-gray-dark">Undo</span>
                    </button>
                  </div>
                </div>
              );
            })()
          ) : (
            /* Step 3 — caption + exactly the card that lands in the feed */
            (() => {
              const captionSel = selectedClip === CAPTION_CLIP.id;
              const clip = selectedClip !== null && !captionSel ? CLIPS.find(c => c.id === selectedClip)! : null;
              const isUpload = selectedRecording === "upload" && uploadedVideo !== null;
              const rec = RECORDINGS.find(r => r.id === selectedRecording) ?? RECORDINGS[0];
              const srcV = clip ? clip.src : isUpload ? uploadedVideo! : rec.src;
              const durV = clip ? clip.duration : isUpload ? "1:00" : rec.duration;
              return (
                <div className="flex-1 overflow-y-auto px-4 pt-3 pb-6">
                  <div className="flex items-center gap-3">
                    <img src={profilePhoto} alt="You" className="h-10 w-10 rounded-full object-cover" />
                    <span className="text-[16px] font-semibold text-gray-dark">{SELF.author}</span>
                  </div>
                  <textarea
                    autoFocus
                    ref={replayCaptionRef}
                    value={replayCaption}
                    onChange={e => { setReplayCaption(e.target.value); autoGrow(e); }}
                    placeholder="Say something about this replay…"
                    rows={1}
                    className="zoom-ok mt-3 w-full resize-none text-[19px] leading-[1.45] text-gray-dark outline-none placeholder:text-gray-light"
                  />
                  {captionSel ? (
                    <div className="mt-3 w-[290px] overflow-hidden rounded-xl">
                      <CaptionClip segments={CAPTION_CLIP.segments} className="aspect-[4/5] w-full" />
                    </div>
                  ) : clip || cropAspect === "9:16" ? (
                    <div className="relative mt-3 w-[230px] overflow-hidden rounded-xl bg-black">
                      <video src={srcV} autoPlay muted loop playsInline className={`${cropAspect === "9:16" ? "aspect-[9/16]" : "aspect-[9/13]"} w-full object-cover`} style={{ objectPosition: `${cropX}% ${cropY}%` }} />
                      <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-full bg-black/25 px-2 py-1 backdrop-blur-sm">
                        <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>
                        <span className="text-[11px] font-medium text-white">{durV}</span>
                      </div>
                    </div>
                  ) : (
                    <LiveReplayCard
                      static
                      postId={0}
                      live={{ title: isUpload ? (replayCaption.trim() || "New video") : rec.title, videoId: "1cfIAVasP6E", videoSrc: srcV, viewers: 0, topic: isUpload ? "Video" : "Replay", replay: true, duration: durV, horizontal: true, showCaptions: captionsOn, showChat: chatOn, peakViewers: isUpload ? undefined : rec.peak, cropAspect, cropX, cropY }}
                    />
                  )}
                </div>
              );
            })()
          )
        ) : null}

        {mode === "golive" ? (
          <>
            <div className="flex-1 overflow-y-auto px-4 pt-3 pb-6">
              <input
                autoFocus
                value={goLiveTitle}
                onChange={e => setGoLiveTitle(e.target.value)}
                placeholder="What are you going live about?"
                className="zoom-ok w-full text-[18px] font-semibold leading-snug text-gray-dark outline-none placeholder:font-normal placeholder:text-gray-light"
              />
              {/* Camera preview — stands in for getUserMedia in the prototype */}
              <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-2xl bg-black">
                <video src="/videos/sabrina.mp4" autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 backdrop-blur-sm">
                  <span className="text-[10px] font-semibold tracking-wide text-white">CAMERA PREVIEW</span>
                </div>
              </div>
              <p className="mt-3 text-[13px] leading-snug text-gray-light">
                Going live posts to the feed immediately — your followers get notified and can join with one tap.
              </p>
            </div>
          </>
        ) : null}
      </motion.div>

      {/* Clip length sheet — minutes + seconds wheels */}
      <AnimatePresence>
        {clipLenOpen ? (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setClipLenOpen(false)} className="fixed inset-0 z-[70] bg-black/40" />
            <ClipLengthSheet
              seconds={clipWindow}
              maxSeconds={selectedClip !== null ? toSeconds(CLIPS.find(c => c.id === selectedClip)!.duration) : 60}
              onClose={() => setClipLenOpen(false)}
              onDone={s => {
                const clip = CLIPS.find(c => c.id === selectedClip);
                const total = clip ? toSeconds(clip.duration) : 60;
                const wp = Math.min(100, (s / total) * 100);
                const st = Math.max(0, Math.min(clipStart, 100 - wp));
                setClipWindow(s);
                setClipStart(st);
                setClipEnd(Math.min(100, st + wp));
                setClipLenOpen(false);
              }}
            />
          </>
        ) : null}
      </AnimatePresence>

      {/* Schedule sheet — calendar picker */}
      <AnimatePresence>
        {scheduleOpen ? (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setScheduleOpen(false)} className="fixed inset-0 z-[70] bg-black/40" />
            <CalendarSheet
              onSave={label => {
                setScheduleOpen(false);
                if (canSubmit) {
                  scheduledStore.unshift({ id: Date.now(), mode, snippet: mode === "article" ? title.trim() : text.trim(), scheduledFor: label, editedAt: Date.now(), text, title, subtitle, topic, poll: pollOptions, articleHtml });
                  dismiss();
                  onScheduled?.();
                } else {
                  setScheduledFor(label);
                }
              }}
              onClose={() => setScheduleOpen(false)}
            />
          </>
        ) : null}
      </AnimatePresence>

      {/* Link sheet */}
      <AnimatePresence>
        {linkOpen ? (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLinkOpen(false)} className="fixed inset-0 z-[70] bg-black/40" />
            <motion.div
              initial={{ y: "110%" }} animate={{ y: 0 }} exit={{ y: "110%" }} transition={{ type: "spring", stiffness: 380, damping: 38 }}
              className="fixed inset-x-0 bottom-0 z-[71] mx-auto max-w-[600px] rounded-t-3xl bg-white px-5 pb-[max(env(safe-area-inset-bottom),20px)] pt-1"
            >
              <div className="mx-auto mb-3 mt-2 h-1 w-10 rounded-full bg-gray-stroke" />
              <p className="text-[16px] font-semibold text-gray-dark">Add link</p>
              <input
                autoFocus
                value={linkUrl}
                onChange={e => setLinkUrl(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") insertLink(); }}
                placeholder="https://…"
                className="mt-3 w-full rounded-xl border border-gray-stroke px-3.5 py-2.5 text-[15px] text-gray-dark outline-none transition-[border] focus:border-gray-dark"
              />
              <button
                onClick={insertLink}
                disabled={!linkUrl.trim()}
                className="mt-3 w-full cursor-pointer rounded-full bg-gray-dark py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#333] disabled:cursor-default disabled:opacity-35"
              >
                Insert link
              </button>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      {/* Drafts + scheduled sheet */}
      <AnimatePresence>
        {draftsOpen ? (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDraftsOpen(false)} className="fixed inset-0 z-[70] bg-black/40" />
            <motion.div
              initial={{ y: "110%" }} animate={{ y: 0 }} exit={{ y: "110%" }} transition={{ type: "spring", stiffness: 380, damping: 38 }}
              className="fixed inset-x-0 bottom-0 top-14 z-[71] mx-auto flex max-w-[600px] flex-col rounded-t-3xl bg-white"
            >
              <div className="mx-auto mb-3 mt-2 h-1 w-10 rounded-full bg-gray-stroke" />
              <div className="relative flex h-11 shrink-0 items-center justify-center px-5">
                <button onClick={() => setDraftsOpen(false)} className="absolute left-5 cursor-pointer text-[15px] text-gray-light transition-colors hover:text-gray-dark">Cancel</button>
                <p className="text-[16px] font-semibold text-gray-dark">Drafts</p>
              </div>
              <div className="shrink-0 px-5 pb-3">
                <div className="flex rounded-full bg-gray-100 p-1">
                  {DRAFT_TABS.map(tab => (
                    <button
                      key={tab}
                      onClick={() => { setDraftsTab(tab); }}
                      className="relative flex-1 cursor-pointer rounded-full py-2.5 text-[14px] font-semibold"
                    >
                      {draftsTab === tab ? (
                        <motion.span
                          layoutId="draftsTabPill"
                          transition={{ type: "spring", stiffness: 520, damping: 42 }}
                          className="absolute inset-0 rounded-full bg-white"
                        />
                      ) : null}
                      <span className={`relative z-10 transition-colors ${draftsTab === tab ? "text-gray-dark" : "text-gray-light"}`}>{tab}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-5 pb-[max(env(safe-area-inset-bottom),20px)]">
                <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={draftsTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.13, ease: "easeOut" }}
                >
                {draftsTab !== "Scheduled" ? (
                  tabDrafts.length > 0 ? (
                    <div className="space-y-2">
                      {tabDrafts.map(d => (
                        <div key={d.id} className="flex items-center gap-3 rounded-2xl bg-gray-100 px-4 py-3.5 transition-colors hover:bg-gray-200/60">
                          <button onClick={() => loadDraft(d)} className="min-w-0 flex-1 cursor-pointer text-left">
                            <p className="truncate text-[15px] font-semibold text-gray-dark">
                              {d.title || d.text || RECORDINGS.find(r => r.id === d.topic)?.title || stripHtml(d.articleHtml) || "Untitled"}
                            </p>
                            <p className="mt-0.5 text-[12px] text-gray-light">
                              {editedLabel(d.editedAt)}{d.mode === "live" ? " · Live" : d.mode === "article" ? " · Article" : ""}
                            </p>
                          </button>
                          <button
                            onClick={() => setConfirmTrash({ kind: "draft", id: d.id })}
                            aria-label="Delete draft"
                            className="shrink-0 cursor-pointer rounded-full p-2 text-[#D6204C] transition-colors hover:bg-red-50"
                          >
                            <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center px-8 pb-8 pt-12 text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                        <svg className="h-6 w-6 text-gray-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                      </div>
                      <p className="mt-4 font-serif text-[20px] leading-tight text-gray-dark">No drafts</p>
                      <p className="mt-2 max-w-[260px] text-[13px] leading-[1.5] text-gray-light">
                        Half-formed thoughts are welcome. Posts and articles you save land here.
                      </p>
                      <button
                        onClick={() => { setDraftsOpen(false); setMode("post"); }}
                        className="mt-5 cursor-pointer rounded-full bg-gray-dark px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#333]"
                      >
                        Write a post
                      </button>
                    </div>
                  )
                ) : scheduledStore.length > 0 ? (
                  <div className="space-y-2">
                    {scheduledStore.map(s => (
                      <div key={s.id} onClick={() => loadScheduled(s)} className="flex cursor-pointer items-center gap-3 rounded-2xl bg-gray-100 px-4 py-3.5 transition-colors hover:bg-gray-200/60">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[15px] font-semibold text-gray-dark">{s.snippet || "Untitled"}</p>
                          <p className="mt-0.5 text-[12px] text-gray-light">{s.mode === "article" ? "Article · " : ""}Posts {s.scheduledFor}</p>
                        </div>
                        <button
                          onClick={e => { e.stopPropagation(); setConfirmTrash({ kind: "scheduled", id: s.id }); }}
                          aria-label="Unschedule"
                          className="shrink-0 cursor-pointer rounded-full p-2 text-[#D6204C] transition-colors hover:bg-red-50"
                        >
                          <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center px-8 pb-8 pt-12 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                      <svg className="h-6 w-6 text-gray-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
                    </div>
                    <p className="mt-4 font-serif text-[20px] leading-tight text-gray-dark">Nothing scheduled</p>
                    <p className="mt-2 max-w-[260px] text-[13px] leading-[1.5] text-gray-light">
                      Write once, post at the right moment.
                    </p>
                    <button
                      onClick={() => { setDraftsOpen(false); setScheduleOpen(true); }}
                      className="mt-5 cursor-pointer rounded-full bg-gray-dark px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#333]"
                    >
                      Schedule a post
                    </button>
                  </div>
                )}
                </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      {/* Delete / unschedule confirmation */}
      <AnimatePresence>
        {confirmTrash ? (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setConfirmTrash(null)} className="fixed inset-0 z-[72] bg-black/40" />
            <div className="pointer-events-none fixed inset-0 z-[73] flex items-center justify-center px-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 480, damping: 32 }}
                className="pointer-events-auto w-full max-w-[300px] rounded-2xl bg-white p-5 text-center"
                style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.18)" }}
              >
                <p className="text-[16px] font-semibold text-gray-dark">
                  {confirmTrash.kind === "draft" ? "Delete this draft?" : "Unschedule this post?"}
                </p>
                <p className="mt-1 text-[13px] leading-snug text-gray-light">
                  {confirmTrash.kind === "draft" ? "This can't be undone." : "It moves out of the queue and won't post."}
                </p>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => setConfirmTrash(null)} className="flex-1 cursor-pointer rounded-full bg-gray-100 py-2.5 text-[14px] font-semibold text-gray-dark transition-colors hover:bg-gray-200">
                    Keep it
                  </button>
                  <button
                    onClick={() => {
                      if (confirmTrash.kind === "draft") {
                        const d = draftStore.find(x => x.id === confirmTrash.id);
                        if (d) draftStore.splice(draftStore.indexOf(d), 1);
                      } else {
                        const s = scheduledStore.find(x => x.id === confirmTrash.id);
                        if (s) scheduledStore.splice(scheduledStore.indexOf(s), 1);
                      }
                      setStoreVersion(v => v + 1);
                      setConfirmTrash(null);
                    }}
                    className="flex-1 cursor-pointer rounded-full bg-[#D6204C] py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#b81b41]"
                  >
                    {confirmTrash.kind === "draft" ? "Delete" : "Unschedule"}
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        ) : null}
      </AnimatePresence>

      {/* Discard / save draft */}
      <AnimatePresence>
        {discardOpen ? (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDiscardOpen(false)} className="fixed inset-0 z-[70] bg-black/40" />
            <motion.div
              initial={{ y: "110%" }} animate={{ y: 0 }} exit={{ y: "110%" }} transition={{ type: "spring", stiffness: 380, damping: 38 }}
              className="fixed inset-x-0 bottom-0 z-[71] mx-auto max-w-[600px] rounded-t-3xl bg-white px-4 pb-[max(env(safe-area-inset-bottom),16px)] pt-1"
            >
              <div className="mx-auto mb-3 mt-2 h-1 w-10 rounded-full bg-gray-stroke" />
              <button onClick={saveDraft} className="w-full cursor-pointer rounded-full bg-gray-dark py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#333]">
                Save draft
              </button>
              <button onClick={() => { setDiscardOpen(false); dismiss(); }} className="mt-2 w-full cursor-pointer rounded-full bg-gray-100 py-3 text-[15px] font-semibold text-red-500 transition-colors hover:bg-gray-200">
                Discard
              </button>
              <button onClick={() => setDiscardOpen(false)} className="mt-1 w-full cursor-pointer rounded-full py-3 text-[15px] font-medium text-gray-dark">
                Keep editing
              </button>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
