import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useParams, useNavigate, Link } from "react-router-dom";
import OfferingCard from "../components/OfferingCard";
import { Button, LinkButton } from "../components/Button";
import addPlusIcon from "../assets/icons/add-plus.svg";
import editIcon from "../assets/icons/edit.svg";
import arrowDiagonalIcon from "../assets/icons/arrow-diagonal.svg";
import videoIcon from "../assets/icons/video-icon.svg";
import coverImage from "../assets/img/cover-image-2.png";
import pic1 from "../assets/profile photos/pic-1.png";
import pic6 from "../assets/profile photos/pic-6.png";
import eventImg1 from "../assets/placeholder images/placeholder-event-01.png";
import eventImg2 from "../assets/placeholder images/placeholder-event-02.png";
import eventImg3 from "../assets/placeholder images/placeholder-event-03.png";
import bootcampImg1 from "../assets/placeholder images/bootcamp-1.webp";
import lelandPlusImg1 from "../assets/placeholder images/leland-plus-images/3cf6e985-7397-4e50-8e06-ef9a8f40491c.webp";
import lelandPlusImg2 from "../assets/placeholder images/leland-plus-images/b9669ad2-4b6f-4c32-83e1-d1370dbf9484.webp";

const categoryData: Record<string, {
  name: string;
  headline: string;
  qualifications: string;
  yearsOfExperience: string;
  levelOfExperience: string;
  videoLink: string;
  services: string[];
  allServices: string[];
}> = {
  "product-management": {
    name: "Product Management",
    headline: "Experienced Product Leader at LinkedIn | Ex-Meta | Stanford GSB",
    qualifications: "8+ years of product management experience across consumer and enterprise products. I've led cross-functional teams at LinkedIn and Meta, shipping products used by hundreds of millions of people and owning roadmaps from early discovery through launch and iteration. My background spans 0-to-1 product bets, platform and infrastructure work, and large-scale growth initiatives, so I can meet you wherever you are in your PM journey.\n\nBefore moving into product, I started my career in software engineering, which gives me a strong technical foundation and a practical understanding of how to partner with design and engineering. I earned my MBA at Stanford GSB with a focus on strategic leadership and technology innovation, and I've spent the years since mentoring aspiring and early-career PMs.\n\nIn our sessions, I'll help you sharpen your product sense, prepare for behavioral and case-style interviews, and craft a resume and story that clearly communicate your impact. Whether you're breaking into product management, leveling up to senior or director roles, or preparing for interviews at top tech companies, we'll build a plan tailored to your goals.",
    yearsOfExperience: "8",
    levelOfExperience: "Director",
    videoLink: "https://www.youtube.com/watch?v=example",
    services: ["General Exploration", "Interviews", "Resume", "Networking Strategy"],
    allServices: [
      "Application Strategy", "Cover Letters", "Ding Analysis", "Editing", "Essays",
      "General Exploration", "Interviews", "Networking Strategy", "Recommendations",
      "Resume", "School Selection", "Secondary Review",
    ],
  },
  "management-consulting": {
    name: "Management Consulting",
    headline: "Ex-McKinsey Consultant | Wharton MBA | Case Prep Pro",
    qualifications: "Former McKinsey engagement manager with a Wharton MBA and seven years of experience across strategy, operations, and organizational transformation engagements. I've led case teams serving Fortune 500 clients and worked directly with senior partners, so I know exactly what recruiters and interviewers at MBB and top boutique firms are looking for.\n\nOver the past several years I've coached candidates from a wide range of backgrounds — undergraduates, MBAs, advanced-degree holders, and experienced hires — into offers at McKinsey, Bain, BCG, and leading boutiques. My approach is structured but personal: we'll diagnose your specific gaps and build a focused plan rather than drilling generic frameworks.\n\nTogether we'll work through case interviews, market sizing, and fit and behavioral questions, and we'll position your resume and networking outreach to stand out in a competitive recruiting cycle. I'll give you honest, direct feedback and the reps you need to walk into interview day confident and prepared.",
    yearsOfExperience: "7",
    levelOfExperience: "Manager",
    videoLink: "",
    services: ["Case Prep", "Fit Interviews", "Resume", "Networking Strategy", "Application Strategy"],
    allServices: [
      "Application Strategy", "Case Prep", "Cover Letters", "Editing", "Fit Interviews",
      "General Exploration", "Interviews", "Networking Strategy", "Recommendations",
      "Resume", "School Selection", "Secondary Review",
    ],
  },
  mba: {
    name: "MBA",
    headline: "MBA Expert | Stanford GSB | 100+ M7 Admits",
    qualifications: "Stanford GSB graduate with deep, hands-on expertise in MBA admissions. Over the past six years I've coached more than 100 candidates into M7 programs including HBS, Stanford GSB, and Wharton, as well as other top-15 schools. I've reviewed thousands of essays and mock interviews, and I understand what admissions committees are truly evaluating beneath the surface of an application.\n\nMy philosophy is that the strongest applications are authentic ones. Rather than manufacturing a polished-but-generic narrative, I'll help you uncover the genuine throughline in your experiences and articulate it with clarity and conviction. We'll define your positioning, build a balanced school list, and make sure every element of your application reinforces a consistent story.\n\nI offer end-to-end support across application strategy, essay development and editing, recommender guidance, and interview preparation, and I'm happy to jump in at any stage of the process. Whether you're just starting to explore programs or refining final drafts before the deadline, I'll help you present the most compelling version of yourself.",
    yearsOfExperience: "6",
    levelOfExperience: "Manager",
    videoLink: "https://www.youtube.com/watch?v=example2",
    services: ["Application Strategy", "Essays", "Interviews", "School Selection", "Resume", "Recommendations"],
    allServices: [
      "Application Strategy", "Cover Letters", "Ding Analysis", "Editing", "Essays",
      "Financial Aid & Scholarships", "General Exploration", "Interviews", "Networking Strategy",
      "Recommendations", "Resume", "School Selection", "Secondary Review",
      "Supplementary Materials", "Testing & Assessments", "Waitlist Strategy",
    ],
  },
  college: {
    name: "College",
    headline: "College Admissions Expert | Yale Grad | 50+ Ivy League Admits",
    qualifications: "Yale graduate and former admissions reader with firsthand experience evaluating applications from the other side of the desk. Over the past five years I've helped more than 50 students gain admission to Ivy League and top-20 universities, and I bring an insider's perspective on how committees actually read and compare candidates.\n\nI specialize in helping students find and tell their story. Many applicants have impressive accomplishments but struggle to communicate what makes them distinctive — that's where I focus my energy. We'll develop a personal essay that feels genuine and memorable, and shape supplemental essays that show real fit with each school.\n\nBeyond the essays, I'll help you build a balanced college list, strengthen your extracurricular narrative, and prepare for interviews with confidence. I work closely with both students and families throughout the process, keeping things organized and low-stress so you can put your best foot forward.",
    yearsOfExperience: "5",
    levelOfExperience: "Associate",
    videoLink: "",
    services: ["Application Strategy", "Essays", "Interviews", "School Selection", "Recommendations"],
    allServices: [
      "Application Strategy", "Cover Letters", "Ding Analysis", "Editing", "Essays",
      "Financial Aid & Scholarships", "General Exploration", "Interviews", "Networking Strategy",
      "Recommendations", "Resume", "School Selection", "Secondary Review",
      "Supplementary Materials", "Testing & Assessments", "Waitlist Strategy",
    ],
  },
};

// Secondary gray edit/add button — matches the Profile (new) page.
function EditButton({ label = "Edit", icon = editIcon, className = "" }: { label?: string; icon?: string; className?: string }) {
  return (
    <Button size="sm" variant="secondary" rounded="rounded-full" className={`text-[15px] font-semibold ${className}`}>
      <img src={icon} alt="" className="h-[18px] w-[18px]" />
      {label}
    </Button>
  );
}

// Small per-section edit affordance — always shown on mobile, reveals on hover
// of the enclosing `group` section on desktop.
function SectionEditButton() {
  return (
    <button
      aria-label="Edit"
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full opacity-100 transition-all hover:bg-gray-hover md:opacity-0 md:group-hover:opacity-100"
    >
      <img src={editIcon} alt="" className="h-4 w-4 opacity-60" />
    </button>
  );
}

// Product type filters. `types` is matched against each offering's `type`
// (null = show everything).
const productFilters: { label: string; types: string[] | null }[] = [
  { label: "All", types: null },
  { label: "Packages", types: ["package", "hourly-package"] },
  { label: "Memberships", types: ["membership"] },
  { label: "Content", types: ["content"] },
  { label: "Courses", types: ["course"] },
  { label: "Agents", types: ["agent"] },
];

const offerings = [
  { type: "hourly-package" as const, title: "10-Hour Coaching Package", subtitle: "10 hours · $1,200", image: eventImg1 },
  { type: "package" as const, title: "MBA Application Package", subtitle: "Comprehensive Package · Starting at $750", image: eventImg2 },
  { type: "package" as const, title: "Interview Prep Package", subtitle: "Comprehensive Package · Starting at $500", image: eventImg3 },
  { type: "hourly" as const, title: "Custom hourly coaching", subtitle: "$150 per hour", image: "" },
  { type: "course" as const, title: "GMAT Exam Prep Bootcamp", subtitle: "Next cohort starts June 1", image: bootcampImg1 },
  {
    type: "content" as const,
    title: "How I Got Into Stanford GSB",
    subtitle: "Marcus Thomas · 251 views",
    image: lelandPlusImg1,
  },
  {
    type: "content" as const,
    title: "GMAT Study Plan: 3 Months to 750+",
    subtitle: "Samantha Parker · 184 views",
    image: lelandPlusImg2,
  },
];

export default function CoachCategoryEdit() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const data = categoryData[category ?? ""];

  const [productFilter, setProductFilter] = useState("All");
  const [qualificationsExpanded, setQualificationsExpanded] = useState(false);
  const activeFilter = productFilters.find((f) => f.label === productFilter);
  const visibleOfferings = (activeFilter?.types
    ? offerings.filter((o) => activeFilter.types!.includes(o.type))
    : offerings
  )
    .map((o, i) => ({ o, i }))
    .sort((a, b) => Number(b.o.type === "hourly") - Number(a.o.type === "hourly") || a.i - b.i)
    .map(({ o }) => o);

  useEffect(() => {
    document.title = `Leland Prototype | Edit ${data?.name ?? "Category"}`;
  }, [data?.name]);

  if (!data) {
    return (
      <div className="max-w-[720px]">
        <h1 className="text-[30px] font-medium text-gray-dark md:text-[38px]">Category not found</h1>
        <p className="mt-2 text-[14px] text-[#707070]">
          <Link to="/coach/profile-new" className="text-gray-dark underline">Back to Profile</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px]">
      {/* Top actions — back */}
      <div className="mb-6">
        <Button size="sm" variant="secondary" iconOnly onClick={() => navigate("/coach/profile-new")} aria-label="Go back">
          <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Button>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row-reverse lg:items-start lg:gap-16">
        {/* Right column — wrap-up + price + video, divider-separated (mirrors the
            profile template's expert sidebar rhythm). */}
        <aside className="w-full lg:w-[360px] lg:shrink-0">
          <div className="flex flex-col divide-y divide-gray-stroke text-[15px]">
            {/* Profile preview — cover + avatar + name + headline */}
            <div className="pb-6">
              <div className="relative">
                <img src={coverImage} alt="" className="h-36 w-full rounded-[6px] object-cover" />
                <img
                  src={pic6}
                  alt="Samantha Parker"
                  className="absolute -bottom-8 left-4 h-24 w-24 rounded-full border-4 border-white object-cover"
                />
              </div>
              <p className="mt-11 text-[15px] font-medium leading-tight text-gray-light">Samantha Parker</p>
              <h2 className="mt-1 font-serif text-[22px] leading-[1.2] text-gray-dark">{data.headline}</h2>
              <div className="mt-4">
                <EditButton label="Edit listing" className="w-full" />
              </div>
            </div>

            {/* Experience */}
            <div className="group py-6">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[15px] font-semibold text-gray-dark">Experience</p>
                <SectionEditButton />
              </div>
              <div className="flex flex-col gap-2.5 text-[15px] font-normal text-gray-light">
                <div className="flex items-center gap-2.5">
                  <svg className="h-[17px] w-[17px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18.383 8H19.444C20.304 8 21 8.696 21 9.556V19.445C21 20.304 20.304 21 19.444 21H8.556C7.696 21 7 20.304 7 19.444V18" />
                    <path d="M4.00109 18H15.3131C15.9821 18 16.6061 17.666 16.9771 17.109L17.7111 16.007C18.1491 15.35 18.3831 14.578 18.3831 13.788V6C18.3831 4.895 17.4881 4 16.3831 4H6.38309C5.27809 4 4.38309 4.895 4.38309 6V13.056C4.38309 13.677 4.23809 14.289 3.96109 14.845L3.10709 16.553C2.77409 17.218 3.25809 18 4.00109 18Z" />
                    <path d="M8.38013 3V5" />
                    <path d="M14.3801 3V5" />
                  </svg>
                  <span>{data.yearsOfExperience} years of experience</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <svg className="h-[17px] w-[17px] shrink-0" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22.1667 23.9167H5.83333C4.54417 23.9167 3.5 22.8725 3.5 21.5833V11.0833C3.5 9.79417 4.54417 8.75 5.83333 8.75H22.1667C23.4558 8.75 24.5 9.79417 24.5 11.0833V21.5833C24.5 22.8725 23.4558 23.9167 22.1667 23.9167Z" />
                    <path d="M18.8697 8.75065V6.41732C18.8697 5.12815 17.8255 4.08398 16.5364 4.08398H11.4637C10.1745 4.08398 9.13037 5.12815 9.13037 6.41732V8.75065" />
                    <path d="M3.5 11.084L10.9095 15.9735C11.291 16.2255 11.7378 16.3597 12.1952 16.3597H15.8048C16.2622 16.3597 16.709 16.2255 17.0905 15.9735L24.5 11.084" />
                  </svg>
                  <span>{data.levelOfExperience} level</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <svg className="h-[17px] w-[17px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.48225 19.7413C9.77725 19.7023 10.0752 19.7823 10.3102 19.9633L11.3932 20.7943C11.7512 21.0693 12.2492 21.0693 12.6062 20.7943L13.7302 19.9313C13.9402 19.7703 14.2052 19.6993 14.4672 19.7343L15.8732 19.9193C16.3202 19.9783 16.7512 19.7293 16.9242 19.3123L17.4652 18.0043C17.5662 17.7593 17.7602 17.5653 18.0052 17.4643L19.3132 16.9233C19.7302 16.7513 19.9792 16.3193 19.9202 15.8723L19.7422 14.5173C19.7032 14.2223 19.7832 13.9243 19.9642 13.6893L20.7952 12.6063C21.0702 12.2483 21.0702 11.7503 20.7952 11.3933L19.9322 10.2693C19.7712 10.0593 19.7002 9.79425 19.7352 9.53225L19.9202 8.12625C19.9792 7.67925 19.7302 7.24825 19.3132 7.07525L18.0052 6.53425C17.7602 6.43325 17.5662 6.23925 17.4652 5.99425L16.9242 4.68625C16.7522 4.26925 16.3202 4.02025 15.8732 4.07925L14.4672 4.26425C14.2052 4.30025 13.9402 4.22925 13.7312 4.06925L12.6072 3.20625C12.2492 2.93125 11.7512 2.93125 11.3942 3.20625L10.2702 4.06925C10.0602 4.22925 9.79525 4.30025 9.53325 4.26625L8.12725 4.08125C7.68025 4.02225 7.24925 4.27125 7.07625 4.68825L6.53625 5.99625C6.43425 6.24025 6.24025 6.43425 5.99625 6.53625L4.68825 7.07625C4.27125 7.24925 4.02225 7.68025 4.08125 8.12725L4.26625 9.53325C4.30025 9.79525 4.22925 10.0603 4.06925 10.2693L3.20625 11.3933C2.93125 11.7513 2.93125 12.2493 3.20625 12.6063L4.06925 13.7303C4.23025 13.9403 4.30125 14.2053 4.26625 14.4673L4.08125 15.8733C4.02225 16.3203 4.27125 16.7513 4.68825 16.9243L5.99625 17.4653C6.24125 17.5663 6.43525 17.7603 6.53625 18.0053L7.07725 19.3133C7.24925 19.7303 7.68125 19.9793 8.12825 19.9203L9.48225 19.7413" />
                    <path d="M14.7969 10.6031L11.2959 14.1041L9.19687 12.0041" />
                  </svg>
                  <span>Coaches professionally</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <svg className="h-[17px] w-[17px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                  <span>20+ people coached for {data.name}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <svg className="h-[17px] w-[17px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 21C14.2091 21 16 16.9706 16 12C16 7.02944 14.2091 3 12 3C9.79086 3 8 7.02944 8 12C8 16.9706 9.79086 21 12 21Z" />
                    <path d="M20.5 9H3.5" />
                    <path d="M13 3H11C6.58172 3 3 6.58172 3 11V13C3 17.4183 6.58172 21 11 21H13C17.4183 21 21 17.4183 21 13V11C21 6.58172 17.4183 3 13 3Z" />
                    <path d="M20.5 15H3.5" />
                  </svg>
                  <span>Open to working with clients outside the U.S.</span>
                </div>
              </div>
            </div>

            {/* Qualifications */}
            <div className="group py-6">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[15px] font-semibold text-gray-dark">{data.name} qualifications</p>
                <SectionEditButton />
              </div>
              <div
                className="cursor-pointer"
                onClick={() => setQualificationsExpanded((p) => !p)}
              >
                <div className="relative">
                  <motion.div
                    initial={false}
                    animate={{ height: qualificationsExpanded ? "auto" : 120 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-3 text-[15px] leading-relaxed text-[#4C4C4C]">
                      {data.qualifications.split("\n\n").map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>
                  </motion.div>
                  {!qualificationsExpanded && (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white via-white to-transparent" />
                  )}
                </div>
                <span className="mt-1 inline-block text-[15px] font-medium text-gray-dark">
                  {qualificationsExpanded ? "Read less" : "Read more"}
                </span>
              </div>
            </div>

            {/* Areas of expertise */}
            <div className="group py-6">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[15px] font-semibold text-gray-dark">Areas of expertise</p>
                <SectionEditButton />
              </div>
              <div className="flex flex-wrap gap-2">
                {data.services.map((service) => (
                  <span
                    key={service}
                    className="rounded-full bg-[#222222]/5 px-3 py-1.5 text-[13px] font-medium text-gray-extra-light"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>

            {/* Category video — empty state */}
            <div className="py-6">
              <p className="mb-3 text-[15px] font-semibold text-gray-dark">Category video</p>
              <div className="flex aspect-video w-full flex-col items-center justify-center gap-2.5 rounded-lg border border-dashed border-[#D4D4D4] bg-[#FAFAFA] px-4 text-center">
                <img src={videoIcon} alt="" className="h-6 w-6 opacity-40" />
                <Button size="sm" variant="secondary" rounded="rounded-full" className="text-[14px] font-semibold">
                  <img src={addPlusIcon} alt="" className="h-[16px] w-[16px]" />
                  Add video
                </Button>
              </div>
              <p className="mt-3 text-[15px] leading-relaxed text-[#707070]">
                Adding a video here overrides the video from your Profile page for this category.
              </p>
            </div>
          </div>
        </aside>

        {/* Left column — products (main content) */}
        <div className="min-w-0 flex-1">
          {/* Page header */}
          <div className="mb-10">
            <h1 className="font-serif text-[48px] leading-[1.05] text-gray-dark">{data.name} listing</h1>
            <p className="mt-3 text-[18px] leading-relaxed text-gray-light">
              Manage the products, pricing, and details that appear on your public listing for this category. Edits here only affect this category — your main profile stays untouched.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Button
                size="md"
                variant="dark"
                rounded="rounded-full"
                className="text-[15px] font-semibold"
                onClick={() => navigate(`/coach/manage/${category}/new-product`)}
              >
                <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                New offering
              </Button>
              <LinkButton
                size="md"
                variant="secondary"
                rounded="rounded-full"
                href={`/profile/samantha-parker/${category}`}
                className="text-[15px] font-semibold"
              >
                Preview listing
                <img src={arrowDiagonalIcon} alt="" className="h-[16px] w-[16px]" />
              </LinkButton>
            </div>
          </div>

          {/* Type filters */}
          <div className="mb-4 flex flex-wrap gap-2">
            {productFilters.map((f) => {
              const active = productFilter === f.label;
              return (
                <button
                  key={f.label}
                  onClick={() => setProductFilter(f.label)}
                  className={`cursor-pointer rounded-full border-[1.5px] px-3.5 py-2 text-[13px] font-medium text-gray-dark transition-colors ${
                    active ? "border-gray-dark bg-[#f5f5f5]" : "border-transparent bg-[#f5f5f5] hover:bg-[#ebebeb]"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {visibleOfferings.length > 0 ? (
            <div className="flex flex-col gap-1">
              {visibleOfferings.map((o) => (
                <OfferingCard
                  key={o.title}
                  type={o.type}
                  title={o.title}
                  subtitle={o.type === "content" ? (
                    <span className="flex items-center gap-1.5">
                      <img src={o.title.includes("Stanford") ? pic1 : pic6} alt="" className="h-[14px] w-[14px] rounded-full object-cover" />
                      {o.subtitle}
                    </span>
                  ) : o.subtitle}
                  image={o.image}
                />
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-[14px] text-[#999999]">
              No {productFilter.toLowerCase()} in this category yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
