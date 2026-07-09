import { useMemo } from "react";

import FollowList, { type FollowItem } from "./FollowList";

/* ─────────────────────────────────────────────────────────────────────────
 * InstitutionSuggestions (v2) — follow schools & companies, each with a logo
 * and a count of how many Leland experts come from there. Built on FollowList.
 * ──────────────────────────────────────────────────────────────────────── */

/* logos — loaded once by Vite from both logo folders */
const ORG_LOGOS = import.meta.glob("../../../assets/org-logos/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;
const LOGOS = import.meta.glob("../../../assets/logos/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function logoFor(key: string): string | undefined {
  return (
    ORG_LOGOS[`../../../assets/org-logos/${key}.png`] ??
    LOGOS[`../../../assets/logos/${key}.png`]
  );
}

type Institution = {
  name: string;
  key: string; // logo filename (without extension)
  kind: "School" | "Company";
};

/* Curated set — only institutions we have real logos for. */
const INSTITUTIONS: Institution[] = [
  { name: "Harvard", key: "harvard", kind: "School" },
  { name: "Stanford GSB", key: "gsb", kind: "School" },
  { name: "McKinsey & Company", key: "mckinsey", kind: "Company" },
  { name: "Wharton", key: "wharton", kind: "School" },
  { name: "Google", key: "google", kind: "Company" },
  { name: "Kellogg", key: "kellogg", kind: "School" },
  { name: "Goldman Sachs", key: "goldman", kind: "Company" },
  { name: "MIT", key: "mit", kind: "School" },
  { name: "Bain & Company", key: "bain", kind: "Company" },
  { name: "Columbia", key: "columbia", kind: "School" },
  { name: "Meta", key: "meta", kind: "Company" },
  { name: "Booth", key: "booth", kind: "School" },
  { name: "BCG", key: "bcg", kind: "Company" },
  { name: "Yale", key: "yale", kind: "School" },
  { name: "OpenAI", key: "openai", kind: "Company" },
  { name: "Princeton", key: "princeton", kind: "School" },
  { name: "Stripe", key: "stripe", kind: "Company" },
  { name: "NYU Stern", key: "nyu-stern", kind: "School" },
  { name: "Morgan Stanley", key: "morgan-stanley", kind: "Company" },
  { name: "Deloitte", key: "deloitte", kind: "Company" },
];

/* deterministic pseudo expert-count so numbers stay stable across renders */
function expertCountFor(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return 14 + (h % 220); // 14–233
}

function Logo({ name, k }: { name: string; k: string }) {
  const url = logoFor(k);
  if (url) {
    return (
      <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-1.5 ring-1 ring-black/[0.06]">
        <img src={url} alt="" className="h-full w-full object-contain" />
      </span>
    );
  }
  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-hover text-[16px] font-semibold text-gray-dark ring-1 ring-black/[0.06]">
      {name.charAt(0)}
    </span>
  );
}

export default function InstitutionSuggestions(props: {
  onBack?: () => void;
  onContinue: () => void;
  onSkip?: () => void;
}) {
  const items = useMemo<FollowItem[]>(
    () =>
      INSTITUTIONS.map((inst) => ({
        id: inst.name,
        title: inst.name,
        subtitle: `${expertCountFor(inst.name)} experts · ${inst.kind}`,
        media: <Logo name={inst.name} k={inst.key} />,
      })),
    [],
  );

  return (
    <FollowList
      title="Follow schools & companies"
      purpose="personalize your feed"
      searchPlaceholder="Search schools & companies"
      items={items}
      {...props}
    />
  );
}
