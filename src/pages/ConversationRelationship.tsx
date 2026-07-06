import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { getConversation } from "../lib/conversations";
import { usePageExit } from "../contexts/PageExitContext";
import { PUSH_TRANSITION } from "../lib/pushTransition";
import ConversationRelationshipView from "../components/ConversationRelationshipView";

export default function ConversationRelationship() {
  const navigate = useNavigate();
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
    startExit(<ConversationRelationshipView conversation={conversation} onBack={() => {}} />);
    navigate(-1);
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      transition={PUSH_TRANSITION}
      className="min-h-screen bg-white"
    >
      <ConversationRelationshipView conversation={conversation} onBack={handleBack} />
    </motion.div>
  );
}
