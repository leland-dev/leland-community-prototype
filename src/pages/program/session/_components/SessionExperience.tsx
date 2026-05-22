import type { Session, SessionState } from "../_types";
import PreSessionView from "./states/PreSessionView";
import LiveView from "./states/LiveView";
import JustEndedView from "./states/JustEndedView";
import IdleView from "./states/IdleView";

type Props = {
  session: Session;
  state: SessionState;
};

export default function SessionExperience({ session, state }: Props) {
  switch (state) {
    case "pre-session":
      return <PreSessionView session={session} />;
    case "live":
      return <LiveView session={session} />;
    case "just-ended":
      return <JustEndedView session={session} />;
    case "idle":
      return <IdleView session={session} />;
    default: {
      const _exhaustive: never = state;
      return _exhaustive;
    }
  }
}
