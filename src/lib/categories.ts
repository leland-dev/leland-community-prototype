// Program Hub's work-category labels, shared with the course viewer so the
// "Selected category" prototype control (see SelectedCategoryContext) means
// the same thing wherever it's surfaced or read.
export const CATEGORIES = [
  "Sales",
  "Marketing",
  "Human Resources",
  "Business Analytics & Intelligence",
  "Design",
  "Finance & Accounting",
  "Engineering",
  "Product",
  "Operations",
  "Executive",
  "Legal",
];

// Maps the role saved in onboarding (PersonalizationModal's role codes) to
// one of the categories above. "founder" has no dedicated category, so it
// folds into Executive; "other" has no mapping.
export const ROLE_TO_CATEGORY: Record<string, string> = {
  sales: "Sales",
  marketing: "Marketing",
  hr: "Human Resources",
  finance: "Finance & Accounting",
  data: "Business Analytics & Intelligence",
  design: "Design",
  swe: "Engineering",
  pm: "Product",
  ops: "Operations",
  exec: "Executive",
  founder: "Executive",
  legal: "Legal",
};

// The inverse — used so the shared selected category can drive role-keyed
// behavior, like the lesson build picker's suggested-role matching. Written
// out explicitly (rather than derived from ROLE_TO_CATEGORY) since two roles
// — exec and founder — share the Executive category.
export const CATEGORY_TO_ROLE: Record<string, string> = {
  Sales: "sales",
  Marketing: "marketing",
  "Human Resources": "hr",
  "Finance & Accounting": "finance",
  "Business Analytics & Intelligence": "data",
  Design: "design",
  Engineering: "swe",
  Product: "pm",
  Operations: "ops",
  Executive: "exec",
  Legal: "legal",
};

// The Use Case filter's default chip set per category, derived from
// onboarding-focus-area-rollout.numbers (Tutorial Tags sheet): each role's
// own focus-area tags plus the General ones every role gets, each mapped
// onto Program Hub's six Use Case buckets. This is the authoritative
// "what does this category actually do" list — not derived from which
// items happen to exist in the library.
export const CATEGORY_TO_USE_CASES: Record<string, string[]> = {
  Product: ["Productivity & Planning", "Content Creation", "Reporting & Analytics", "App development"],
  Engineering: ["Productivity & Planning", "Content Creation", "Reporting & Analytics", "Automation & Ops", "App development"],
  Design: ["Productivity & Planning", "Content Creation", "Reporting & Analytics", "Automation & Ops", "App development"],
  "Business Analytics & Intelligence": ["Productivity & Planning", "Content Creation", "Reporting & Analytics", "Automation & Ops"],
  Marketing: ["Productivity & Planning", "Content Creation", "Reporting & Analytics"],
  Sales: ["Productivity & Planning", "Content Creation", "Reporting & Analytics", "Automation & Ops"],
  Operations: ["Productivity & Planning", "Content Creation", "Reporting & Analytics", "Automation & Ops"],
  "Finance & Accounting": ["Productivity & Planning", "Content Creation", "Reporting & Analytics", "Automation & Ops"],
  "Human Resources": ["Productivity & Planning", "Content Creation", "Reporting & Analytics", "Automation & Ops"],
  Legal: ["Productivity & Planning", "Content Creation", "Reporting & Analytics", "Automation & Ops"],
  Executive: ["Productivity & Planning", "Content Creation", "Reporting & Analytics"],
};
