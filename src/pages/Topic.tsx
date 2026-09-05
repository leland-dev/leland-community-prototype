import { Fragment, useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";

import { Button, LinkButton } from "../components/Button";
import { useSetLeftSidebar } from "../components/LeftSidebarContext";
import { useSetRightSidebar } from "../components/RightSidebarContext";
import { useVersion } from "../contexts/VersionContext";

import {
  posts,
  FeedPost,
  ComposeModal,
  HomeSidebar,
  HomeRightSidebar,
  topicBySlug,
  type Post,
} from "./Home";
import { Composer } from "./Composer";

import profilePhoto from "../assets/profile photos/profile photo.png";
import topicHash from "../assets/img/topic-hash.svg";
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

type Tab = "Top" | "Recent";

export default function Topic() {
  const { slug } = useParams();
  const topic = topicBySlug(slug);
  const { version } = useVersion();

  const [composeOpen, setComposeOpen] = useState(false);
  const [following, setFollowing] = useState(false);
  const [tab, setTab] = useState<Tab>("Top");
  const [quoteTarget, setQuoteTarget] = useState<Post | null>(null);
  const [feedPosts, setFeedPosts] = useState<Post[]>(() => posts.filter(p => p.topic === slug));

  useSetLeftSidebar(<HomeSidebar onCreatePost={() => setComposeOpen(true)} />);
  useSetRightSidebar(<HomeRightSidebar />);

  useEffect(() => {
    setFeedPosts(posts.filter(p => p.topic === slug));
    document.title = topic ? `Leland | ${topic.name}` : "Leland | Topic";
  }, [slug, topic]);

  // "Recent" keeps newest-first (the prepend order); "Top" sorts by engagement.
  const orderedPosts = useMemo(() => {
    if (tab === "Recent") return feedPosts;
    return [...feedPosts].sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments));
  }, [feedPosts, tab]);

  // New post from this topic's composer: tag it with the topic so it shows here
  // and carries the topic link everywhere, register it globally so /post/:id
  // resolves, then prepend to the local feed.
  const handlePublish = (newPost: Post) => {
    const tagged = { ...newPost, topic: slug } as Post;
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
      topic: slug,
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

  if (!topic) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-stroke bg-white px-6 py-20 text-center">
        <img src={topicHash} alt="" className="h-10 w-10 opacity-40" />
        <h1 className="mt-4 text-[20px] font-bold text-gray-dark">Topic not found</h1>
        <p className="mt-1 text-[14px] text-gray-light">This topic doesn’t exist yet.</p>
        <LinkButton size="md" variant="secondary" rounded="rounded-full" href="/" className="mt-5">
          Back to feed
        </LinkButton>
      </div>
    );
  }

  return (
    <motion.div initial={FADE_IN.initial} animate={FADE_IN.animate} transition={FADE_TRANSITION} className="-mt-3 md:mt-0">
      {/* Topic header — mirrors the post-detail header (bold title, plain 3-dot
          button). Small inline hashtag, then title + facepile & post count. */}
      <div className="mb-3.5 flex items-center justify-between gap-3 px-1 sm:px-2">
        <div className="flex min-w-0 items-start gap-2.5">
          <img src={topicHash} alt="" className="h-6 w-6 shrink-0" />
          <div className="min-w-0">
            <h1 className="truncate text-[18px] font-semibold leading-tight text-gray-dark">{topic.name}</h1>
            <div className="mt-1 flex items-center gap-2">
              <div className="flex -space-x-1.5">
                {FACEPILE.map((src, i) => (
                  <img key={i} src={src} alt="" className="h-5 w-5 rounded-full object-cover ring-2 ring-white" />
                ))}
              </div>
              <span className="text-[13px] text-gray-light">{formatPosts(topic.postCount)} posts</span>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            size="sm"
            variant={following ? "secondary" : "dark"}
            rounded="rounded-full"
            onClick={() => setFollowing(f => !f)}
            className="min-w-[84px] font-semibold"
          >
            {following ? "Following" : "Follow"}
          </Button>
          <button
            aria-label="More"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-gray-light transition-colors hover:bg-gray-hover hover:text-gray-dark"
          >
            <svg className="h-[20px] w-[20px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Feed card */}
      <div className="overflow-hidden rounded-2xl border border-gray-stroke bg-white">
        {/* Top / Recent tabs */}
        <div className="flex border-b border-gray-stroke">
          {(["Top", "Recent"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="relative flex-1 py-3.5 text-center text-[15px] font-semibold transition-colors"
            >
              <span className={tab === t ? "text-gray-dark" : "text-gray-light hover:text-gray-dark"}>{t}</span>
              {tab === t && <span className="absolute inset-x-0 -bottom-px mx-auto h-[2px] w-full bg-gray-dark" />}
            </button>
          ))}
        </div>

        {/* Composer entry */}
        <div
          onClick={() => setComposeOpen(true)}
          className="flex cursor-pointer items-center gap-3 border-b border-gray-stroke px-4 py-3.5 sm:px-6"
        >
          <img src={profilePhoto} alt="Your profile" className="h-10 w-10 shrink-0 rounded-full object-cover" />
          <span className="flex-1 truncate text-left text-[17px] text-gray-extra-light">
            Post about {topic.name}…
          </span>
        </div>

        {orderedPosts.length > 0 ? (
          <div className="divide-y divide-gray-stroke">
            {orderedPosts.map(post => (
              <Fragment key={post.id}>
                <div className="px-4 transition-colors hover:bg-[#222222]/[0.015] sm:px-6">
                  <FeedPost
                    post={post}
                    hideTopic
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
              Be the first to start a conversation in {topic.name}.
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
