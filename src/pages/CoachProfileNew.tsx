import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button, LinkButton } from "../components/Button";
import coverImage from "../assets/img/cover-image-2.png";
import samanthaPhoto from "../assets/profile photos/pic-6.png";
import verifiedIcon from "../assets/icons/verified.svg";
import editIcon from "../assets/icons/edit.svg";
import addPlusIcon from "../assets/icons/add-plus.svg";
import videoThumbnail from "../assets/img/Video-Thumbnail.png";

// Secondary gray edit/add button used across the page.
function EditButton({ label = "Edit", icon = editIcon }: { label?: string; icon?: string }) {
  return (
    <Button size="sm" variant="secondary">
      <img src={icon} alt="" className="h-4 w-4" />
      {label}
    </Button>
  );
}

// Editable section wrapper: a heading, freeform content, then the edit/add
// action anchored at the bottom of the section. Matches the customer-facing
// profile's section rhythm while signalling that everything here is editable.
function Section({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section>
      <div className="mb-4 mt-9 border-t border-gray-200 pt-9" />
      <h2 className="mb-4 text-[22px] font-semibold text-gray-dark">{title}</h2>
      {children}
      <div className="mt-4">{action ?? <EditButton />}</div>
    </section>
  );
}

// Colored initials tile used for education / experience rows (mirrors the
// current edit form, which shows colored org squares).
function OrgTile({ label, color }: { label: string; color: string }) {
  return (
    <div
      className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl text-[16px] font-semibold text-white"
      style={{ backgroundColor: color }}
    >
      {label}
    </div>
  );
}

function CredentialRow({
  tile,
  title,
  subtitle,
  featured,
}: {
  tile: ReactNode;
  title: string;
  subtitle: string;
  featured?: boolean;
}) {
  return (
    <div className="group flex items-start gap-4 rounded-xl px-2 py-2 transition-colors hover:bg-[#fafafa]">
      {tile}
      <div className="min-w-0 flex-1">
        <p className="text-[16px] font-medium text-gray-dark">{title}</p>
        <p className="mt-[2px] text-[14px] text-[#707070]">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2">
        {featured && (
          <span className="flex items-center gap-1 rounded-full bg-[#f5f5f5] px-2.5 py-1 text-[13px] font-medium text-gray-dark">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#FFD96F">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Featured
          </span>
        )}
        <button className="flex h-8 w-8 items-center justify-center rounded-full text-[#9B9B9B] opacity-0 transition-all hover:bg-[#f5f5f5] group-hover:opacity-100">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="3" cy="8" r="1.5" />
            <circle cx="8" cy="8" r="1.5" />
            <circle cx="13" cy="8" r="1.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}

const categoryListings = [
  {
    slug: "product-management",
    category: "Product Management",
    headline: "Experienced Product Leader at LinkedIn | Ex-Meta | Stanford GSB",
  },
  {
    slug: "mba",
    category: "MBA",
    headline: "MBA Expert | Stanford GSB | 100+ M7 Admits",
  },
  {
    slug: "college",
    category: "College",
    headline: "College Admissions Expert | Yale Grad | 50+ Ivy League Admits",
  },
];

const specialties = ["First generation", "International", "LGBTQ+", "Low income", "Veteran"];
const activeSpecialties = new Set(["International"]);

export default function CoachProfileNew() {
  useEffect(() => {
    document.title = "Leland Prototype | Profile (new)";
  }, []);

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[30px] font-medium text-gray-dark md:text-[38px]">Profile</h1>
          <p className="mt-2 text-[16px] leading-[1.45] text-[#707070]">
            An approximate preview of your public profile. Edit any section inline.
          </p>
        </div>
        <LinkButton size="md" variant="secondary" href="/profile/samantha-parker">
          View public profile
        </LinkButton>
      </div>

      {/* Preview column — mirrors the narrow customer-facing profile layout */}
      <div className="mx-auto mt-8 max-w-[720px]">
        {/* Cover */}
        <div className="relative">
          <img src={coverImage} alt="Cover" className="h-[180px] w-full rounded-[6px] object-cover" />
          <button className="absolute right-3 top-3 flex h-8 items-center gap-1.5 rounded-full bg-white/90 px-3 text-[13px] font-medium text-gray-dark backdrop-blur transition-colors hover:bg-white">
            <img src={editIcon} alt="" className="h-[14px] w-[14px] opacity-70" />
            Edit cover
          </button>
        </div>

        {/* Avatar + identity */}
        <div className="-mt-14 px-1">
          <div className="relative inline-block">
            <img
              src={samanthaPhoto}
              alt="Samantha Parker"
              className="h-32 w-32 rounded-full border-4 border-white object-cover"
            />
            <button
              aria-label="Edit photo"
              className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gray-dark text-white transition-colors hover:bg-black"
            >
              <img src={editIcon} alt="" className="h-[15px] w-[15px] brightness-0 invert" />
            </button>
          </div>

          <div className="mt-3">
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-[26px] leading-tight text-gray-dark">Samantha Parker</h2>
              <img src={verifiedIcon} alt="Verified" className="h-[19px] w-[19px]" />
            </div>
            <p className="mt-1 text-[16px] leading-[1.35] text-[#707070]">
              Experienced Product Leader at LinkedIn <span className="text-[#9B9B9B]">|</span> Ex-Meta{" "}
              <span className="text-[#9B9B9B]">|</span> Stanford GSB
            </p>
            <p className="mt-1.5 text-[14px] text-[#9B9B9B]">Saratoga Springs, UT · English</p>
            <div className="mt-4">
              <EditButton />
            </div>
          </div>
        </div>

        {/* About */}
        <Section title="About Samantha">
          <p className="text-[16px] leading-[1.6] text-[#4C4C4C]">
            I help ambitious professionals break into top MBA programs and land PM roles at leading tech
            companies. With 8+ years in product at LinkedIn and Meta, plus my own Stanford GSB journey, I bring
            firsthand experience to every coaching session.
          </p>
        </Section>

        {/* Category listings */}
        <Section
          title="Category listings"
          action={<EditButton label="Add new category" icon={addPlusIcon} />}
        >
          <div className="overflow-hidden rounded-2xl border border-[#E5E5E5]">
            {categoryListings.map(({ slug, category, headline }, i) => (
              <Link
                key={category}
                to={`/coach/manage/${slug}`}
                className={`group flex items-center gap-3 px-5 py-4 no-underline transition-colors hover:bg-[#F5F5F5]${
                  i > 0 ? " border-t border-[#E5E5E5]" : ""
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[16px] font-medium leading-tight text-gray-dark">{category}</p>
                  <p className="mt-[2px] truncate text-[14px] leading-tight text-[#707070]">{headline}</p>
                </div>
                <span className="flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-[14px] font-medium text-[#707070] transition-colors group-hover:bg-white">
                  <img src={editIcon} alt="" className="h-[15px] w-[15px] opacity-60" />
                  Edit
                </span>
              </Link>
            ))}
          </div>
        </Section>

        {/* Why do I coach */}
        <Section title="Why do I coach?">
          <p className="text-[16px] leading-[1.6] text-[#4C4C4C]">
            I remember how overwhelming the application process felt, and how much a great mentor changed my
            trajectory. Coaching is my way of paying that forward — helping people tell their most honest,
            compelling story.
          </p>
        </Section>

        {/* Profile video */}
        <Section title="Profile video" action={<EditButton label="Edit link" />}>
          <div className="relative overflow-hidden rounded-xl">
            <img src={videoThumbnail} alt="Profile video" className="h-[260px] w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-md">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#222222">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        </Section>

        {/* Experience */}
        <Section title="Experience" action={<EditButton label="Add experience" icon={addPlusIcon} />}>
          <div className="flex flex-col gap-1">
            <CredentialRow
              tile={<OrgTile label="in" color="#0A66C2" />}
              title="Senior Product Manager"
              subtitle="LinkedIn · 2019 – Present"
              featured
            />
            <CredentialRow
              tile={<OrgTile label="M" color="#1877F2" />}
              title="Product Manager"
              subtitle="Meta · 2016 – 2019"
            />
            <CredentialRow
              tile={<OrgTile label="G" color="#0F9D58" />}
              title="Associate Product Manager"
              subtitle="Google · 2012 – 2015"
            />
          </div>
        </Section>

        {/* Education */}
        <Section title="Education" action={<EditButton label="Add education" icon={addPlusIcon} />}>
          <div className="flex flex-col gap-1">
            <CredentialRow
              tile={<OrgTile label="S" color="#8C1515" />}
              title="Stanford Graduate School of Business"
              subtitle="MBA · 2016 – 2018"
              featured
            />
            <CredentialRow
              tile={<OrgTile label="Y" color="#00356B" />}
              title="Yale University"
              subtitle="BA, Economics · 2008 – 2012"
            />
          </div>
        </Section>

        {/* Specialties */}
        <Section title="I specialize in coaching individuals who are">
          <div className="flex flex-wrap gap-2">
            {specialties.map((s) => {
              const active = activeSpecialties.has(s);
              return (
                <button
                  key={s}
                  className={`rounded-full border px-4 py-2 text-[14px] font-medium transition-colors ${
                    active
                      ? "border-gray-dark bg-gray-dark text-white"
                      : "border-gray-200 text-gray-dark hover:border-gray-300"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </Section>
      </div>
    </div>
  );
}
