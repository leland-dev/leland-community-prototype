// A coach's Courses — the data behind the course builder (a lightweight LMS).
//
// A course is a tree: Course → Modules → Sections → content Blocks. Sections
// reuse the same `Block` union the lesson viewer renders (see
// src/data/lessonBlocks.ts and src/components/lesson-blocks/), so a section's
// "page" is authored here and could be rendered by the real viewer unchanged.
//
// Like the collections store, this is a tiny external store so the Content page
// (course list) and the builder route stay in sync. Unlike collections, it also
// persists to localStorage so a work-in-progress course survives a reload —
// important for an editor you tab away from.
import { useSyncExternalStore } from "react";
import type { Block } from "../data/lessonBlocks";

// ─── Types ─────────────────────────────────────────────────────────────────

// One content page inside a module. `blocks` is the authored page body.
export type CourseSection = {
  id: string;
  title: string;
  description?: string;
  blocks: Block[];
};

// A group of sections, e.g. "Before you start" or "Lesson 1".
export type CourseModule = {
  id: string;
  title: string;
  subtitle?: string;
  sections: CourseSection[];
};

export type BuilderCourse = {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  modules: CourseModule[];
  status: "draft" | "published";
  updatedAt: number;
};

// ─── ids ───────────────────────────────────────────────────────────────────

let idCounter = 0;
// Collision-proof-enough id for prototype data. Counter guards against two ids
// minted in the same millisecond (e.g. seeding, or fast successive adds).
function uid(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter.toString(36)}`;
}

export const newCourseId = () => uid("course");
export const newModuleId = () => uid("mod");
export const newSectionId = () => uid("sec");

// ─── Factories ─────────────────────────────────────────────────────────────

export function emptySection(title = "Untitled section"): CourseSection {
  return { id: newSectionId(), title, description: "", blocks: [] };
}

export function emptyModule(title = "Untitled module"): CourseModule {
  return { id: newModuleId(), title, subtitle: "", sections: [emptySection("New section")] };
}

export function emptyCourse(): BuilderCourse {
  return {
    id: newCourseId(),
    title: "",
    description: "",
    coverImage: undefined,
    modules: [emptyModule("Module 1")],
    status: "draft",
    updatedAt: Date.now(),
  };
}

// ─── Seed ──────────────────────────────────────────────────────────────────
// A single realistic example so the builder isn't empty on first open. Mirrors
// the structure in the AI Builder course (Before you start / Lesson 1 / …).

const SEED: BuilderCourse[] = [
  {
    id: "course-ai-builder-l1",
    title: "AI Builder Program Level 1: Use AI to 10x Your Impact",
    description:
      "A hands-on course that takes you from foundational prompting to shipping real AI-powered tools — no engineering background required.",
    coverImage: new URL("../assets/img/cover-images/cover-image-3.png", import.meta.url).href,
    status: "published",
    updatedAt: Date.now(),
    modules: [
      {
        id: "mod-before",
        title: "Before you start",
        subtitle: "Get set up before Lesson 1",
        sections: [
          {
            id: "sec-calendar",
            title: "Add sessions to your calendar",
            description: "Two session times each day — attend whichever works for you.",
            blocks: [
              {
                kind: "markdown",
                body: "Sessions run **Tuesdays & Fridays** at 11:00 AM or 4:00 PM PT. Add them all to your calendar so you never miss one.",
              },
              {
                kind: "banner",
                text: "Add all sessions to your calendar",
                subtext: "One click adds the full cohort schedule.",
                color: "yellow",
                icon: "IconCalendar",
                href: "#",
              },
            ],
          },
          {
            id: "sec-tools",
            title: "Set up your tools & permissions",
            description: "Install your AI tool of choice before the first session.",
            blocks: [
              { kind: "markdown", body: "Install **Claude** (or your tool of choice) and sign in before Lesson 1 so you're ready to build." },
            ],
          },
        ],
      },
      {
        id: "mod-lesson-1",
        title: "Lesson 1",
        subtitle: "Build a real product with world-class design",
        sections: [
          {
            id: "sec-opening",
            title: "Opening concepts",
            description: "Connect your real tools, teach Claude how you write, and set up your first automation that runs on its own.",
            blocks: [
              {
                kind: "callout",
                tone: "blue",
                eyebrow: "Concept",
                title: "The four modes of working with AI",
                content: [
                  {
                    kind: "markdown",
                    body: "Most people think of AI as a writing tool: you ask, it produces. That's one mode. Depending on how you frame the request, AI can play entirely different roles, and each gives you a different kind of result.",
                  },
                ],
              },
              {
                kind: "callout",
                tone: "tan",
                eyebrow: "Exercise",
                title: "Create a site based on examples you like",
                content: [
                  {
                    kind: "steps",
                    items: [
                      { text: "Find a few examples of sites you like" },
                      { text: "Copy this prompt into Claude and replace the placeholder text with URLs to your inspiration" },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "sec-build",
            title: "Build your first page",
            description: "",
            blocks: [
              { kind: "markdown", body: "## Scaffold your portfolio\n\nStart from your real content and let the design system do the heavy lifting." },
              { kind: "divider" },
              {
                kind: "toggle",
                rows: [
                  { title: "What if I don't have a project idea?", body: "Pick something small and real — a personal site, a tool for a hobby, or a page for a side project." },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "mod-lesson-2",
        title: "Lesson 2",
        subtitle: "Automate communication in your voice",
        sections: [
          {
            id: "sec-l2-intro",
            title: "Teach Claude how you write",
            description: "",
            blocks: [
              { kind: "markdown", body: "Feed Claude samples of your writing so it can draft in your voice." },
            ],
          },
        ],
      },
    ],
  },
];

// ─── Store ─────────────────────────────────────────────────────────────────

const STORAGE_KEY = "builder-courses-v1";

function load(): BuilderCourse[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as BuilderCourse[];
  } catch {
    // fall through to seed
  }
  return SEED;
}

let courses: BuilderCourse[] = load();

const listeners = new Set<() => void>();
const emit = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
  } catch {
    // storage full / unavailable — stay in-memory
  }
  listeners.forEach((l) => l());
};

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
const getSnapshot = () => courses;

export function useCourses(): BuilderCourse[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useCourse(id: string | undefined): BuilderCourse | undefined {
  const all = useCourses();
  return all.find((c) => c.id === id);
}

export function getCourse(id: string | undefined): BuilderCourse | undefined {
  return courses.find((c) => c.id === id);
}

export function upsertCourse(course: BuilderCourse): void {
  const stamped = { ...course, updatedAt: Date.now() };
  const i = courses.findIndex((c) => c.id === course.id);
  courses = i >= 0 ? courses.map((c) => (c.id === course.id ? stamped : c)) : [...courses, stamped];
  emit();
}

export function deleteCourse(id: string): void {
  courses = courses.filter((c) => c.id !== id);
  emit();
}

// Convenience aggregate used by course cards.
export function courseStats(course: BuilderCourse): { modules: number; sections: number } {
  const sections = course.modules.reduce((n, m) => n + m.sections.length, 0);
  return { modules: course.modules.length, sections };
}
