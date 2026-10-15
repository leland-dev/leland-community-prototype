// Organization logo (`circle` matches the round profile photo in nav menus), falling back to a monogram tile when none was uploaded.
export function TeamLogo({ name, logo, size = 20, circle = false }: { name: string; logo?: string; size?: number; circle?: boolean }) {
  const style = { width: size, height: size };
  const shape = circle ? "rounded-full" : "rounded-md";
  if (logo) {
    return <img src={logo} alt="" style={style} className={`shrink-0 bg-white ${shape} ${circle ? "object-cover" : "object-contain"}`} />;
  }
  return (
    <span
      style={{ ...style, fontSize: Math.max(10, size * 0.42) }}
      className={`flex shrink-0 items-center justify-center ${shape} bg-[#222222] font-semibold leading-none text-white`}
      aria-hidden
    >
      {name.trim().charAt(0).toUpperCase() || "T"}
    </span>
  );
}
