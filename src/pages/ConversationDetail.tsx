import { useParams, useNavigate, useNavigationType } from "react-router-dom";
import { motion } from "motion/react";
import { getConversation } from "../lib/conversations";
import { usePageExit } from "../contexts/PageExitContext";
import { PUSH_TRANSITION } from "../lib/pushTransition";
import ConversationDetailView from "../components/ConversationDetailView";

export default function ConversationDetail() {
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const { conversationId } = useParams<{ conversationId: string }>();
  const conversation = getConversation(conversationId);
  const { startExit } = usePageExit();

  if (!conversation) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white text-gray-light">
        <p className="text-[15px]">Conversation not found.</p>
        <button onClick={() => navigate("/messages")} className="mt-4 text-gray-dark hover:underline">
          ← Back to messages
        </button>
      </div>
    );
  }

  const handleBack = () => {
    // Hand the departing frame off to a persistent overlay and navigate
    // immediately, so the incoming messages list and outgoing conversation
    // slide in the same frame instead of the list waiting for this page to
    // finish its own exit animation before it can even mount.
    startExit(<ConversationDetailView conversation={conversation} onBack={() => {}} />);
    navigate(-1);
  };

  return (
    <motion.div
      // Arriving from the messages list (forward push) slides in from the
      // right; arriving back from the relationship page (POP) slides in
      // from the left, since this page is the one being revealed.
      initial={navigationType === "POP" ? { x: "-100%" } : { x: "100%" }}
      animate={{ x: 0 }}
      transition={PUSH_TRANSITION}
      className="flex min-h-[100dvh] flex-col bg-white"
    >
      <ConversationDetailView conversation={conversation} onBack={handleBack} />
    </motion.div>
  );
}
