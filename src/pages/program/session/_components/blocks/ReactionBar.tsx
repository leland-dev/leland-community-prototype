import { Hand } from "lucide-react";

// Quick-reaction strip + raise-hand toggle. Sits above the chat input in V5.
// Emoji taps fire `onReact` which the parent uses to push a new reaction onto
// the FloatingReactions queue. Raise-hand is a sticky toggle — once raised it
// stays raised until the student taps again, so the coach can see them in
// the queue (in a real impl this would post to a stage-request endpoint).

const QUICK_REACTIONS = ["👍", "🎉", "❤️", "😂", "🤯", "🙌"];

type Props = {
  onReact: (emoji: string) => void;
  handRaised: boolean;
  onToggleHand: () => void;
};

export default function ReactionBar({ onReact, handRaised, onToggleHand }: Props) {
  return (
    <div className="flex shrink-0 items-center gap-1 border-t border-gray-stroke bg-white px-3 py-2">
      {QUICK_REACTIONS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onReact(emoji)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[18px] transition-transform hover:bg-gray-hover active:scale-90"
          aria-label={`React with ${emoji}`}
        >
          {emoji}
        </button>
      ))}

      <span className="mx-1 h-5 w-px shrink-0 bg-gray-stroke" />

      <button
        type="button"
        onClick={onToggleHand}
        aria-pressed={handRaised}
        className={`flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold transition-colors ${
          handRaised
            ? "bg-[#038561] text-white hover:bg-[#038561]/90"
            : "bg-gray-hover text-gray-dark hover:bg-[#ebebeb]"
        }`}
      >
        <Hand size={15} strokeWidth={2.25} />
        {handRaised ? "Lower" : "Raise hand"}
      </button>
    </div>
  );
}
