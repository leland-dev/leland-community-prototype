import { useEffect, useRef, useState } from "react";
import pic2 from "../../../../../assets/profile photos/pic-2.png";
import pic3 from "../../../../../assets/profile photos/pic-3.png";
import pic4 from "../../../../../assets/profile photos/pic-4.png";
import pic5 from "../../../../../assets/profile photos/pic-5.png";
import pic6 from "../../../../../assets/profile photos/pic-6.png";
import pic8 from "../../../../../assets/profile photos/pic-8.png";

// Social-proof toasts that pop in during the session: "X just booked
// coaching with {coach}". Stacks up to 3, oldest fades out first.
// Demo-fires every ~22–34s after an initial delay. In a real impl this
// would subscribe to a "session_purchases" stream for the coach.

type Toast = {
  id: string;
  name: string;
  avatar: string;
};

const BUYERS: { name: string; avatar: string }[] = [
  { name: "Sarah C.", avatar: pic3 },
  { name: "Marcus L.", avatar: pic4 },
  { name: "Priya N.", avatar: pic5 },
  { name: "Jordan T.", avatar: pic6 },
  { name: "Anya P.", avatar: pic2 },
  { name: "David M.", avatar: pic8 },
];

type Props = {
  coachName: string;
  /** Where to anchor the stack on the video. Defaults to bottom-left,
   *  above the StageControls bar. */
  position?: "bottom-left" | "bottom-right";
};

let toastSeq = 0;

export default function PurchaseToasts({ coachName, position = "bottom-left" }: Props) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const fire = () => {
      const buyer = BUYERS[Math.floor(Math.random() * BUYERS.length)];
      const id = `pt-${++toastSeq}`;
      setToasts((prev) => [{ id, ...buyer }, ...prev].slice(0, 3));
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 7000);
      timerRef.current = window.setTimeout(fire, 22000 + Math.random() * 12000);
    };
    timerRef.current = window.setTimeout(fire, 6000);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const anchor =
    position === "bottom-right"
      ? "bottom-20 right-4 items-end"
      : "bottom-20 left-4 items-start";

  return (
    <div className={`pointer-events-none absolute z-30 flex flex-col gap-2 ${anchor}`}>
      {toasts.map((t) => (
        <ToastCard key={t.id} toast={t} coachName={coachName} />
      ))}
      <style>{`
        @keyframes purchaseToastIn {
          0%   { transform: translateX(-12px); opacity: 0; }
          100% { transform: translateX(0);     opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function ToastCard({ toast, coachName }: { toast: Toast; coachName: string }) {
  return (
    <div
      className="pointer-events-auto flex items-center gap-3 rounded-full bg-black/80 py-1.5 pl-1.5 pr-1.5 text-white shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur-md"
      style={{ animation: "purchaseToastIn 280ms ease-out both" }}
    >
      <img src={toast.avatar} alt="" className="h-7 w-7 rounded-full object-cover" />
      <div className="text-[12px] leading-tight">
        <span className="font-semibold">{toast.name}</span>
        <span className="text-white/80"> just booked coaching with </span>
        <span className="font-semibold">{coachName}</span>
      </div>
      <a
        href="#"
        className="ml-1 shrink-0 rounded-full bg-[#038561] px-3 py-1.5 text-[11px] font-semibold text-white no-underline transition-colors hover:bg-[#038561]/90"
      >
        Book yours
      </a>
    </div>
  );
}
