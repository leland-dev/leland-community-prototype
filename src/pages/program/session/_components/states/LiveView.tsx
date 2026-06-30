import { useState, type ComponentType } from "react";
import { useSearchParams } from "react-router-dom";
import type { Session } from "../../_types";
import VersionMenu, { type VersionOption } from "../blocks/VersionMenu";
import MobilePreview from "../blocks/MobilePreview";
import V1 from "./live/V1";
import V2 from "./live/V2";
import V3 from "./live/V3";
import V4 from "./live/V4";
import V5 from "./live/V5";
import V6 from "./live/V6";

type VersionEntry = VersionOption & {
  component: ComponentType<{ session: Session }>;
};

// Register prototype versions here. New experiments get added as additional
// entries; the URL ?v= param selects which one renders.
const VERSIONS: VersionEntry[] = [
  {
    id: "v1",
    label: "V1 · Sticky shrink",
    description: "Video shrinks up-and-right on scroll, snaps with a delay.",
    component: V1,
  },
  {
    id: "v2",
    label: "V2 · Scroll-off PIP",
    description: "Video scrolls naturally; a PIP fades in once it's fully off-screen.",
    component: V2,
  },
  {
    id: "v3",
    label: "V3 · Classic player",
    description: "Embedded face PIP + Cloudflare-style controls. Resources in the rail.",
    component: V3,
  },
  {
    id: "v4",
    label: "V4 · Dual feed",
    description: "Persistent slide signpost beside the live build view (desktop).",
    component: V4,
  },
  {
    id: "v5",
    label: "V5 · Chat-only rail",
    description: "Same build view + face PIP as V4; no slide signpost — rail is just chat.",
    component: V5,
  },
  {
    id: "v6",
    label: "V6 · Info-first tray",
    description: "Mobile lands on an Info pane (title + coach inside the tray); tabs over to Chat after 5s.",
    component: V6,
  },
];

export default function LiveView({ session }: { session: Session }) {
  const [params, setParams] = useSearchParams();
  const requested = params.get("v");
  const active = VERSIONS.find((v) => v.id === requested) ?? VERSIONS[0];

  const setVersion = (id: string) => {
    const next = new URLSearchParams(params);
    next.set("v", id);
    setParams(next, { replace: false });
  };

  const Component = active.component;

  // Detect if we're rendering inside the mobile preview iframe — if so,
  // suppress the version menu so it doesn't show recursively.
  const isInIframe =
    typeof window !== "undefined" && window.self !== window.top;

  const [mobilePreview, setMobilePreview] = useState(false);

  return (
    <>
      <Component session={session} />
      {!isInIframe && (
        <VersionMenu
          versions={VERSIONS}
          currentId={active.id}
          onChange={setVersion}
          mobilePreviewActive={mobilePreview}
          onToggleMobilePreview={() => setMobilePreview((v) => !v)}
        />
      )}
      {!isInIframe && mobilePreview && (
        <MobilePreview
          url={typeof window !== "undefined" ? window.location.href : "/"}
          onClose={() => setMobilePreview(false)}
        />
      )}
    </>
  );
}
