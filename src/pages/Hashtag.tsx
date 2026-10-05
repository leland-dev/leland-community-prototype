import { Fragment, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";

import { Button } from "../components/Button";
import ComposerMediaButton from "../components/ComposerMediaButton";
import { useSetLeftSidebar } from "../components/LeftSidebarContext";
import { useSetRightSidebar } from "../components/RightSidebarContext";
import { useVersion } from "../contexts/VersionContext";

import {
  posts,
  FeedPost,
  ComposeModal,
  HomeSidebar,
  HomeRightSidebar,
  hashtagSlug,
  type Post,
} from "./Home";
import { Composer } from "./Composer";

import profilePhoto from "../assets/profile photos/profile photo.png";
import topicHash from "../assets/img/topic-hash.svg";
import composerImageIcon from "../assets/icons/image.svg";
import composerCameraIcon from "../assets/icons/camera.svg";
import composerVideoIcon from "../assets/icons/video-icon.svg";
import composerPollIcon from "../assets/icons/bar-chart.svg";
import pic1 from "../assets/profile photos/pic-1.png";
import pic3 from "../assets/profile photos/pic-3.png";
import pic5 from "../assets/profile photos/pic-5.png";
import pic7 from "../assets/profile photos/pic-7.png";

const FADE_IN = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 } };
const FADE_TRANSITION = { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const };

const FACEPILE = [pic1, pic5, pic3, pic7];

// Bucketed post count, e.g. 1500 → "1.5k", 720 → "720".
function formatPosts(n: number): string {
  if (n >= 1000) {
    const k = n / 1000;
    return `${k % 1 === 0 ? k : k.toFixed(1)}k`;
  }
  return String(n);
}

// Resolve a hashtag slug ("product-management") back to its display label
// ("Product Management") by scanning the posts for a tag that slugifies to it.
// Falls back to a title-cased version of the slug for tags with no posts yet.
function hashtagName(slug: string | undefined): string {
  if (!slug) return "";
  for (const p of posts) {
    const match = p.hashtags?.find(t => hashtagSlug(t) === slug);
    if (match) return match;
  }
  return slug
    .split("-")
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function Hashtag() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { version } = useVersion();

  const [composeOpen, setComposeOpen] = useState(false);
  const [quoteTarget, setQuoteTarget] = useState<Post | null>(null);

  // Posts tagged with this hashtag (any tag that slugifies to the URL slug).
  const baseMatches = useMemo(
    () => posts.filter(p => p.hashtags?.some(t => hashtagSlug(t) === slug)),
    [slug],
  );
  const name = useMemo(() => hashtagName(slug), [slug]);
  const [feedPosts, setFeedPosts] = useState<Post[]>(baseMatches);

  // Facepile: the first few distinct authors posting under this hashtag.
  const facepile = useMemo(() => {
    const avatars: string[] = [];
    for (const p of baseMatches) {
      if (!avatars.includes(p.avatar)) avatars.push(p.avatar);
      if (avatars.length >= 4) break;
    }
    return avatars.length ? avatars : FACEPILE;
  }, [baseMatches]);

  useSetLeftSidebar(<HomeSidebar onCreatePost={() => setComposeOpen(true)} />);
  useSetRightSidebar(<HomeRightSidebar />);

  useEffect(() => {
    setFeedPosts(posts.filter(p => p.hashtags?.some(t => hashtagSlug(t) === slug)));
    document.title = name ? `Leland | #${name}` : "Leland | Hashtag";
  }, [slug, name]);

  // Sorted by engagement (the page has no Top/Recent tabs).
  const orderedPosts = useMemo(
    () => [...feedPosts].sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments)),
    [feedPosts],
  );

  // New post from this hashtag's composer: tag it with the hashtag so it shows
  // here, register it globally so /post/:id resolves, then prepend locally.
  const handlePublish = (newPost: Post) => {
    const tagged = { ...newPost, hashtags: [name, ...(newPost.hashtags ?? [])] } as Post;
    posts.unshift(tagged);
    setFeedPosts(prev => [tagged, ...prev]);
  };

  const handleRepost = (post: Post) => {
    const canonicalId = post.repostOfId ?? post.id;
    const cloneId = -canonicalId;
    setFeedPosts(prev =>
      prev.some(p => p.id === cloneId)
        ? prev
        : [{ ...post, id: cloneId, repostedBy: "You", repostOfId: canonicalId } as Post, ...prev],
    );
  };
  const handleUndoRepost = (post: Post) => {
    const canonicalId = post.repostOfId ?? post.id;
    setFeedPosts(prev => prev.filter(p => p.id !== -canonicalId));
  };

  const handleEdit = (id: number, text: string) => {
    setFeedPosts(prev => prev.map(p => (p.id === id ? ({ ...p, type: "text" as const, body: text } as Post) : p)));
  };

  const handleQuotePost = (text: string) => {
    if (!quoteTarget) return;
    const q = quoteTarget;
    const newPost = {
      id: Date.now(),
      type: "quote" as const,
      author: "Jamie Allen",
      avatar: profilePhoto,
      time: "just now",
      verified: true,
      headline: "Interactive Lead at Airbnb",
      hashtags: [name],
      body: text,
      quoted: {
        id: q.repostOfId ?? q.id,
        author: q.author,
        avatar: q.avatar,
        time: q.time,
        verified: q.verified,
        body: "body" in q ? q.body : "",
        image: q.type === "image" ? q.images[0] : undefined,
      },
      likes: 0,
      comments: 0,
      reposts: 0,
      shares: 0,
    } as Post;
    setFeedPosts(prev => [newPost, ...prev]);
    setQuoteTarget(null);
  };

  return (
    <motion.div initial={FADE_IN.initial} animate={FADE_IN.animate} transition={FADE_TRANSITION} className="-mt-3 md:mt-0">
      {/* Hashtag header — mirrors the topic header, but the leading hashtag icon
          is swapped for a back arrow (post-detail style) and the follow button
          and overflow menu are dropped. */}
      <div className="mb-3.5 flex items-center gap-2.5 px-1 sm:px-2">
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-dark transition-colors hover:bg-gray-hover"
        >
          <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-[18px] font-semibold leading-tight text-gray-dark">{name}</h1>
          <div className="mt-1 flex items-center gap-2">
            <div className="flex -space-x-1.5">
              {facepile.map((src, i) => (
                <img key={i} src={src} alt="" className="h-5 w-5 rounded-full object-cover ring-2 ring-white" />
              ))}
            </div>
            <span className="text-[13px] text-gray-light">{formatPosts(baseMatches.length)} posts</span>
          </div>
        </div>
      </div>

      {/* Feed card */}
      <div className="overflow-hidden rounded-2xl border border-gray-stroke bg-white">
        {/* Post composer — mirrors the homepage composer: avatar + prompt on top,
            media icons + Post button beneath. Clicking anywhere opens the modal. */}
        <div
          onClick={() => setComposeOpen(true)}
          className="cursor-pointer border-b border-gray-stroke px-4 py-3 sm:px-6"
        >
          <div className="flex items-center gap-3">
            <img
              src={profilePhoto}
              alt="Your profile"
              className="h-10 w-10 shrink-0 rounded-full object-cover"
            />
            <span className="flex-1 truncate text-left text-[17px] text-gray-extra-light">
              What's on your mind?
            </span>
          </div>
          {/* Media icons (left) + Post (right), indented under the prompt text. */}
          <div className="mt-2 flex items-center justify-between pl-[52px]">
            <div className="-ml-2.5 flex items-center gap-1">
              {[
                { label: "Add image", src: composerImageIcon },
                { label: "Take photo", src: composerCameraIcon },
                { label: "Add video", src: composerVideoIcon },
                { label: "Add poll", src: composerPollIcon },
              ].map(t => (
                <ComposerMediaButton key={t.label} src={t.src} label={t.label} tone="extra-light" />
              ))}
            </div>
            <Button
              size="md"
              variant="secondary"
              rounded="rounded-full"
              onClick={() => setComposeOpen(true)}
              className="shrink-0 font-semibold opacity-50"
            >
              Post
            </Button>
          </div>
        </div>

        {orderedPosts.length > 0 ? (
          <div className="divide-y divide-gray-stroke">
            {orderedPosts.map(post => (
              <Fragment key={post.id}>
                <div className="px-4 transition-colors hover:bg-[#222222]/[0.015] sm:px-6">
                  <FeedPost
                    post={post}
                    onUpdate={handleEdit}
                    onRepost={handleRepost}
                    onUndoRepost={handleUndoRepost}
                    onQuote={setQuoteTarget}
                  />
                </div>
              </Fragment>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <img src={topicHash} alt="" className="h-9 w-9 opacity-40" />
            <p className="mt-4 text-[15px] font-semibold text-gray-dark">No posts yet</p>
            <p className="mt-1 max-w-[280px] text-[13px] text-gray-light">
              Be the first to post with #{name}.
            </p>
            <Button size="md" variant="primary" rounded="rounded-full" onClick={() => setComposeOpen(true)} className="mt-5">
              Create a post
            </Button>
          </div>
        )}
      </div>

      {composeOpen ? (
        <Composer onClose={() => setComposeOpen(false)} onPublish={handlePublish} />
      ) : null}
      {quoteTarget ? (
        <ComposeModal quotePost={quoteTarget} onClose={() => setQuoteTarget(null)} onPost={handleQuotePost} isMVP={version === "A"} />
      ) : null}
    </motion.div>
  );
}
