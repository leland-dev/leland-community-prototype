import type { Session } from "../../_types";
import StudioShell from "../blocks/StudioShell";
import ReplayCover from "../blocks/ReplayCover";

// V4-style layout for the just-ended state. Same shell as the live view —
// canvas → title → tabs+share → tab content; right rail with signpost on
// top and chat below. The canvas swaps to the replay player.
export default function JustEndedView({ session }: { session: Session }) {
  return <StudioShell session={session} canvas={<ReplayCover />} progress={1} />;
}
