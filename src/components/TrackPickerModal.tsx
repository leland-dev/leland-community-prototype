import openAiLogo from "../assets/org-logos/openai.png";
import anthropicLogo from "../assets/org-logos/Anthropic.jpg";
import {
  Modal,
  ModalContent,
  ModalSize,
  withModal,
  type ModalProps,
} from "./leland";

export type CourseTrack = "claude" | "codex" | "gemini" | "copilot";
export const TRACK_STORAGE_KEY = "course-track";

const TRACKS: { id: CourseTrack; label: string; maker: string }[] = [
  { id: "claude", label: "Claude", maker: "Anthropic" },
  { id: "codex", label: "Codex", maker: "OpenAI" },
  { id: "gemini", label: "Gemini", maker: "Google" },
  { id: "copilot", label: "Copilot", maker: "Microsoft" },
];

export function getLogoSrc(id: CourseTrack): string {
  const base = import.meta.env.BASE_URL;
  switch (id) {
    case "claude": return anthropicLogo;
    case "codex": return openAiLogo;
    case "gemini": return `${base}logo-gemini.webp`;
    case "copilot": return `${base}logo-copilot.jpg`;
  }
}

const TrackPickerModalImpl = ({
  open,
  onOpenChange,
  onSelect,
  currentTrack,
}: ModalProps & {
  onSelect: (track: CourseTrack) => void;
  currentTrack?: CourseTrack | null;
}) => {
  const handlePick = (track: CourseTrack) => {
    localStorage.setItem(TRACK_STORAGE_KEY, track);
    onSelect(track);
    onOpenChange?.(false);
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size={ModalSize.SMALL}>
        <div className="flex flex-col gap-6 p-6 md:p-8">
          <div className="flex flex-col gap-2">
            <h2 className="leland-heading-2xl font-semibold text-leland-gray-dark">
              Choose your AI track
            </h2>
            <p className="leland-heading-lg text-leland-gray-extra-light">
              Select the AI tool you'll be building with in this course.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {TRACKS.map(({ id, label, maker }) => {
              const selected = currentTrack === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handlePick(id)}
                  className={`flex w-full items-center gap-4 rounded-xl px-4 py-4 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary ${
                    selected
                      ? "border-2 border-leland-gray-dark bg-white"
                      : "border border-leland-gray-stroke bg-white hover:bg-leland-gray-hover"
                  }`}
                >
                  <img
                    src={getLogoSrc(id)}
                    alt={label}
                    className="size-8 shrink-0 rounded-lg object-cover"
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="leland-heading-lg font-semibold text-leland-gray-dark">{label}</span>
                    <span className="leland-paragraph-base text-leland-gray-extra-light">{maker}</span>
                  </div>
                  <div
                    className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${
                      selected
                        ? "border-leland-gray-dark bg-leland-gray-dark"
                        : "border-leland-gray-stroke bg-white"
                    }`}
                  >
                    {selected ? <div className="size-2 rounded-full bg-white" /> : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export const TrackPickerModal = withModal(TrackPickerModalImpl);
