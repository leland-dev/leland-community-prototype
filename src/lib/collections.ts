// A coach's Collections — named buckets of previously-uploaded content that can
// be reused across offerings. Collections are first-class objects that live on
// the Content page and get attached to an offering in the builder (see
// CollectionPickerModal in CoachProductNew).
//
// This is a tiny in-memory store with an external-store subscription so the two
// separate routes (Content page, offering builder) stay in sync when a
// collection is created or edited in either place. Items reuse the same shape
// the offering builder's ListConfigModal produces — `{ id, config }`, where a
// reused library item carries `{ source: "reuse", libraryId, ... }`. Titles and
// thumbnails are resolved from CONTENT_LIBRARY at render time, so the seed only
// needs to name each item's library id.
import { useSyncExternalStore } from "react";

// One content item inside a collection. Structurally compatible with the
// offering builder's CollectionItem (kept loosely typed to avoid a circular
// import with the CoachProductNew page module).
export type CollectionItemData = { id: number; config: Record<string, string> };

export type Collection = {
  id: string;
  title: string;
  description: string;
  items: CollectionItemData[];
};

// Build a reused-library item from a library id (the minimum a seed needs).
const lib = (id: number, libraryId: string): CollectionItemData => ({
  id,
  config: { source: "reuse", libraryId },
});

let collections: Collection[] = [
  {
    id: "col-mba-essentials",
    title: "MBA Application Essentials",
    description: "Everything an applicant needs to go from research to submitted — essays, roadmap, and recommendation prep.",
    items: [lib(1, "c1"), lib(2, "c9"), lib(3, "c7"), lib(4, "c13")],
  },
  {
    id: "col-interview-kit",
    title: "Consulting Interview Kit",
    description: "The frameworks, practice cases, and mock walkthroughs I use to prep candidates for Bain and McKinsey.",
    items: [lib(1, "c8"), lib(2, "c15"), lib(3, "c3"), lib(4, "c4"), lib(5, "c12")],
  },
  {
    id: "col-resume-pack",
    title: "Resume & Networking Pack",
    description: "Templates and trackers for a standout resume and a networking process that actually converts.",
    items: [lib(1, "c2"), lib(2, "c10"), lib(3, "c6"), lib(4, "c14")],
  },
];

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
const getSnapshot = () => collections;

// React hook — re-renders subscribers whenever the collection list changes.
export function useCollections(): Collection[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function getCollections(): Collection[] {
  return collections;
}

export function getCollection(id: string | undefined): Collection | undefined {
  return collections.find((c) => c.id === id);
}

// Insert or replace a collection by id, then notify subscribers.
export function upsertCollection(c: Collection): void {
  const i = collections.findIndex((x) => x.id === c.id);
  collections = i >= 0 ? collections.map((x) => (x.id === c.id ? c : x)) : [...collections, c];
  emit();
}

export function deleteCollection(id: string): void {
  collections = collections.filter((c) => c.id !== id);
  emit();
}

// Fresh, collision-proof id for a newly created collection.
export function newCollectionId(): string {
  return `col-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
