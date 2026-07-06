import { motion } from "motion/react";
import { useNavigationType } from "react-router-dom";
import ConversationListItem from "../components/ConversationListItem";
import { conversations } from "../lib/conversations";

export default function Messaging() {
  const navigationType = useNavigationType();

  return (
    <motion.div
      initial={navigationType === "POP" ? { x: "-100%" } : false}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
    >
      <h1 className="font-serif text-[36px] font-medium text-gray-dark">Messages</h1>
      <p className="mt-2 text-[16px] text-gray-light">
        Your conversations with experts and peers.
      </p>

      {/* Search conversations */}
      <div className="mt-8">
        <input
          type="text"
          placeholder="Search messages..."
          className="w-full rounded-lg border border-gray-stroke bg-gray-hover px-4 py-2.5 text-sm outline-none placeholder:text-gray-xlight focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Conversation list */}
      <div className="mt-4">
        {conversations.map((conversation) => (
          <ConversationListItem key={conversation.id} conversation={conversation} />
        ))}
      </div>
    </motion.div>
  );
}
