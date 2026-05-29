import type { Session } from "../../_types";
import StudioShell from "../blocks/StudioShell";
import PreSessionCover from "../blocks/PreSessionCover";

// V4-style layout for the pre-session state. Same shell as the live view —
// canvas → title → tabs+share → tab content; right rail with signpost on
// top and chat below. The canvas swaps to a countdown cover.
export default function PreSessionView({ session }: { session: Session }) {
  return <StudioShell session={session} canvas={<PreSessionCover session={session} />} progress={0} />;
}
