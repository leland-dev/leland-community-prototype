// Leland's topic taxonomy — the fixed set a post can be tagged with. Topics are
// NOT free-form: a poster selects from these, and each maps to a real Leland
// category page. Mirrors the Browse menu buckets so the two stay in sync.

export const TOPIC_BUCKETS: { bucket: string; topics: string[] }[] = [
  { bucket: "Suggested", topics: [] }, // filled per-user at runtime, see MY_TOPICS
  { bucket: "General", topics: ["Career Growth", "Networking", "Personal Branding", "Leadership", "Communication", "Salary Negotiation", "Job Search", "Mentorship", "Public Speaking"] },
  { bucket: "School Admissions", topics: ["MBA Admissions", "Undergraduate", "Law School", "Medical School", "Graduate School", "PhD", "College Essays", "Recommendations", "Financial Aid", "Scholarships"] },
  { bucket: "Test Prep", topics: ["GMAT", "GRE", "LSAT", "MCAT", "SAT", "ACT", "TOEFL", "IELTS", "USMLE", "Bar Exam"] },
  { bucket: "Business", topics: ["Strategy", "Operations", "Entrepreneurship", "Marketing", "Sales", "Business Development", "Growth", "Fundraising", "Venture Capital", "Private Equity"] },
  { bucket: "Finance & Accounting", topics: ["Investment Banking", "Corporate Finance", "Financial Modeling", "Accounting", "FP&A", "Equity Research", "Hedge Funds", "Wealth Management"] },
  { bucket: "Product", topics: ["Product Management", "Product Design", "UX Research", "Product Strategy", "Product Analytics", "Growth Product", "Technical PM", "Product Marketing", "Roadmapping", "Prioritization"] },
  { bucket: "Technology", topics: ["Software Engineering", "Data Science", "DevOps", "Cybersecurity", "Cloud", "Frontend", "Backend", "Mobile", "Systems Design", "Engineering Management"] },
  { bucket: "AI", topics: ["Machine Learning", "Prompt Engineering", "AI Product Management", "LLMs", "Generative AI", "AI Research", "MLOps", "Computer Vision", "NLP", "AI Ethics"] },
  { bucket: "Health & Medicine", topics: ["Residency", "Nursing", "Public Health", "Dentistry", "Pharmacy", "Physician Assistant", "Healthcare Admin", "Clinical Research", "Mental Health"] },
  { bucket: "Law & Public Service", topics: ["Bar Prep", "Corporate Law", "Litigation", "Public Policy", "Government", "Nonprofit", "International Law", "Compliance", "Legal Careers"] },
  { bucket: "Arts, Media & Entertainment", topics: ["Film & TV", "Music", "Journalism", "Design", "Writing", "Marketing & PR", "Gaming", "Photography", "Content Creation", "Publishing"] },
  { bucket: "Management Consulting", topics: ["Management Consulting", "Case Prep", "Interview Prep", "Resume Review"] },
];

// Flat, de-duplicated list of every selectable topic.
export const ALL_TOPICS: string[] = Array.from(
  new Set(TOPIC_BUCKETS.flatMap(b => b.topics)),
);

// The signed-in user's known interests. Every Leland user has at least one
// category we know they care about (captured at onboarding); the composer
// surfaces these first so tagging a post is usually a single tap. The first
// entry is treated as their primary category.
export const MY_TOPICS: string[] = [
  "Product Management",
  "UX Research",
  "Career Growth",
  "Product Design",
];
