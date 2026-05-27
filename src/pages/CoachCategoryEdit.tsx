import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import OfferingCard from "../components/OfferingCard";
import { Button } from "../components/Button";
import addPlusIcon from "../assets/icons/add-plus.svg";
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
    qualifications: "8+ years of product management experience across consumer and enterprise products. Led teams at LinkedIn and Meta shipping products used by millions. Stanford GSB MBA with a focus on strategic leadership and tech innovation.",
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
  mba: {
    name: "MBA",
    headline: "MBA Expert | Stanford GSB | 100+ M7 Admits",
    qualifications: "Stanford GSB graduate with deep expertise in MBA admissions. Coached over 100 candidates into M7 programs including HBS, GSB, and Wharton. Specializing in application strategy, essay review, and interview preparation.",
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
    qualifications: "Yale graduate and former admissions reader with hands-on experience evaluating applications. Helped 50+ students gain admission to Ivy League and top-20 universities. Expert in personal essay development and extracurricular positioning.",
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

const levelOptions = ["Intern", "Associate", "Manager", "Senior Manager", "Director", "VP", "C-Suite"];

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
  const data = categoryData[category ?? ""];

  const [headline, setHeadline] = useState(data?.headline ?? "");
  const [qualifications, setQualifications] = useState(data?.qualifications ?? "");
  const [yearsOfExperience, setYearsOfExperience] = useState(data?.yearsOfExperience ?? "");
  const [levelOfExperience, setLevelOfExperience] = useState(data?.levelOfExperience ?? "");
  const [videoLink, setVideoLink] = useState(data?.videoLink ?? "");
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set(data?.services ?? []));

  useEffect(() => {
    document.title = `Leland Prototype | Edit ${data?.name ?? "Category"}`;
  }, [data?.name]);

  if (!data) {
    return (
      <div>
        <h1 className="text-[32px] font-medium text-gray-dark md:text-[40px]">Category not found</h1>
        <p className="mt-2 text-[16px] text-[#707070]">
          <Link to="/coach/manage" className="text-[#038561] underline">Back to Manage</Link>
        </p>
      </div>
    );
  }

  const toggleService = (service: string) => {
    setSelectedServices((prev) => {
      const next = new Set(prev);
      if (next.has(service)) next.delete(service);
      else next.add(service);
      return next;
    });
  };

  const inputClass = "w-full rounded-lg border border-[#E5E5E5] px-4 py-3 text-[16px] text-gray-dark placeholder:text-[#999999] outline-none transition-colors focus:border-[#222222]";

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-2 text-[14px] text-[#707070]">
        <Link to="/coach/manage" className="transition-colors hover:text-gray-dark">Manage</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-dark">{data.name}</span>
      </div>

      <h1 className="text-[32px] font-medium text-gray-dark md:text-[40px]">{data.name}</h1>

      {/* Form fields */}
      <div className="mt-8 flex flex-col gap-6">
        {/* Headline */}
        <div>
          <label className="mb-2 block text-[16px] font-medium text-gray-dark">Headline</label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className={inputClass}
            placeholder="Your headline for this category"
          />
        </div>

        {/* Qualifications */}
        <div>
          <label className="mb-2 block text-[16px] font-medium text-gray-dark">Qualifications</label>
          <textarea
            value={qualifications}
            onChange={(e) => setQualifications(e.target.value)}
            rows={4}
            className={`${inputClass} resize-y`}
            placeholder="Describe your qualifications"
          />
        </div>

        {/* Years of experience + Level of experience (side by side) */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-[16px] font-medium text-gray-dark">Years of experience</label>
            <input
              type="text"
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(e.target.value)}
              className={inputClass}
              placeholder="e.g. 5"
            />
          </div>
          <div>
            <label className="mb-2 block text-[16px] font-medium text-gray-dark">Level of experience</label>
            <select
              value={levelOfExperience}
              onChange={(e) => setLevelOfExperience(e.target.value)}
              className={`${inputClass} cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M3%204.5L6%207.5L9%204.5%22%20stroke%3D%22%23333333%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_16px_center] bg-no-repeat pr-10`}
            >
              {levelOptions.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Video link */}
        <div>
          <label className="mb-2 block text-[16px] font-medium text-gray-dark">Video link</label>
          <input
            type="text"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
            className={inputClass}
            placeholder="https://youtube.com/..."
          />
        </div>

        {/* Services */}
        <div>
          <h2 className="text-[24px] font-medium text-gray-dark">Select your areas of expertise in this category</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {data.allServices.map((service) => {
              const active = selectedServices.has(service);
              return (
                <button
                  key={service}
                  onClick={() => toggleService(service)}
                  className={`cursor-pointer rounded-full border px-4 py-2 text-[14px] font-medium transition-colors ${
                    active
                      ? "border-[#222222] bg-[#222222]/5 text-gray-dark"
                      : "border-[#E5E5E5] text-gray-dark hover:bg-[#F5F5F5]"
                  }`}
                >
                  {service}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="my-10 border-t border-[#E5E5E5]" />

      {/* Products */}
      <h2 className="text-[24px] font-medium text-gray-dark">Products</h2>
      <p className="mt-1 text-[16px] text-[#707070]">Offerings available in this category.</p>
      <div className="mt-4 flex flex-col gap-1">
        {offerings.map((o) => (
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
      <div className="mt-3">
        <Button size="sm" variant="secondary">
          <img src={addPlusIcon} alt="" className="h-4 w-4" />
          Add product
        </Button>
      </div>

      <div className="h-10" />
    </div>
  );
}
