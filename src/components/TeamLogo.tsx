import { useRef } from "react";
import { useTeam } from "../contexts/TeamContext";

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

// The team's own logo in the menu. With no logo yet, an admin sees a small edit button over the placeholder to upload one.
export function EditableTeamLogo({ size = 48 }: { size?: number }) {
  const { team, updateTeam } = useTeam();
  const input = useRef<HTMLInputElement>(null);
  if (!team) return null;
  const canEdit = !team.logo && team.viewerRole === "Admin";
  const onFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" && updateTeam({ logo: reader.result });
    reader.readAsDataURL(file);
  };
  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <TeamLogo name={team.name} logo={team.logo} size={size} circle />
      {canEdit && (
        <>
          <button
            type="button"
            onClick={() => input.current?.click()}
            aria-label="Add a logo"
            className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-gray-stroke bg-white text-gray-dark shadow-[0_1px_2px_rgba(16,24,40,0.12)] transition-colors hover:bg-[#f0f0f0]"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
          </button>
          <input ref={input} type="file" accept="image/*" className="hidden" onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = ""; }} />
        </>
      )}
    </div>
  );
}
