import { useState } from "react";

type CopyPromptButtonProps = {
  prompt: string;
  onCopy?: () => void;
};

// A prompt box with an inline Copy button that flips to "Copied" for 1.2s —
// mirrors the source's copyPrompt() helper.
export function CopyPromptButton({ prompt, onCopy }: CopyPromptButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(prompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
    onCopy?.();
  };

  return (
    <div className="flex items-start gap-3 rounded-lg border border-leland-gray-stroke bg-white px-4 py-3">
      <span className="min-w-0 flex-1 leland-paragraph-sm text-leland-gray-light">
        {prompt}
      </span>
      <button
        type="button"
        onClick={handleCopy}
        className="shrink-0 leland-paragraph-sm font-semibold text-leland-gray-dark underline decoration-dotted underline-offset-4 hover:text-leland-gray-light focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
