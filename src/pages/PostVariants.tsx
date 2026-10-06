import { useEffect } from "react";
import { FeedPost, POST_HOVER_SHADOW, type Post } from "./Home";
import { useSetContentMaxWidth } from "../components/ContentMaxWidthContext";
import pic3 from "../assets/profile photos/pic-3.png";
import stripeLogo from "../assets/logos/Rectangle 3012.png";
import gsbLogo from "../assets/logos/gsb.png";

// Prototype scratch page — three identical posts from a verified expert, each
// showing a different treatment for surfacing the poster's information.

const SAMPLE: Post = {
  id: 9001,
  type: "text",
  author: "Rachel Nguyen",
  avatar: pic3,
  time: "18m",
  verified: true,
  headline: "Law School Admissions Coach · Ex-Big Law",
  body:
    "The biggest mistake I see in law school personal statements: candidates spend three paragraphs proving they're smart. Admissions already knows that from your LSAT. Spend those words showing them who you are and why law — that's the part only you can write.",
  likes: 156,
  comments: 27,
  reposts: 14,
  shares: 6,
};

// The feed wraps each post in a bordered white card; mirror that here.
function PostCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[575px]">
      <p className="mb-2 px-1 text-[13px] font-semibold uppercase tracking-[0.06em] text-gray-light">{label}</p>
      <div className="rounded-2xl border border-gray-stroke bg-white">
        <div className={`px-4 sm:px-6 ${POST_HOVER_SHADOW}`}>{children}</div>
      </div>
    </div>
  );
}

export default function PostVariants() {
  // Fill the centered 1280 content frame so the post stack can center on the page.
  useSetContentMaxWidth(1280);
  useEffect(() => {
    document.title = "Leland Prototype | Post variants";
    window.scrollTo(0, 0);
  }, []);

  // onOpen no-op keeps clicks from navigating away (this is a preview surface).
  const noop = () => {};

  return (
    <div className="flex flex-col items-center gap-8">
      <PostCard label="Default">
        <FeedPost post={SAMPLE} onOpen={noop} />
      </PostCard>

      <PostCard label="With headline">
        <FeedPost post={SAMPLE} onOpen={noop} showHeadline />
      </PostCard>

      <PostCard label="With featured experience">
        <FeedPost post={SAMPLE} onOpen={noop} featuredOrg={{ name: "Stripe", logo: stripeLogo }} />
      </PostCard>

      <PostCard label="With featured experience (inline logo)">
        <FeedPost post={SAMPLE} onOpen={noop} inlineOrgLogo={stripeLogo} />
      </PostCard>

      <PostCard label="With inline logo + headline">
        <FeedPost post={SAMPLE} onOpen={noop} inlineOrgLogo={stripeLogo} showHeadline />
      </PostCard>

      <PostCard label="With two logos + headline">
        <FeedPost post={SAMPLE} onOpen={noop} subOrgLogos={[gsbLogo, stripeLogo]} showHeadline />
      </PostCard>
    </div>
  );
}
