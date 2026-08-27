/* ─────────────────────────────────────────────────────────────────────────
 * universities — the searchable school list for the v4 credential step.
 * `key` points at a logo in assets/logos or assets/org-logos when we have one.
 * `aliases` widen the type-ahead ("cal", "hbs", "penn").
 * ──────────────────────────────────────────────────────────────────────── */

export type University = {
  name: string;
  key?: string;
  aliases?: string[];
  /** searchable but not yet established on Leland — first member gets the pioneer beat */
  pioneer?: boolean;
};

export const UNIVERSITIES: University[] = [
  { name: "Harvard University", key: "harvard", aliases: ["hbs", "harvard"] },
  { name: "Stanford University", key: "stanford", aliases: ["gsb"] },
  { name: "MIT", key: "mit", aliases: ["massachusetts institute of technology", "sloan"] },
  { name: "UC Berkeley", key: "berkeley", aliases: ["cal", "haas", "university of california berkeley"] },
  { name: "Yale University", key: "yale" },
  { name: "UCLA", key: "ucla", aliases: ["university of california los angeles"] },
  { name: "Princeton University", key: "princeton" },
  { name: "Columbia University", key: "columbia" },
  { name: "University of Pennsylvania", key: "wharton", aliases: ["penn", "upenn", "wharton"] },
  { name: "Northwestern University", key: "kellogg", aliases: ["kellogg"] },
  { name: "University of Chicago", key: "booth", aliases: ["uchicago", "booth"] },
  { name: "NYU", key: "nyu-stern", aliases: ["new york university", "stern"] },
  { name: "Duke University", key: "fuqua", aliases: ["fuqua"] },
  { name: "Dartmouth College", key: "tuck", aliases: ["tuck"] },
  { name: "Brown University" },
  { name: "Cornell University" },
  { name: "Johns Hopkins University", aliases: ["jhu"] },
  { name: "Georgetown University" },
  { name: "University of Michigan", aliases: ["umich", "ross"] },
  { name: "USC", aliases: ["university of southern california", "marshall"] },
  { name: "Carnegie Mellon University", aliases: ["cmu"] },
  { name: "Caltech", aliases: ["california institute of technology"] },
  { name: "UT Austin", aliases: ["university of texas", "mccombs"] },
  { name: "UNC Chapel Hill", aliases: ["north carolina", "kenan-flagler"] },
  { name: "University of Virginia", aliases: ["uva", "darden"] },
  { name: "Notre Dame" },
  { name: "Vanderbilt University" },
  { name: "Rice University" },
  { name: "Emory University" },
  { name: "BYU", aliases: ["brigham young university"] },
  { name: "Boston University", aliases: ["bu"] },
  { name: "Boston College", aliases: ["bc"] },
  { name: "Georgia Tech", aliases: ["georgia institute of technology"] },
  { name: "Purdue University" },
  { name: "Ohio State University", aliases: ["osu"] },
  { name: "University of Washington", aliases: ["uw", "foster"] },
  { name: "University of Wisconsin", aliases: ["madison"] },
  { name: "Texas A&M", aliases: ["tamu"] },
  { name: "Indiana University", aliases: ["kelley"] },
  { name: "Tufts University" },
  { name: "University of Florida", aliases: ["uf"] },
  { name: "University of Illinois", aliases: ["uiuc"] },
  { name: "Penn State", aliases: ["pennsylvania state university"] },
  { name: "Arizona State University", aliases: ["asu"] },
  { name: "University of Utah" },
  { name: "Howard University" },
  { name: "Spelman College" },
  { name: "Morehouse College" },
  { name: "University of Oxford", aliases: ["oxford"] },
  { name: "University of Cambridge", aliases: ["cambridge"] },
  { name: "London School of Economics", aliases: ["lse"] },
  { name: "INSEAD" },
  { name: "University of Toronto", aliases: ["uoft", "rotman"] },
  { name: "McGill University" },
  { name: "IIT Bombay", aliases: ["indian institute of technology"] },
  { name: "IIT Delhi" },
  { name: "National University of Singapore", aliases: ["nus"] },
  { name: "Tsinghua University" },
  /* small schools, searchable for the pioneer / first-member demo */
  { name: "Tacoma Community College", pioneer: true, aliases: ["tcc"] },
  { name: "Provo Community College", pioneer: true },
  { name: "Salt Lake Community College", pioneer: true, aliases: ["slcc"] },
  { name: "Utah Valley University", pioneer: true, aliases: ["uvu"] },
  { name: "Weber State University", pioneer: true },
  { name: "Boise State University", pioneer: true },
];

/** Shown before the member types anything — all have logos. */
export const FEATURED_UNIVERSITIES = UNIVERSITIES.slice(0, 6);

export function searchUniversities(query: string, limit = 6): University[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const score = (u: University) => {
    const name = u.name.toLowerCase();
    if (name.startsWith(q)) return 0;
    if (u.aliases?.some((a) => a.startsWith(q))) return 1;
    if (name.includes(q)) return 2;
    if (u.aliases?.some((a) => a.includes(q))) return 3;
    return -1;
  };
  return UNIVERSITIES.map((u) => ({ u, s: score(u) }))
    .filter((x) => x.s >= 0)
    .sort((a, b) => a.s - b.s)
    .slice(0, limit)
    .map((x) => x.u);
}

/** Deterministic pseudo-counts so numbers stay stable across renders. */
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}
export function memberCountFor(school: string): number {
  return 80 + (hash(school) % 420); // 80–499
}
export function expertCountFor(school: string): number {
  return 12 + (hash(school + "x") % 110); // 12–121
}
