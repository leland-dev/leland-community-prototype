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
// one of the categories above.
export const ROLE_TO_CATEGORY: Record<string, string> = {
  sales: "Sales",
  marketing: "Marketing",
  hr: "Human Resources",
  finance: "Finance & Accounting",
};

// The inverse — used so the shared selected category can drive role-keyed
// behavior, like the lesson build picker's suggested-role matching.
export const CATEGORY_TO_ROLE: Record<string, string> = Object.fromEntries(
  Object.entries(ROLE_TO_CATEGORY).map(([role, category]) => [category, role]),
);

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
