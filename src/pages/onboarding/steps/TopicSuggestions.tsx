import { useMemo, type ComponentType } from "react";
import {
  GraduationCap,
  Briefcase,
  Landmark,
  BarChart3,
  Code2,
  Cpu,
  TrendingUp,
  Stethoscope,
  Scale,
  Rocket,
  Megaphone,
  Compass,
  type LucideProps,
} from "lucide-react";

import FollowList, { type FollowItem } from "./FollowList";

/* ─────────────────────────────────────────────────────────────────────────
 * TopicSuggestions (v2) — follow topics/interests, each with an icon and a
 * count of experts. Built on FollowList.
 * ──────────────────────────────────────────────────────────────────────── */

type Topic = {
  name: string;
  Icon: ComponentType<LucideProps>;
};

const TOPICS: Topic[] = [
  { name: "MBA Admissions", Icon: GraduationCap },
  { name: "Product Management", Icon: Briefcase },
  { name: "Investment Banking", Icon: Landmark },
  { name: "Management Consulting", Icon: BarChart3 },
  { name: "Software Engineering", Icon: Code2 },
  { name: "AI & Machine Learning", Icon: Cpu },
  { name: "Venture Capital", Icon: TrendingUp },
  { name: "Medical School", Icon: Stethoscope },
  { name: "Law School", Icon: Scale },
  { name: "Startups & Founders", Icon: Rocket },
  { name: "Marketing & Growth", Icon: Megaphone },
  { name: "Career Switching", Icon: Compass },
];

function expertCountFor(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return 40 + (h % 320); // 40–359
}

function TopicIcon({ topic }: { topic: Topic }) {
  const { Icon } = topic;
  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-hover text-gray-dark ring-1 ring-black/[0.05]">
      <Icon size={22} strokeWidth={1.9} />
    </span>
  );
}

export default function TopicSuggestions(props: {
  onBack?: () => void;
  onContinue: () => void;
  onSkip?: () => void;
}) {
  const items = useMemo<FollowItem[]>(
    () =>
      TOPICS.map((t) => ({
        id: t.name,
        title: t.name,
        subtitle: `${expertCountFor(t.name)} experts`,
        media: <TopicIcon topic={t} />,
      })),
    [],
  );

  return (
    <FollowList
      title="What are you into?"
      purpose="tailor your feed"
      doneText="Great — we'll tune your feed to these."
      searchPlaceholder="Search topics"
      items={items}
      {...props}
    />
  );
}
