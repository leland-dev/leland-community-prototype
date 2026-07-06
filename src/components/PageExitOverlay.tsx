import { motion } from "motion/react";
import { usePageExit } from "../contexts/PageExitContext";
import { PUSH_TRANSITION } from "../lib/pushTransition";

// A frozen stand-in for a pushed page's departing frame. The page hands off
// to this on back-tap and navigates away immediately, so this overlay
// (which outlives the real page's unmount) keeps sliding out to the right in
// lockstep with the page underneath sliding in from the left, instead of the
// two animations running one after the other.
export default function PageExitOverlay() {
  const { exitingNode, clearExit } = usePageExit();

  if (!exitingNode) return null;

  return (
    <motion.div
      initial={{ x: 0 }}
      animate={{ x: "100%" }}
      transition={PUSH_TRANSITION}
      onAnimationComplete={clearExit}
      className="pointer-events-none fixed inset-0 z-[100] flex min-h-screen flex-col bg-white"
    >
      {exitingNode}
    </motion.div>
  );
}
