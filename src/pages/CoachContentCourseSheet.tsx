import { Button } from "../components/Button";
import { DetailSheet, DetailRow, StatCard, OfferingsSection } from "../components/DetailSheet";
import { courseStats, type BuilderCourse } from "../lib/courses";
import editIcon from "../assets/icons/edit.svg";
import myCoursesIcon from "../assets/icons/my-courses.svg";

// Right-side detail sheet for a course. Clicking a course row opens this
// (read-only overview); the footer CTA hands off to the builder via `onEdit`.
export default function CoachContentCourseSheet({ course, onClose, onEdit }: { course: BuilderCourse | null; onClose: () => void; onEdit: () => void }) {
  const lelandPlus = course?.lelandPlus ?? false;
  const offerings = course?.offerings ?? [];
  const published = course?.status === "published";
  return (
    <DetailSheet
      open={!!course}
      onClose={onClose}
      title={course?.title || "Untitled course"}
      meta={
        <>
          <span className={`rounded-full px-2.5 py-1 text-[13px] font-medium ${published ? "bg-[#E5F3EC] text-[#1B7A4B]" : "bg-gray-hover text-gray-light"}`}>{published ? "Published" : "Draft"}</span>
          {lelandPlus && <span className="rounded-full bg-[#F1ECFB] px-2.5 py-1 text-[13px] font-medium text-[#6B4BB8]">Leland+</span>}
          <span className="text-gray-extra-light">·</span>
          <span>{offerings.length > 0 ? `${offerings.length} offering${offerings.length === 1 ? "" : "s"}` : "Not sold on your profile"}</span>
        </>
      }
      footer={
        <Button size="lg" variant="secondary" rounded="rounded-full" className="w-full font-semibold" onClick={onEdit}>
          <img src={editIcon} alt="" className="h-[18px] w-[18px]" />
          Edit course
        </Button>
      }
    >
      {course && <CourseBody course={course} />}
    </DetailSheet>
  );
}

function CourseBody({ course: c }: { course: BuilderCourse }) {
  const stats = courseStats(c);
  const lelandPlus = c.lelandPlus ?? false;
  const offerings = c.offerings ?? [];

  return (
    <div className="flex flex-col gap-8">
      {/* Preview */}
      <div className="overflow-hidden rounded-2xl border border-gray-stroke bg-gray-hover">
        {c.coverImage ? (
          <img src={c.coverImage} alt="" className="aspect-video w-full object-cover" />
        ) : (
          <div className="flex aspect-video w-full items-center justify-center">
            <img src={myCoursesIcon} alt="" className="h-10 w-10 opacity-25" />
          </div>
        )}
      </div>

      {/* Details */}
      <section>
        <h3 className="text-[18px] font-semibold text-gray-dark">Details</h3>
        <div className="mt-2">
          <DetailRow label="Description">{c.description || <span className="text-gray-extra-light">—</span>}</DetailRow>
          <DetailRow label="Status">{c.status === "published" ? "Published" : "Draft"}</DetailRow>
          <DetailRow label="Structure">{stats.modules} {stats.modules === 1 ? "lesson" : "lessons"} · {stats.sections} {stats.sections === 1 ? "page" : "pages"}</DetailRow>
          <DetailRow label="Included in Leland+">{lelandPlus ? "Yes" : "No"}</DetailRow>
          <DetailRow label="Sold on profile" divider={false}>{offerings.length > 0 ? `Yes — in ${offerings.length} offering${offerings.length === 1 ? "" : "s"}` : <span className="text-gray-extra-light">Not yet</span>}</DetailRow>
        </div>
      </section>

      {/* Curriculum */}
      <section>
        <h3 className="text-[18px] font-semibold text-gray-dark">Curriculum</h3>
        <p className="mt-1 text-[14px] text-gray-light">{stats.modules} {stats.modules === 1 ? "lesson" : "lessons"}, {stats.sections} {stats.sections === 1 ? "page" : "pages"}.</p>
        <div className="mt-4 flex flex-col gap-3">
          {c.modules.map((m, i) => (
            <div key={m.id} className="rounded-xl border border-gray-stroke bg-white p-4">
              <p className="text-[15px] font-semibold text-gray-dark">Lesson {i + 1}: {m.title || "Untitled lesson"}</p>
              {m.subtitle && <p className="mt-0.5 text-[13px] text-gray-light">{m.subtitle}</p>}
              {m.sections.length > 0 && (
                <ul className="mt-2.5 flex flex-col gap-1.5">
                  {m.sections.map((s) => (
                    <li key={s.id} className="flex items-center gap-2 text-[14px] text-gray-light">
                      <span className="h-1 w-1 shrink-0 rounded-full bg-gray-extra-light" />
                      {s.title || "Untitled page"}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      <OfferingsSection slugs={offerings} emptyText="This course isn't part of any offerings yet." />

      {/* Leland+ performance */}
      <section>
        <h3 className="text-[18px] font-semibold text-gray-dark">Leland+ performance</h3>
        {lelandPlus ? (
          <>
            <p className="mt-1 text-[14px] text-gray-light">How this course is performing in the Leland+ library.</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <StatCard value={(c.views ?? 0).toLocaleString()} label="Views" />
              <StatCard value={`${stats.modules}`} label="Lessons" />
            </div>
          </>
        ) : (
          <div className="mt-4 flex flex-col items-start gap-3 rounded-2xl bg-gray-hover p-5">
            <p className="text-[15px] text-gray-light">This course isn't part of Leland+. Add it to the library to earn passive income as members engage with it.</p>
            <Button size="md" variant="dark" rounded="rounded-full" className="font-semibold">Add to Leland+</Button>
          </div>
        )}
      </section>
    </div>
  );
}
