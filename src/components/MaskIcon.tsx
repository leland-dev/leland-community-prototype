// Renders a (pre-colored) SVG asset as a mask filled with the current text
// color, so icons from the assets folder inherit color/hover like inline SVGs.
export default function MaskIcon({ src, className = "h-6 w-6" }: { src: string; className?: string }) {
  return (
    <span
      aria-hidden
      // inline-block so width/height apply even when the parent isn't a flex
      // container (a plain inline <span> ignores h-*/w-*).
      className={`inline-block bg-current ${className}`}
      style={{
        maskImage: `url("${src}")`,
        WebkitMaskImage: `url("${src}")`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}
