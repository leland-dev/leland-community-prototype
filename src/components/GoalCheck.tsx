// The two check shapes used across the goal screens: routines get a circle,
// one-off tasks and projects get a rounded square. Unchecked is a 1.5px
// #949494 ring on white; checked is an ink fill with a white tick.

const RADIUS = { circle: "rounded-full", square: "rounded-md", squareSm: "rounded-[5px]" };

type GoalCheckProps = {
  checked: boolean;
  onChange: () => void;
  shape?: keyof typeof RADIUS;
  size?: number;
  label: string;
};

export default function GoalCheck({ checked, onChange, shape = "square", size = 20, label }: GoalCheckProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      style={{ width: size, height: size }}
      className={`flex shrink-0 items-center justify-center border-[1.5px] p-0 transition-colors ${RADIUS[shape]} ${
        checked ? "border-gray-dark bg-gray-dark" : "border-[#949494] bg-white hover:border-gray-dark"
      }`}
    >
      <svg
        width={size * 0.6}
        height={size * 0.6}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className={checked ? "opacity-100" : "opacity-0"}
      >
        <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
