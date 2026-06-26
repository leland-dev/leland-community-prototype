// Quick-reaction strip — emoji only. Raise hand lives on the video's
// StageControls now, so this bar is just the affordance for "throw a
// reaction over the player". Each tap fires `onReact` and the parent
// pushes a new entry onto the FloatingReactions queue.

const QUICK_REACTIONS = ["👍", "🎉", "❤️", "😂", "🤯", "🙌"];

type Props = {
  onReact: (emoji: string) => void;
};

export default function ReactionBar({ onReact }: Props) {
  return (
    <div className="flex shrink-0 items-center gap-1 border-t border-gray-stroke bg-white px-3 py-2">
      {QUICK_REACTIONS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onReact(emoji)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[16px] transition-transform hover:bg-gray-hover active:scale-90"
          aria-label={`React with ${emoji}`}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
