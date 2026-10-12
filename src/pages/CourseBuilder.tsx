// Course builder — a full-screen visual editor for a lightweight LMS.
//
// Structure mirrors the learner viewer (ContentViewer): a course is Modules →
// Sections → content Blocks. The left rail is the course outline (reorder /
// rename / add / delete modules and sections); the main area edits either the
// course details or the selected section's "page" of content blocks. A
// per-section Preview tab renders the exact blocks the learner will see, via the
// shared BlockList renderer.
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  Eye,
  GripVertical,
  Image as ImageIcon,
  Layers,
  Pencil,
  Plus,
  Settings2,
  Trash2,
} from "lucide-react";

import { Button } from "../components/Button";
import ConfirmModal from "../components/ConfirmModal";
import { BlockList } from "../components/lesson-blocks";
import { BlockListEditor } from "../components/course-builder/BlockEditors";
import { useReorder } from "../components/course-builder/dnd";
import {
  deleteCourse,
  emptyCourse,
  emptyModule,
  emptySection,
  getCourse,
  upsertCourse,
  type BuilderCourse,
  type CourseModule,
  type CourseSection,
} from "../lib/courses";

// Cover-image presets offered in the details panel.
const COVER_PRESETS = [
  new URL("../assets/img/cover-images/cover-image-1.jpg", import.meta.url).href,
  new URL("../assets/img/cover-images/cover-image-2.png", import.meta.url).href,
  new URL("../assets/img/cover-images/cover-image-3.png", import.meta.url).href,
  new URL("../assets/img/cover-images/cover-image-4.png", import.meta.url).href,
  new URL("../assets/img/cover-images/cover-image-5.png", import.meta.url).href,
  new URL("../assets/img/cover-images/cover-image-6.png", import.meta.url).href,
];

const CONTENT_HOME = "/coach/content";

// What the main area is editing.
type Selection = { type: "details" } | { type: "section"; moduleId: string; sectionId: string };

// Borderless inline input that reveals a border on focus (used in the rail).
const railInput =
  "w-full min-w-0 rounded-md bg-transparent px-2 py-1 text-gray-dark hover:bg-gray-hover focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-stroke";

export default function CourseBuilder() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourseState] = useState<BuilderCourse>(() => getCourse(courseId) ?? emptyCourse());
  const isNew = !getCourse(courseId);

  // Persist on every change; local state stays the source of truth while editing.
  const setCourse = (updater: (prev: BuilderCourse) => BuilderCourse) =>
    setCourseState((prev) => {
      const next = updater(prev);
      upsertCourse(next);
      return next;
    });

  const [selection, setSelection] = useState<Selection>({ type: "details" });

  // New course: persist the fresh object and swap the URL to its real id.
  useEffect(() => {
    if (isNew) {
      upsertCourse(course);
      navigate(`${CONTENT_HOME}/course/${course.id}`, { replace: true });
    } else {
      // Existing course: start on its first section if it has one.
      const first = course.modules[0]?.sections[0];
      if (first) setSelection({ type: "section", moduleId: course.modules[0].id, sectionId: first.id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.title = `Course builder | ${course.title || "Untitled course"}`;
  }, [course.title]);

  // ── Module / section mutations ──
  const updateModule = (moduleId: string, patch: Partial<CourseModule>) =>
    setCourse((c) => ({ ...c, modules: c.modules.map((m) => (m.id === moduleId ? { ...m, ...patch } : m)) }));

  const reorderModules = (modules: CourseModule[]) => setCourse((c) => ({ ...c, modules }));

  const addModule = () =>
    setCourse((c) => ({ ...c, modules: [...c.modules, emptyModule(`Module ${c.modules.length + 1}`)] }));

  const deleteModule = (moduleId: string) =>
    setCourse((c) => ({ ...c, modules: c.modules.filter((m) => m.id !== moduleId) }));

  const addSection = (moduleId: string) => {
    const section = emptySection("New section");
    setCourse((c) => ({
      ...c,
      modules: c.modules.map((m) => (m.id === moduleId ? { ...m, sections: [...m.sections, section] } : m)),
    }));
    setSelection({ type: "section", moduleId, sectionId: section.id });
  };

  const updateSection = (moduleId: string, sectionId: string, patch: Partial<CourseSection>) =>
    setCourse((c) => ({
      ...c,
      modules: c.modules.map((m) =>
        m.id === moduleId
          ? { ...m, sections: m.sections.map((s) => (s.id === sectionId ? { ...s, ...patch } : s)) }
          : m,
      ),
    }));

  const reorderSections = (moduleId: string, sections: CourseSection[]) =>
    setCourse((c) => ({ ...c, modules: c.modules.map((m) => (m.id === moduleId ? { ...m, sections } : m)) }));

  const deleteSection = (moduleId: string, sectionId: string) => {
    setCourse((c) => ({
      ...c,
      modules: c.modules.map((m) =>
        m.id === moduleId ? { ...m, sections: m.sections.filter((s) => s.id !== sectionId) } : m,
      ),
    }));
    if (selection.type === "section" && selection.sectionId === sectionId) setSelection({ type: "details" });
  };

  // Resolve the active section object for the main area.
  const activeModule = selection.type === "section" ? course.modules.find((m) => m.id === selection.moduleId) : undefined;
  const activeSection = activeModule?.sections.find((s) => selection.type === "section" && s.id === selection.sectionId);

  return (
    <div className="flex h-screen flex-col bg-[#faf9f6] text-gray-dark">
      {/* ── Top bar ── */}
      <header className="flex shrink-0 items-center gap-4 border-b border-gray-stroke bg-white px-5 py-3">
        <Link to={CONTENT_HOME} className="inline-flex items-center gap-1.5 text-[14px] text-gray-light transition-colors hover:text-gray-dark">
          <ChevronLeft className="h-4 w-4" /> My content
        </Link>
        <div className="mx-1 h-5 w-px bg-gray-stroke" />
        <div className="flex min-w-0 items-center gap-2">
          <Layers className="h-4 w-4 shrink-0 text-gray-light" />
          <span className="truncate text-[15px] font-semibold text-gray-dark">{course.title || "Untitled course"}</span>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${course.status === "published" ? "bg-[#E6F4EA] text-[#1E7B34]" : "bg-gray-hover text-gray-light"}`}>
            {course.status === "published" ? "Published" : "Draft"}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden text-[12px] text-gray-extra-light sm:inline">Saved</span>
          <Button size="sm" variant="secondary" rounded="rounded-full" className="font-semibold" onClick={() => setCourse((c) => ({ ...c, status: c.status === "published" ? "draft" : "published" }))}>
            {course.status === "published" ? "Unpublish" : "Publish"}
          </Button>
          <Button size="sm" variant="dark" rounded="rounded-full" className="font-semibold" onClick={() => navigate(CONTENT_HOME)}>
            Done
          </Button>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex min-h-0 flex-1">
        {/* Left rail — course outline */}
        <aside className="flex w-[320px] shrink-0 flex-col border-r border-gray-stroke bg-white">
          <div className="flex-1 overflow-y-auto px-3 py-4">
            {/* Course details entry */}
            <button
              onClick={() => setSelection({ type: "details" })}
              className={`mb-2 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[14px] font-medium transition-colors ${selection.type === "details" ? "bg-gray-dark text-white" : "text-gray-dark hover:bg-gray-hover"}`}
            >
              <Settings2 className="h-[18px] w-[18px] shrink-0" />
              Course details
            </button>

            <p className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wide text-gray-extra-light">Curriculum</p>

            <ModuleList
              modules={course.modules}
              selection={selection}
              onReorderModules={reorderModules}
              onReorderSections={reorderSections}
              onSelectSection={(moduleId, sectionId) => setSelection({ type: "section", moduleId, sectionId })}
              onRenameModule={(id, title) => updateModule(id, { title })}
              onRenameModuleSubtitle={(id, subtitle) => updateModule(id, { subtitle })}
              onDeleteModule={deleteModule}
              onAddSection={addSection}
              onDeleteSection={deleteSection}
            />

            <button
              onClick={addModule}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-stroke py-2.5 text-[13px] font-semibold text-gray-light transition-colors hover:border-gray-dark hover:text-gray-dark"
            >
              <Plus className="h-4 w-4" /> Add module
            </button>
          </div>
        </aside>

        {/* Main area */}
        <main className="min-w-0 flex-1 overflow-y-auto">
          {selection.type === "details" ? (
            <DetailsPanel course={course} setCourse={setCourse} onDeleted={() => navigate(CONTENT_HOME)} />
          ) : activeSection && activeModule ? (
            <SectionEditor
              key={activeSection.id}
              module={activeModule}
              section={activeSection}
              onChange={(patch) => updateSection(activeModule.id, activeSection.id, patch)}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[14px] text-gray-light">Select a section to edit.</div>
          )}
        </main>
      </div>
    </div>
  );
}

// ─── Left-rail module list (handles both levels of reordering) ────────────────

function ModuleList({
  modules,
  selection,
  onReorderModules,
  onReorderSections,
  onSelectSection,
  onRenameModule,
  onRenameModuleSubtitle,
  onDeleteModule,
  onAddSection,
  onDeleteSection,
}: {
  modules: CourseModule[];
  selection: Selection;
  onReorderModules: (m: CourseModule[]) => void;
  onReorderSections: (moduleId: string, s: CourseSection[]) => void;
  onSelectSection: (moduleId: string, sectionId: string) => void;
  onRenameModule: (id: string, title: string) => void;
  onRenameModuleSubtitle: (id: string, subtitle: string) => void;
  onDeleteModule: (id: string) => void;
  onAddSection: (moduleId: string) => void;
  onDeleteSection: (moduleId: string, sectionId: string) => void;
}) {
  const { itemProps, handleProps, state } = useReorder(modules, onReorderModules);
  return (
    <div className="flex flex-col gap-1">
      {modules.map((module, i) => {
        const s = state(i);
        return (
          <ModuleRow
            key={module.id}
            module={module}
            selection={selection}
            itemProps={itemProps(i)}
            handleProps={handleProps}
            dragging={s.dragging}
            over={s.over}
            onReorderSections={(sections) => onReorderSections(module.id, sections)}
            onSelectSection={onSelectSection}
            onRename={(title) => onRenameModule(module.id, title)}
            onRenameSubtitle={(subtitle) => onRenameModuleSubtitle(module.id, subtitle)}
            onDelete={() => onDeleteModule(module.id)}
            onAddSection={() => onAddSection(module.id)}
            onDeleteSection={(sectionId) => onDeleteSection(module.id, sectionId)}
            canDelete={modules.length > 1}
          />
        );
      })}
    </div>
  );
}

function ModuleRow({
  module,
  selection,
  itemProps,
  handleProps,
  dragging,
  over,
  onReorderSections,
  onSelectSection,
  onRename,
  onRenameSubtitle,
  onDelete,
  onAddSection,
  onDeleteSection,
  canDelete,
}: {
  module: CourseModule;
  selection: Selection;
  itemProps: React.HTMLAttributes<HTMLDivElement> & { draggable?: boolean };
  handleProps: React.HTMLAttributes<HTMLButtonElement>;
  dragging: boolean;
  over: boolean;
  onReorderSections: (s: CourseSection[]) => void;
  onSelectSection: (moduleId: string, sectionId: string) => void;
  onRename: (title: string) => void;
  onRenameSubtitle: (subtitle: string) => void;
  onDelete: () => void;
  onAddSection: () => void;
  onDeleteSection: (sectionId: string) => void;
  canDelete: boolean;
}) {
  const [open, setOpen] = useState(true);
  const sectionReorder = useReorder(module.sections, onReorderSections);

  return (
    <div
      {...itemProps}
      className={`rounded-lg transition-all ${dragging ? "opacity-40" : ""} ${over ? "ring-2 ring-[#FFD96F]/50" : ""}`}
    >
      <div className="group/mod flex items-center gap-1 rounded-lg px-1 py-1 hover:bg-gray-hover/60">
        <button {...handleProps} className="cursor-grab rounded p-1 text-gray-extra-light hover:text-gray-dark active:cursor-grabbing" aria-label="Drag module">
          <GripVertical className="h-4 w-4" />
        </button>
        <button onClick={() => setOpen((o) => !o)} className="rounded p-0.5 text-gray-light hover:text-gray-dark" aria-label={open ? "Collapse" : "Expand"}>
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? "" : "-rotate-90"}`} />
        </button>
        <input
          value={module.title}
          onChange={(e) => onRename(e.target.value)}
          placeholder="Module title"
          className={`${railInput} text-[14px] font-semibold`}
        />
        {canDelete && (
          <button onClick={onDelete} className="shrink-0 rounded p-1 text-gray-extra-light opacity-0 transition-opacity hover:text-red-500 group-hover/mod:opacity-100" aria-label="Delete module">
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {open && (
        <div className="ml-6 flex flex-col gap-0.5 border-l border-gray-stroke pb-1 pl-2">
          <input
            value={module.subtitle ?? ""}
            onChange={(e) => onRenameSubtitle(e.target.value)}
            placeholder="Add a subtitle…"
            className={`${railInput} text-[12px] text-gray-light`}
          />
          {module.sections.map((section, i) => {
            const st = sectionReorder.state(i);
            const active = selection.type === "section" && selection.sectionId === section.id;
            return (
              <div
                key={section.id}
                {...sectionReorder.itemProps(i)}
                className={`group/sec flex items-center gap-1 rounded-md transition-all ${st.dragging ? "opacity-40" : ""} ${st.over ? "ring-2 ring-[#FFD96F]/50" : ""}`}
              >
                <button {...sectionReorder.handleProps} className="cursor-grab rounded p-1 text-gray-extra-light opacity-0 hover:text-gray-dark active:cursor-grabbing group-hover/sec:opacity-100" aria-label="Drag section">
                  <GripVertical className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => onSelectSection(module.id, section.id)}
                  className={`flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] transition-colors ${active ? "bg-gray-dark font-medium text-white" : "text-gray-dark hover:bg-gray-hover"}`}
                >
                  <span className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${active ? "bg-white/20 text-white" : "border border-gray-stroke text-gray-light"}`}>{i + 1}</span>
                  <span className="truncate">{section.title || "Untitled section"}</span>
                </button>
                <button onClick={() => onDeleteSection(section.id)} className="shrink-0 rounded p-1 text-gray-extra-light opacity-0 transition-opacity hover:text-red-500 group-hover/sec:opacity-100" aria-label="Delete section">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
          <button
            onClick={onAddSection}
            className="mt-0.5 flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[13px] font-medium text-gray-light transition-colors hover:bg-gray-hover hover:text-gray-dark"
          >
            <Plus className="h-3.5 w-3.5" /> Add section
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Section page editor (main area) ─────────────────────────────────────────

function SectionEditor({
  module,
  section,
  onChange,
}: {
  module: CourseModule;
  section: CourseSection;
  onChange: (patch: Partial<CourseSection>) => void;
}) {
  const [mode, setMode] = useState<"edit" | "preview">("edit");

  return (
    <div className="mx-auto max-w-[760px] px-6 py-8 md:px-10">
      {/* Breadcrumb + mode toggle */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="min-w-0 truncate text-[13px] text-gray-light">
          {module.title} <span className="mx-1 text-gray-extra-light">/</span>
          <span className="text-gray-dark">{section.title || "Untitled section"}</span>
        </p>
        <div className="inline-flex shrink-0 items-center gap-1 rounded-full bg-gray-hover p-1">
          {([["edit", "Edit", Pencil], ["preview", "Preview", Eye]] as const).map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${mode === key ? "bg-white text-gray-dark shadow-[0_1px_2px_rgba(0,0,0,0.12)]" : "text-gray-light hover:text-gray-dark"}`}
            >
              <Icon className="h-3.5 w-3.5" /> {label}
            </button>
          ))}
        </div>
      </div>

      {mode === "edit" ? (
        <>
          {/* Section title + description */}
          <input
            value={section.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Section title"
            className="w-full bg-transparent text-[30px] font-semibold leading-tight text-gray-dark placeholder:text-gray-extra-light focus:outline-none"
          />
          <textarea
            value={section.description ?? ""}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Add a short description (optional)"
            rows={2}
            className="mt-2 w-full resize-none bg-transparent text-[16px] leading-relaxed text-gray-light placeholder:text-gray-extra-light focus:outline-none"
          />

          <div className="mt-6 border-t border-gray-stroke pt-6">
            <BlockListEditor blocks={section.blocks} onChange={(blocks) => onChange({ blocks })} />
          </div>
        </>
      ) : (
        <SectionPreview section={section} />
      )}
    </div>
  );
}

function SectionPreview({ section }: { section: CourseSection }) {
  return (
    <div>
      <h1 className="font-serif text-[40px] leading-[1.05] text-gray-dark">{section.title || "Untitled section"}</h1>
      {section.description ? (
        <p className="mt-3 text-[18px] leading-relaxed text-gray-light">{section.description}</p>
      ) : null}
      {section.blocks.length > 0 ? (
        <div className="mt-8">
          <BlockList blocks={section.blocks} />
        </div>
      ) : (
        <p className="mt-8 text-[14px] italic text-gray-extra-light">No content yet — switch to Edit to add sections.</p>
      )}
    </div>
  );
}

// ─── Course details panel (main area) ────────────────────────────────────────

function DetailsPanel({
  course,
  setCourse,
  onDeleted,
}: {
  course: BuilderCourse;
  setCourse: (updater: (prev: BuilderCourse) => BuilderCourse) => void;
  onDeleted: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const moduleCount = course.modules.length;
  const sectionCount = course.modules.reduce((n, m) => n + m.sections.length, 0);

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCourse((c) => ({ ...c, coverImage: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const labelClass = "text-[13px] font-semibold text-gray-dark";
  const inputClass =
    "w-full rounded-lg border border-gray-stroke bg-white px-3.5 py-2.5 text-[15px] text-gray-dark placeholder:text-gray-extra-light focus:border-gray-dark focus:outline-none";

  return (
    <div className="mx-auto max-w-[720px] px-6 py-8 md:px-10">
      <h1 className="font-serif text-[36px] leading-tight text-gray-dark">Course details</h1>
      <p className="mt-1.5 text-[16px] text-gray-light">The name, summary, and cover learners see before enrolling.</p>

      {/* Cover image */}
      <div className="mt-8">
        <p className={labelClass}>Cover image</p>
        <div className="mt-2.5 flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="relative aspect-[1.91/1] w-full max-w-[280px] shrink-0 overflow-hidden rounded-xl border border-gray-stroke bg-gray-hover">
            {course.coverImage ? (
              <img src={course.coverImage} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-extra-light"><ImageIcon className="h-8 w-8" /></div>
            )}
          </div>
          <div className="flex flex-1 flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              {COVER_PRESETS.map((src) => (
                <button
                  key={src}
                  onClick={() => setCourse((c) => ({ ...c, coverImage: src }))}
                  className={`h-11 w-16 overflow-hidden rounded-md border transition-all ${course.coverImage === src ? "border-gray-dark ring-2 ring-[#FFD96F]" : "border-gray-stroke hover:border-gray-dark"}`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
            <div>
              <Button size="sm" variant="secondary" rounded="rounded-full" className="font-semibold" onClick={() => fileInputRef.current?.click()}>
                Upload image
              </Button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onUpload} />
            </div>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="mt-8">
        <label className="flex flex-col gap-2">
          <span className={labelClass}>Course title</span>
          <input value={course.title} onChange={(e) => setCourse((c) => ({ ...c, title: e.target.value }))} placeholder="e.g. AI Builder Program Level 1" className={inputClass} />
        </label>
      </div>

      {/* Description */}
      <div className="mt-6">
        <label className="flex flex-col gap-2">
          <span className={labelClass}>Description</span>
          <textarea value={course.description} onChange={(e) => setCourse((c) => ({ ...c, description: e.target.value }))} placeholder="What will learners be able to do after this course?" rows={4} className={`${inputClass} resize-y leading-relaxed`} />
        </label>
      </div>

      {/* Stats */}
      <div className="mt-8 flex gap-3">
        <div className="flex-1 rounded-xl border border-gray-stroke bg-white px-4 py-3">
          <p className="text-[22px] font-semibold text-gray-dark">{moduleCount}</p>
          <p className="text-[13px] text-gray-light">{moduleCount === 1 ? "Module" : "Modules"}</p>
        </div>
        <div className="flex-1 rounded-xl border border-gray-stroke bg-white px-4 py-3">
          <p className="text-[22px] font-semibold text-gray-dark">{sectionCount}</p>
          <p className="text-[13px] text-gray-light">{sectionCount === 1 ? "Section" : "Sections"}</p>
        </div>
        <div className="flex-1 rounded-xl border border-gray-stroke bg-white px-4 py-3">
          <p className="flex items-center gap-1.5 text-[22px] font-semibold text-gray-dark">
            {course.status === "published" ? <><Check className="h-5 w-5 text-[#1E7B34]" /> Live</> : "Draft"}
          </p>
          <p className="text-[13px] text-gray-light">Status</p>
        </div>
      </div>

      {/* Danger zone */}
      <div className="mt-12 border-t border-gray-stroke pt-6">
        <button onClick={() => setConfirmDelete(true)} className="inline-flex items-center gap-2 text-[14px] font-medium text-[#DC2B23] hover:underline">
          <Trash2 className="h-4 w-4" /> Delete course
        </button>
      </div>

      <ConfirmModal
        open={confirmDelete}
        title={`Delete “${course.title || "Untitled course"}”?`}
        body="This permanently removes the course and all its modules and sections. This can't be undone."
        confirmLabel="Delete course"
        onConfirm={() => {
          deleteCourse(course.id);
          setConfirmDelete(false);
          onDeleted();
        }}
        onClose={() => setConfirmDelete(false)}
      />
    </div>
  );
}
