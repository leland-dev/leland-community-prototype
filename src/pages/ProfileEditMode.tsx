import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { useExpertMode } from "../contexts/ExpertModeContext";
import coverImage from "../assets/img/cover-image-2.png";
import profilePhoto from "../assets/profile photos/profile photo.png";
import verifiedIcon from "../assets/icons/verified-new.svg";
import editIcon from "../assets/icons/edit.svg";
import addPlusIcon from "../assets/icons/add-plus.svg";
import eyeIcon from "../assets/icons/eye.svg";
import chevronRightIcon from "../assets/icons/chevron-right.svg";
import videoThumbnail from "../assets/img/Video-Thumbnail.png";
import starIcon from "../assets/icons/star.svg";
import atlassianLogo from "../assets/logos/atlassian.png";
import yaleLogo from "../assets/logos/yale.png";
import clientLogo1 from "../assets/logos/Rectangle 3012.png";
import clientLogo2 from "../assets/logos/Rectangle 3013.png";
import clientLogo3 from "../assets/logos/Rectangle 3017.png";
import clientLogo4 from "../assets/logos/Rectangle 3018.png";
import mbaIcon from "../assets/icons/category-icons/mba.svg";
import consultingIcon from "../assets/icons/category-icons/consulting.svg";
import pmIcon from "../assets/icons/category-icons/product-management.svg";

/* ─────────────────────────────────────────────────────────────────────────
   My Leland → Profile — "Edit mode"

   A beige, card-based editor that mirrors the Dashboard tab's treatment: each
   profile section sits in its own white card. Shared cards (Hero, About,
   Education, Experience) show for everyone; coaching cards (Categories, Profile
   video, Why I coach, Reviews) show only for experts.
   ───────────────────────────────────────────────────────────────────────── */

// Dashboard-style white card.
function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl bg-white p-5 shadow-[0_1px_2px_0_rgba(16,24,40,0.06)] ring-1 ring-[#222222]/10 sm:p-6 ${className}`}>
      {children}
    </section>
  );
}

// Card heading row: title with an action on the right.
function CardHead({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-[20px] font-semibold text-gray-dark">{title}</h2>
      {action}
    </div>
  );
}

function EditButton({ label = "Edit", icon = editIcon, onClick }: { label?: string; icon?: string; onClick?: () => void }) {
  return (
    <Button size="sm" variant="secondary" rounded="rounded-full" className="shrink-0 text-[14px] font-semibold" onClick={onClick}>
      <img src={icon} alt="" className="h-[16px] w-[16px]" />
      {label}
    </Button>
  );
}

// Inline-editable multiline text: paragraph + Edit, swaps to a textarea.
function EditableParagraph({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  if (editing) {
    return (
      <div>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          autoFocus
          rows={5}
          className="w-full resize-y rounded-xl border border-gray-300 bg-white p-3 text-[16px] leading-[1.6] text-[#4C4C4C] outline-none focus:border-gray-dark"
        />
        <div className="mt-3 flex gap-2">
          <Button size="sm" variant="primary" rounded="rounded-full" onClick={() => { onChange(draft); setEditing(false); }}>Save</Button>
          <Button size="sm" variant="secondary" rounded="rounded-full" onClick={() => { setDraft(value); setEditing(false); }}>Cancel</Button>
        </div>
      </div>
    );
  }
  return (
    <div className="group">
      <div className="flex items-start justify-between gap-3">
        <p className="whitespace-pre-line text-[16px] leading-[1.6] text-[#4C4C4C]">{value}</p>
        <button
          onClick={() => { setDraft(value); setEditing(true); }}
          aria-label="Edit"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all hover:bg-gray-hover md:opacity-0 md:group-hover:opacity-100"
        >
          <img src={editIcon} alt="" className="h-4 w-4 opacity-60" />
        </button>
      </div>
    </div>
  );
}

function OrgTile({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl text-[16px] font-semibold text-white" style={{ backgroundColor: color }}>
      {label}
    </div>
  );
}

type Credential = { id: string; tileLabel: string; tileColor: string; title: string; subtitle: string; featured?: boolean };

function CredentialRow({ item, onRemove }: { item: Credential; onRemove: () => void }) {
  return (
    <div className="group flex items-start gap-4 rounded-xl px-2 py-2 transition-colors hover:bg-[#fafafa]">
      <OrgTile label={item.tileLabel} color={item.tileColor} />
      <div className="min-w-0 flex-1">
        <p className="text-[16px] font-medium text-gray-dark">{item.title}</p>
        <p className="mt-[2px] text-[14px] text-[#707070]">{item.subtitle}</p>
      </div>
      <div className="flex items-center gap-1">
        {item.featured && (
          <span className="mr-1 flex items-center gap-1 rounded-full bg-[#f5f5f5] px-2.5 py-1 text-[13px] font-medium text-gray-dark">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#FFD96F"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
            Featured
          </span>
        )}
        <button aria-label="Edit" className="flex h-8 w-8 items-center justify-center rounded-full text-[#9B9B9B] opacity-0 transition-all hover:bg-[#f5f5f5] group-hover:opacity-100">
          <img src={editIcon} alt="" className="h-4 w-4 opacity-60" />
        </button>
        <button onClick={onRemove} aria-label="Remove" className="flex h-8 w-8 items-center justify-center rounded-full text-[#9B9B9B] opacity-0 transition-all hover:bg-[#f5f5f5] group-hover:opacity-100">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  );
}

function Stars({ n = 5 }: { n?: number }) {
  return (
    <div className="flex items-center gap-[1px]">
      {Array.from({ length: n }).map((_, i) => (
        <svg key={i} width="15" height="15" viewBox="0 0 24 24" fill="#FFC65C"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
      ))}
    </div>
  );
}

const categoryListings = [
  { slug: "mba", category: "MBA", headline: "MBA Admissions Coach | Stanford GSB | 100+ M7 Admits", icon: mbaIcon },
  { slug: "management-consulting", category: "Management Consulting", headline: "Ex-McKinsey Consultant | Wharton MBA | Case Prep Pro", icon: consultingIcon },
  { slug: "product-management", category: "Product Management", headline: "Senior PM at LinkedIn | Ex-Meta | Breaking Into Tech", icon: pmIcon },
];

const reviewPreviews = [
  { id: "r1", name: "Priya N.", role: "MBA Admissions", rating: 5, text: "Sharp, specific feedback on every essay — helped me find the story I didn't know I had." },
  { id: "r2", name: "Marcus W.", role: "Interview Prep", rating: 5, text: "The mock interviews were incredibly realistic. I walked into every real one feeling calm." },
];

export default function ProfileEditMode() {
  const { expert } = useExpertMode();

  const name = "Alex Rivera";
  const [headline, setHeadline] = useState(
    expert
      ? "MBA Admissions Coach | Stanford GSB | 100+ M7 Admits"
      : "Building products that matter. Passionate about AI, design, and helping others break into tech.",
  );
  const [editingHeadline, setEditingHeadline] = useState(false);
  const [headlineDraft, setHeadlineDraft] = useState(headline);

  const [about, setAbout] = useState(
    "I help ambitious professionals break into top MBA programs and land PM roles at leading tech companies. With 8+ years in product at LinkedIn and Meta, plus my own Stanford GSB journey, I bring firsthand experience to every conversation.",
  );
  const [whyCoach, setWhyCoach] = useState(
    "I remember how overwhelming the application process felt, and how much a great mentor changed my trajectory. Coaching is my way of paying that forward — helping people tell their most honest, compelling story.",
  );

  const [experiences, setExperiences] = useState<Credential[]>([
    { id: "e1", tileLabel: "in", tileColor: "#0A66C2", title: "Senior Product Manager", subtitle: "LinkedIn · 2019 – Present", featured: true },
    { id: "e2", tileLabel: "M", tileColor: "#1877F2", title: "Product Manager", subtitle: "Meta · 2016 – 2019" },
    { id: "e3", tileLabel: "G", tileColor: "#0F9D58", title: "Associate Product Manager", subtitle: "Google · 2012 – 2015" },
  ]);
  const [education, setEducation] = useState<Credential[]>([
    { id: "d1", tileLabel: "S", tileColor: "#8C1515", title: "Stanford Graduate School of Business", subtitle: "MBA · 2016 – 2018", featured: true },
    { id: "d2", tileLabel: "Y", tileColor: "#00356B", title: "Yale University", subtitle: "BA, Economics · 2008 – 2012" },
  ]);

  return (
    <div className="flex flex-col gap-4">
      {/* Banner — links to the public-facing profile (wired later) */}
      <button
        type="button"
        className="group flex w-full items-center gap-2.5 rounded-xl bg-gray-hover px-4 py-3.5 text-left transition-colors hover:bg-[rgba(34,34,34,0.1)]"
      >
        <img src={eyeIcon} alt="" className="h-[18px] w-[18px] shrink-0 opacity-60" />
        <span className="flex-1 text-[15px] font-medium text-gray-dark">View your public profile</span>
        <img src={chevronRightIcon} alt="" className="h-5 w-5 shrink-0 opacity-50 transition-transform group-hover:translate-x-0.5" />
      </button>

      {/* Hero */}
      <Card>
        <div className="relative">
          <img src={coverImage} alt="Cover" className="h-[150px] w-full rounded-[10px] object-cover" />
          <button className="absolute right-3 top-3 flex h-8 items-center gap-1.5 rounded-full bg-white/90 px-3 text-[13px] font-medium text-gray-dark backdrop-blur transition-colors hover:bg-white">
            <img src={editIcon} alt="" className="h-[14px] w-[14px] opacity-70" />
            Edit cover
          </button>
        </div>
        <div className="-mt-12 px-1">
          <div className="relative inline-block">
            <img src={profilePhoto} alt={name} className="h-28 w-28 rounded-full border-4 border-white object-cover" />
            <button aria-label="Edit photo" className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-dark text-white transition-colors hover:bg-black">
              <img src={editIcon} alt="" className="h-[14px] w-[14px] brightness-0 invert" />
            </button>
          </div>
          <div className="mt-3">
            {/* Name (+ verified + Top Expert for experts) */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              {expert ? (
                <>
                  <span className="text-[16px] font-medium text-gray-dark">{name}</span>
                  <img src={verifiedIcon} alt="Verified" className="h-[19px] w-[19px]" />
                  <span className="text-[16px] text-[#999999]">·</span>
                  <span className="text-[16px] text-gray-light"><span className="text-[14px]">🏆</span> Top Expert</span>
                </>
              ) : (
                <h2 className="font-serif text-[26px] leading-tight text-gray-dark">{name}</h2>
              )}
            </div>

            {/* Headline — large serif for experts, bio body text for customers */}
            {editingHeadline ? (
              <div className="mt-2">
                <textarea
                  value={headlineDraft}
                  onChange={(e) => setHeadlineDraft(e.target.value)}
                  autoFocus
                  rows={2}
                  className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-[16px] text-gray-dark outline-none focus:border-gray-dark"
                />
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="primary" rounded="rounded-full" onClick={() => { setHeadline(headlineDraft); setEditingHeadline(false); }}>Save</Button>
                  <Button size="sm" variant="secondary" rounded="rounded-full" onClick={() => { setHeadlineDraft(headline); setEditingHeadline(false); }}>Cancel</Button>
                </div>
              </div>
            ) : expert ? (
              <p className="mt-1.5 font-serif text-[26px] font-medium leading-[1.3] text-gray-dark">{headline}</p>
            ) : (
              <p className="mt-1.5 text-[16px] leading-[1.45] text-gray-dark">{headline}</p>
            )}

            {/* Featured organizations (+ successful clients for experts) */}
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[14px] leading-tight text-gray-light">
              <div className="flex items-center gap-[6px]">
                <img src={atlassianLogo} alt="Atlassian" className="h-[18px] w-[18px] rounded" />
                <span>Atlassian</span>
              </div>
              <div className="flex items-center gap-[6px]">
                <img src={yaleLogo} alt="Yale University" className="h-[18px] w-[18px] rounded" />
                <span>Yale University</span>
              </div>
              {expert && (
                <div className="hidden items-center gap-[6px] sm:flex">
                  <span>Successful clients at</span>
                  <div className="flex items-center -space-x-[2px]">
                    <img src={clientLogo1} alt="" className="h-[18px] w-[18px] rounded border border-white" />
                    <img src={clientLogo2} alt="" className="h-[18px] w-[18px] rounded border border-white" />
                    <img src={clientLogo3} alt="" className="h-[18px] w-[18px] rounded border border-white" />
                    <img src={clientLogo4} alt="" className="h-[18px] w-[18px] rounded border border-white" />
                  </div>
                </div>
              )}
            </div>

            {/* Reviews — experts only */}
            {expert && (
              <div className="mt-3 flex items-center gap-2">
                <div className="flex items-center gap-[1px]">
                  {[...Array(5)].map((_, i) => (
                    <img key={i} src={starIcon} alt="" className="h-[16px] w-[16px]" />
                  ))}
                </div>
                <span className="text-[15px] font-semibold leading-none text-gray-dark">4.9</span>
                <span className="text-[15px] leading-none text-[#707070]">52 Reviews</span>
              </div>
            )}

            {/* Metrics */}
            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-3">
              {expert && (
                <div className="flex flex-col gap-[2px]">
                  <span className="text-[16px] font-semibold leading-none text-gray-dark">6.6k</span>
                  <span className="text-[14px] leading-tight text-[#707070]">Expert mins</span>
                </div>
              )}
              <div className="flex flex-col gap-[2px]">
                <span className="text-[16px] font-semibold leading-none text-gray-dark">84</span>
                <span className="text-[14px] leading-tight text-[#707070]">Followers</span>
              </div>
              <div className="flex flex-col gap-[2px]">
                <span className="text-[16px] font-semibold leading-none text-gray-dark">1.6k</span>
                <span className="text-[14px] leading-tight text-[#707070]">Likes</span>
              </div>
              <div className="flex flex-col gap-[2px]">
                <span className="text-[16px] font-semibold leading-none text-gray-dark">8.5k</span>
                <span className="text-[14px] leading-tight text-[#707070]">Impressions</span>
              </div>
            </div>

            {/* Edit intro */}
            {!editingHeadline && (
              <div className="mt-4">
                <EditButton label="Edit intro" onClick={() => { setHeadlineDraft(headline); setEditingHeadline(true); }} />
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Categories — experts only, directly under the Hero */}
      {expert && (
        <Card>
          <CardHead title="Categories" action={<EditButton label="Add category" icon={addPlusIcon} />} />
          <div className="flex flex-col gap-1">
            {categoryListings.map(({ slug, category, headline: h, icon }) => (
              <Link key={category} to={`/my-leland/manage/${slug}`} className="group flex items-center gap-3 rounded-xl px-2 py-3 no-underline transition-colors hover:bg-gray-hover">
                <div className="icon-tile flex h-11 w-11 shrink-0 items-center justify-center rounded-[6px] bg-[#f5f5f5]">
                  <img src={icon} alt="" className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold leading-tight text-gray-dark">{category}</p>
                  <p className="mt-[2px] truncate text-[15px] leading-tight text-[#707070]">{h}</p>
                </div>
                <img src={chevronRightIcon} alt="" className="h-6 w-6 shrink-0 opacity-60" />
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* About */}
      <Card>
        <CardHead title={`About ${name.split(" ")[0]}`} />
        <EditableParagraph value={about} onChange={setAbout} />
      </Card>

      {/* Intro Video — experts only */}
      {expert && (
        <Card>
          <CardHead title="Intro Video" action={<EditButton />} />
          <div className="relative overflow-hidden rounded-xl">
            <img src={videoThumbnail} alt="Intro video" className="aspect-video w-full object-cover" />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-md">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#222222"><path d="M8 5v14l11-7z" /></svg>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Why I coach — experts only */}
      {expert && (
        <Card>
          <CardHead title="Why I coach" />
          <EditableParagraph value={whyCoach} onChange={setWhyCoach} />
        </Card>
      )}

      {/* Education */}
      <Card>
        <CardHead title="Education" action={<EditButton label="Add" icon={addPlusIcon} />} />
        <div className="flex flex-col gap-1">
          {education.map((item) => (
            <CredentialRow key={item.id} item={item} onRemove={() => setEducation((p) => p.filter((e) => e.id !== item.id))} />
          ))}
        </div>
      </Card>

      {/* Experience */}
      <Card>
        <CardHead title="Experience" action={<EditButton label="Add" icon={addPlusIcon} />} />
        <div className="flex flex-col gap-1">
          {experiences.map((item) => (
            <CredentialRow key={item.id} item={item} onRemove={() => setExperiences((p) => p.filter((e) => e.id !== item.id))} />
          ))}
        </div>
      </Card>

      {/* Reviews — experts only; preview linking to the full Reviews page */}
      {expert && (
        <Card>
          <CardHead
            title="Reviews"
            action={
              <Link to="/my-leland/reviews" className="flex items-center gap-1 rounded-full px-3 py-1.5 text-[14px] font-semibold text-gray-dark no-underline transition-colors hover:bg-gray-hover">
                See all
                <img src={chevronRightIcon} alt="" className="h-4 w-4 opacity-60" />
              </Link>
            }
          />
          <div className="mb-4 flex items-center gap-2">
            <Stars />
            <span className="text-[15px] font-semibold text-gray-dark">4.9</span>
            <span className="text-[14px] text-[#707070]">· 52 reviews</span>
          </div>
          <div className="flex flex-col gap-3">
            {reviewPreviews.map((r) => (
              <div key={r.id} className="rounded-xl bg-[#fafafa] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[15px] font-semibold text-gray-dark">{r.name}</p>
                  <Stars n={r.rating} />
                </div>
                <p className="mt-0.5 text-[13px] text-[#9B9B9B]">{r.role}</p>
                <p className="mt-2 text-[15px] leading-[1.5] text-[#4C4C4C]">{r.text}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
