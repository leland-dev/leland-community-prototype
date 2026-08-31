import { useEffect } from "react";

// Placeholder for the customer-facing Jobs destination (the v2 top-nav "Jobs"
// tab links here). Lightweight on purpose — a titled surface with a few
// skeleton listings so the route reads as a real page.
const PLACEHOLDER_JOBS = [
  { title: "Product Manager", company: "Anthropic", meta: "San Francisco, CA · Full-time" },
  { title: "Investment Banking Analyst", company: "Goldman Sachs", meta: "New York, NY · Full-time" },
  { title: "Strategy Consultant", company: "McKinsey & Company", meta: "Remote · Full-time" },
  { title: "Data Scientist", company: "Stripe", meta: "Seattle, WA · Full-time" },
  { title: "MBA Summer Associate", company: "Bain & Company", meta: "Boston, MA · Internship" },
];

export default function Jobs() {
  useEffect(() => {
    document.title = "Leland Prototype | Jobs";
  }, []);

  return (
    <div>
      <p className="text-[13px] font-medium uppercase tracking-wide text-gray-light">Discover</p>
      <h1 className="mt-1 text-[28px] font-semibold leading-tight text-gray-dark">Jobs</h1>
      <p className="mt-1.5 text-[15px] text-gray-light">
        Openings from our partners — a placeholder surface for the Jobs experience.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {PLACEHOLDER_JOBS.map((job) => (
          <div
            key={job.title}
            className="flex items-center gap-4 rounded-2xl border border-[#E5E5E5] bg-white p-4"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F3F1E6]">
              <span className="text-[16px] font-semibold text-gray-dark">{job.company.charAt(0)}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[16px] font-semibold leading-tight text-gray-dark">{job.title}</p>
              <p className="mt-0.5 truncate text-[14px] text-gray-light">{job.company}</p>
              <p className="mt-0.5 truncate text-[13px] text-gray-extra-light">{job.meta}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
