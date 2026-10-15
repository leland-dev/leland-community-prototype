import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTeam } from "../contexts/TeamContext";
import usersGroupIcon from "../assets/icons/users-group.svg";

// "Teams" row for the Admin Controls section of the profile
// dropdown. Expands to prototype options for the Teams experience.
export function TeamAdminMenu() {
  const [open, setOpen] = useState(false);
  const { team, setMembership, setViewerRole } = useTeam();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-[10px] rounded-lg p-3 text-[14px] font-medium text-gray-dark hover:bg-[#222222]/5"
      >
        <img src={usersGroupIcon} alt="" className="h-5 w-5 shrink-0" />
        <span className="flex-1 text-left">Teams</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden>
          <polyline points="4 6 8 10 12 6" />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="ml-[22px] border-l-[1.5px] border-gray-stroke pl-2">
              <div className="flex items-center justify-between gap-3 py-2 pl-3 pr-1">
                <span className="text-[14px] font-medium text-gray-dark">User</span>
                <div className="flex shrink-0 overflow-hidden rounded-full bg-[#E5E5E5] p-[2px]">
                  {([{ v: "none", l: "No team" }, { v: "member", l: "On a team" }] as const).map((o) => (
                    <button
                      key={o.v}
                      type="button"
                      onClick={() => setMembership(o.v)}
                      className={`rounded-full px-2.5 py-[3px] text-[11px] font-medium transition-colors ${
                        (team ? "member" : "none") === o.v ? "bg-[#222222] text-white" : "text-[#4c4c4c]"
                      }`}
                    >
                      {o.l}
                    </button>
                  ))}
                </div>
              </div>
              <div className={`flex items-center justify-between gap-3 py-2 pl-3 pr-1 ${team ? "" : "opacity-40"}`}>
                <span className="text-[14px] font-medium text-gray-dark">Role</span>
                <div className="flex shrink-0 overflow-hidden rounded-full bg-[#E5E5E5] p-[2px]">
                  {(["Admin", "Member"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      disabled={!team}
                      onClick={() => setViewerRole(r)}
                      className={`rounded-full px-2.5 py-[3px] text-[11px] font-medium transition-colors disabled:cursor-default ${
                        team?.viewerRole === r ? "bg-[#222222] text-white" : "text-[#4c4c4c]"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
