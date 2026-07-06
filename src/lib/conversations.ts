import type { Conversation } from "../components/ConversationListItem";
import pic1 from "../assets/profile photos/pic-1.png";
import pic2 from "../assets/profile photos/pic-2.png";
import pic3 from "../assets/profile photos/pic-3.png";
import pic4 from "../assets/profile photos/pic-4.png";
import pic5 from "../assets/profile photos/pic-5.png";
import pic6 from "../assets/profile photos/pic-6.png";

export const conversations: Conversation[] = [
  {
    id: "1",
    name: "Priya Shah",
    avatar: pic1,
    status: "active-client",
    lastMessageAt: "2m",
    lastMessagePreview: "Sounds great, see you Thursday at 3pm!",
  },
  {
    id: "2",
    name: "Marcus Williams",
    avatar: pic2,
    status: "lead",
    lastMessageAt: "1h",
    lastMessagePreview: "Hey! Watched your short intro video - really resonated with your approach to interview prep.",
  },
  {
    id: "3",
    name: "Nina Kowalski",
    avatar: pic3,
    status: "active-client",
    lastMessageAt: "3h",
    lastMessagePreview: "Thanks for the notes, this is really helpful.",
  },
  {
    id: "4",
    name: "David Chen",
    avatar: pic4,
    status: "lead",
    lastMessageAt: "1d",
    lastMessagePreview: "Hi! I'm interested in doing some coaching for my upcoming MBA applications.",
  },
  {
    id: "5",
    name: "Sarah Okafor",
    avatar: pic5,
    status: "archived",
    lastMessageAt: "3d",
    lastMessagePreview: "Thanks again for everything, I'll reach out if questions come up.",
  },
  {
    id: "6",
    name: "James Patterson",
    avatar: pic6,
    status: "archived",
    lastMessageAt: "1w",
  },
];

export function getConversation(id: string | undefined) {
  return conversations.find((c) => c.id === id);
}
