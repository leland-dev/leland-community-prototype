import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Post } from "../pages/Home";

// Saved/bookmarked posts, shared across the app so a bookmark tapped in the
// feed shows up under the profile's "Liked & Saved" tab. Prototype-only:
// in-memory, resets on reload.
interface BookmarksContextValue {
  savedPosts: Post[];
  isSaved: (id: number) => boolean;
  toggleBookmark: (post: Post) => void;
}

const BookmarksContext = createContext<BookmarksContextValue | null>(null);

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);

  const isSaved = useCallback(
    (id: number) => savedPosts.some((p) => p.id === id),
    [savedPosts],
  );

  const toggleBookmark = useCallback((post: Post) => {
    setSavedPosts((prev) =>
      prev.some((p) => p.id === post.id)
        ? prev.filter((p) => p.id !== post.id)
        : [post, ...prev],
    );
  }, []);

  const value = useMemo(
    () => ({ savedPosts, isSaved, toggleBookmark }),
    [savedPosts, isSaved, toggleBookmark],
  );

  return <BookmarksContext.Provider value={value}>{children}</BookmarksContext.Provider>;
}

export function useBookmarks(): BookmarksContextValue {
  const ctx = useContext(BookmarksContext);
  if (!ctx) throw new Error("useBookmarks must be used within a BookmarksProvider");
  return ctx;
}
