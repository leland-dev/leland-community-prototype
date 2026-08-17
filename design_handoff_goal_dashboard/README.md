# Handoff: Goals on the Leland dashboard

## Overview

A goal-management feature for the Leland customer dashboard, plus the expert-side hook into it. Four screens:

1. **Goal card widget** — a "My goals" card in the dashboard stack, one tile per active goal.
2. **Goal detail** — the full view for one goal: routines, projects, tasks, content queue.
3. **Expert assigns a task** — in the post-session panel, an expert pushes a task onto a customer's goal.
4. **New goal flow** — category → details → generated starter plan the customer trims before creating.

A goal contains **projects**; projects contain **tasks**. Two task kinds: **routines** (recurring, streak-tracked, circular check) and **one-off tasks** (square check). Experts can add tasks to a customer's goal; those tasks show a "via [Expert]" attribution.

## About the design files

`design-references/*.dc.html` are **design references written in HTML** — prototypes of intended look and behavior, not production code to copy. Open them in a browser (they're self-contained apart from the sibling `support.js` and the design-system CSS they link, which will 404 outside the design project — the inline styles still render).

The task is to **recreate these designs in `leland-dev/leland-community-prototype`** using its existing patterns: React 18 + TypeScript + Vite, Tailwind-less inline/utility styling as the surrounding page does it, `src/components/Button.tsx`, and the tokens in `src/styles/leland-theme.css`. Do not port the `.dc.html` structure or its `sc-for`/`sc-if` template tags — those are design-tool constructs.

## Fidelity

**High fidelity.** Colors, type, spacing, radii, and interaction states are final and were pulled from the repo's own components. Match them exactly. Where a value here disagrees with `leland-theme.css`, the theme file wins — tell us.

## Target repo

```
repo:   leland-dev/leland-community-prototype
branch: main (base) → feature branch, see below
paths:  src/pages/Dashboard.tsx, src/pages/CoachManage.tsx,
        src/components/Button.tsx, src/components/SidebarCard.tsx,
        src/components/SessionCard.tsx, src/styles/leland-theme.css
```

### Getting this onto a branch

```bash
git clone https://github.com/leland-dev/leland-community-prototype.git
cd leland-community-prototype
git checkout main && git pull
git checkout -b feature/dashboard-goals
npm install && npm run dev
claude
```

Then paste this to Claude Code:

> Read `design_handoff_goal_dashboard/README.md` and the four files in
> `design-references/`. Implement screens 1–4 in this codebase on the current
> branch, following the existing patterns in `src/pages/Dashboard.tsx` and
> `src/components/`. Start with screen 1 only, show me the diff, and wait
> before continuing to screen 2.

Suggested commit slices, one PR each or one PR with four commits:

| Commit | Scope |
| --- | --- |
| `feat(dashboard): goals data model + mock data` | types + fixtures, no UI |
| `feat(dashboard): my goals card widget` | screen 1 in `Dashboard.tsx` |
| `feat(goals): goal detail view` | screen 2, new route |
| `feat(goals): new goal flow` | screen 4, modal or route |
| `feat(expert): assign task from session panel` | screen 3 in `CoachManage.tsx` |

Copy this whole `design_handoff_goal_dashboard/` folder into the repo root so Claude Code can read it, and delete it before merge (or keep it under `docs/`).

## Taxonomy — enforce in all copy

The 2026 brand refresh retired several words. Customer-facing strings must use the right side.

| Never | Always |
| --- | --- |
| Coach | **Expert** |
| User / client / student / applicant | **Customer** |
| Coaching | **Services** |
| Coach Dashboard | **Expert Dashboard** |

The repo still has `CoachManage.tsx`, `useIsCoachMode`, etc. Leave existing file and symbol names alone; only new UI copy and new identifiers need to follow the taxonomy. (Screen 3's file is named "Coach Assign Task" for continuity with the repo — its UI copy says "expert".)

## Design tokens

Everything below is already in the designs; most map to `leland-theme.css`.

**Color**

| Token | Value | Use |
| --- | --- | --- |
| Ink | `#222222` | default type, progress fill, checked box fill, ink button bg |
| Muted | `#4C4C4C` | secondary body, field labels |
| Grey 1 | `#707070` | card subtitles |
| Grey 2 | `#767676` | eyebrows, meta, tertiary |
| Placeholder | `#949494` | input placeholder, unchecked box border, "optional" |
| Card surface | `#FFFFFF` | the dashboard card itself |
| Tile | `#F5F5F5` | inner tiles, dropdown/list surface |
| Tile hover | `#EEEEEE` | hover on tiles and pills |
| Cream | `#F3F1E6` | success/confirmation blocks, empty-state block |
| Tan | `#EBD4B5` | selected chips and selected option pills |
| Gold | `#FFD96F` | primary button bg — **always with ink text `#111111`**, never white |
| Gold hover | `#F3C948` | primary button hover |
| Rust | `#9F5B34` | overdue, validation messages, "needs action" dot |
| Slate | `#869AA6` | "on track" dot |
| Ghost button | `rgba(34,34,34,0.05)` bg, `0.10` hover | secondary buttons |
| Card ring | `0 0 0 1px rgba(34,34,34,0.10)` | as a shadow, **not** a 1px border |
| Card shadow | `0 1px 2px 0 rgba(16,24,40,0.06)` | with the ring above |
| Dropdown shadow | `0 8px 24px rgba(16,24,40,0.12), 0 0 0 1px rgba(34,34,34,0.08)` | floating menus |
| Track | `rgba(34,34,34,0.10)` | progress bar track |

Max three colors per surface. No forest green anywhere — it's retired.

**Typography** — `var(--font-serif)` is SeasonMix (Medium 500, **28px and up only**), `var(--font-sans)` is Macan (400/500/600). Letter-spacing 0 everywhere except eyebrows.

| Role | Spec |
| --- | --- |
| Page title | serif 32px / 500 / 1.1 |
| Step headline | serif 28px / 500 / 1.15 |
| Card section title | sans 19px / 600 / 1.2 |
| Tile title, question | sans 16px / 600 / 1.2–1.25 |
| Body, list item, input | sans 15px / 400–500 / 1.3–1.5 |
| Meta, task row | sans 14px / 1.35 |
| Eyebrow | sans 12px / 500 / uppercase / `letter-spacing: 0.1em` / `#767676` |
| Caption | sans 13px / `#767676` |

**Spacing & shape** — radii `6 / 8 / 12 / 16` and `999px` for pills, chips, avatars, routine checks. Card padding 24px, tile padding 16px, inner white row 10–14px. Gaps: 8px within a group, 10–12px between rows, 16–20px between blocks, 24px between sections. Use flex/grid + `gap`, never margins between siblings. Goal tiles are 300px fixed width in a horizontally scrolling row.

**Motion** — 150–300ms `cubic-bezier(0.2, 0.7, 0.2, 1)`. Background-color on hover, `translateY(-1px)` lifts at most. No springs, no parallax.

**Never** — 1px gray borders on white cards, horizontal hairline dividers between rows (use whitespace), emoji, icons as hero elements, title case in headlines, white text on gold.

---

## Screen 1 — Goal card widget

**File:** `design-references/1-goal-card-widget.dc.html`
**Where:** a card in the existing `Dashboard.tsx` stack, same shell as its neighbors.

**Purpose:** at-a-glance state of every active goal; entry point to detail and to goal creation.

**Layout:** white card, radius 16, padding 24, card ring + shadow. Header row: "My goals" (19/600) left, "See all" link (14/500, `#767676`) right. Subtitle "Track your progress toward what matters most." (15, `#707070`), 16px below it. Then a horizontal scroll row, `gap: 16`, `overflow-x: auto`, `padding-bottom: 4`.

**Goal tile** — 300px wide, `flex-shrink: 0`, `#F5F5F5`, radius 12, padding 16, column `gap: 12`, `cursor: pointer`, hover `#EEEEEE`. Contents in order:

1. **Status row** — 6px round dot + eyebrow. `#869AA6` + "On track", or `#9F5B34` + "Needs action".
2. **Title block** — goal name (16/600/1.2), then target line (14/1.4/`#767676`), e.g. "Round 1 · Sept 15, 2026" or "Offer signed by · Dec 2026".
3. **Up next tile** — white, radius 8, padding `10px 12px`, `gap: 3`. Eyebrow "Up next" (12/500/uppercase/`#707070`); task title (14/500/1.3); meta row (13/`#767676`) reading "Due today" or "Was due Aug 10", then a `·`, then **either** a streak (11×13 serif-weight flame stroke `#222222` + count, 500) **or** an attribution (16px round headshot + "via Priya").
4. **Progress block** — 4px track radius 999 `rgba(34,34,34,0.10)`, ink fill at completion %; caption "2 of 7 tasks" (12/`#767676`). If overdue, a right-aligned "1 overdue" (12/500/`#9F5B34`) under it.

**New-goal tile** — same 300px box, `#F5F5F5`, `2px dashed #C5C5C5`, centered column: plus icon 20px + "Set a new goal" (15/600), then "Pick what you're working toward next." (14/`#767676`).

**Empty state** (no goals) — no scroll row; a cream `#F3F1E6` block, radius 12, padding 24, space-between and wrapping: left column (max 520px) "Name the thing you're working toward." (16/600) + a 14/1.5/`#4C4C4C` paragraph; right a gold "Set a goal" button.

**Interactions** — tile click → goal detail; "See all" → goals index; new-goal tile and "Set a goal" → screen 4.

## Screen 2 — Goal detail

**File:** `design-references/2-goal-detail.dc.html`

**Purpose:** where the customer works the goal day to day.

**Structure, top to bottom:**

- **Header** — goal name (serif 32), target/status meta line, progress.
- **Routines widget** — its own section above the boards. Each row: 22px **circular** check (unchecked `1.5px #949494` on white; checked ink fill + white 2.5-stroke tick), label 15/500, cadence 13/`#767676`, and a serif flame + streak number on the right.
- **Projects** — one board per project. Default is a single-column list; a per-project **kanban** view (To do / In progress / Done) is the alternative, three columns, tasks draggable between them. Checking a task moves it to Done and ticks the streak.
- **Other tasks** — standalone tasks with no project.
- **Content queue** — pinned at the bottom.
- **Add task** — inline affordance per project and for standalone.

Task rows: white, radius 8, padding `10px 12px`, 18px square check (radius 5), label 14/1.35, unchecked labels stay ink — only *dropped* items go `#949494`. Expert-assigned tasks carry the "via [Expert]" headshot tag.

**View toggle** is exposed as a tweak in the prototype; in production decide list vs. kanban per project and persist it.

## Screen 3 — Expert assigns a task

**File:** `design-references/3-expert-assign-task.dc.html`
**Where:** `src/pages/CoachManage.tsx`, in the post-session panel beside Log time / Schedule a session / Write summary.

**Purpose:** in the two minutes after a session, an expert pushes one concrete next step onto the customer's goal.

**Session header** — 44px round headshot, "Session with Alex Rivera" (16/600), "Ended 12 minutes ago · 45m · MBA strategy" (14/`#707070`).

**Wrap-up row** — three ghost buttons (`rgba(34,34,34,0.05)`, radius 8, padding `12px 20px`, 14/500) then the gold "Assign a task" with an 18px plus icon.

**Form** (opens inline, `#F5F5F5`, radius 12, padding 20, `gap: 16`):

- Header "Assign a task" (16/600) + "Alex sees it on their goal with your name on it." (13/`#707070`); 20px × close button top-right.
- **Task** — text input, full width. Placeholder "Revise essay 1 based on feedback".
- Two-up grid `1.6fr / 1fr`: **Due date** (native date, optional) and **Add to** (select).
- **Add to** options: `Goal · Project` pairs, `Goal · no project`, and `New project in [Goal]…` per goal. Choosing a "new project" option reveals a **New project name** input with the helper "Created on Alex's goal with this task as its first item." and its own validation.
- **Note to Alex** — optional textarea, 3 rows, resize vertical.
- Actions: gold "Assign task", ghost "Cancel", inline rust validation "Give the task a name first." / "Name the project first."

Inputs: 15px text, padding ~11–12px, radius 8, `1.5px solid #949494`, white; focus → `border-color: #222222`, no outline.

**Confirmation** replaces the form: cream block, radius 12, padding 20 — "Assigned to Alex" (16/600), then a white card with the task title (15/500), meta line "Get into Stanford GSB · Application essays · due Aug 22" (13/`#767676`), an optional "New project · [name]" pill, and the note in quotes (13/`#4C4C4C`). Below: ghost "Assign another" + text link "See it on Alex's goal".

## Screen 4 — New goal flow

**File:** `design-references/4-new-goal-template.dc.html`

**Purpose:** turn "I want to do X" into a real plan in under a minute, without a blank slate.

Three steps in one card, with a step rail at top (three dots + uppercase labels; completed and current dots ink, future `rgba(34,34,34,0.20)`; current label ink, others `#949494`).

### Step 1 — Category

- **Goal type** — a 4-up grid of tiles (radius 12, `#F5F5F5`, padding 14): **Learn AI skills**, **Build your career**, **Get into school**, **Take a test**, each with a "N categories" sub-line. Selected → `#EBD4B5` + `inset 0 0 0 1.5px #222222`. This order matches the brand's pathway order.
- **Category** — at least one required; multi-select. Selected categories render as tan pills with a 20px round × remove button.
- **Six picker treatments are prototyped** behind a tweak so you can compare them. Pick one before implementing:
  - **A** search field; "Most picked" chips when empty, results grouped under family headers when typing.
  - **B** two-pane: families with counts left (max-height 300, scroll), leaves right on white.
  - **C** progressive narrowing: bucket grid → "‹ All areas" + leaf pills.
  - **D** free-text → model call maps the description to 1–3 real categories, shown as the same removable chips with "We heard these — drop any that aren't right."
  - **E** same match, and the **plan itself** is model-generated at step 3 from the description plus the step-2 answers.
  - **F** hybrid: free-text on top, "Or browse all N categories" disclosure revealing B. **This is the recommended default.**
- Changing goal type resets categories, answers, and the plan.

### Step 2 — Details

Three questions per goal type, rendered as wrapping pill options (selected `#EBD4B5` + inset ink ring). **Pre-answered with the first option** so the step can be skipped by pressing Continue.

| Goal type | Questions |
| --- | --- |
| Learn AI skills | Where are you starting? · What's this for? · Weekly time |
| Build your career | Where are you in the search? · How's your resume? · Weekly time |
| Get into school | How far along are you? · How many schools? · Do you still need a test score? |
| Take a test | Taken it before? · How long until test day? · Weekly time |

Then a two-up grid: **Name your goal** (auto-derived from the category — "Get into a top MBA program", "Hit my GMAT target score", "Get good at Prompt Engineering" — and editable) and a date field whose label changes by type: "Application deadline" / "Test date" / "Be there by" / "Target date".

### Step 3 — Your plan

Generated plan, everything pre-checked, trimmed by unchecking.

- **Routines block** — `#F5F5F5`, radius 12, eyebrow "Routines" left + "Build the streak" right; each row white with a **circular** check, label 15/500, cadence 13.
- **Project cards** — `#F5F5F5`, radius 12, padding 16. Header: 22px **square** check (radius 6), label 16/600, an optional **why** line (13/`#767676`) shown only when the project exists because of an answer, and "3 of 4" on the right. Tasks indented `padding-left: 34` so they line up under the label, each a white row with an 18px check.
- Unchecking a project unchecks all its tasks and drops the card to `opacity: 0.55`.
- Footer: live count "4 projects · 16 tasks · 2 routines will be created" left; ghost "Back" + gold "Create goal" right. Rust validation "Keep at least one task or routine."

### Done

Cream block: "[Goal name] is live" (serif 28), "[counts] on your dashboard. First routine starts tomorrow." Ink button "Open the goal" + ghost "Start over".

### Plan generation rules

Template plans branch on the step-2 answers — this is the substance of the feature, not decoration:

- **School** — test-prep project only if they still need a score; if retaking, tasks start from the last score report instead of a diagnostic. Essay task count scales 4 → 5 → 6 with 1–2 / 3–5 / 6+ schools. "School list" only when exploring or listing. "Submission check" only when ready to submit. "Interview prep" hidden while merely exploring.
- **Career** — "Get clear on the target" only at that stage; resume tasks differ by resume state; "Target list" hidden when weighing an offer; "Offer and negotiation" only when weighing one. Under 3 hrs/week → apply to one role a day, network Mondays only.
- **Test** — first attempt gets "Baseline", retake gets "Score review". **Section names key off the exam** (`SECTIONS` map): GMAT/GRE quant+verbal, LSAT logical reasoning + reading comp, MCAT chem/phys + bio/biochem + CARS, SAT/ACT math + reading & writing, TOEFL/IELTS reading/listening + speaking/writing; unmapped exams fall back to exam-agnostic phrasing. Under 6 weeks collapses content review to two drills and cuts a mock.
- **Learn AI** — "Foundations" when starting near zero, "Go deeper" when past it; "Build something real" always; then one of Put it to work / Show the work / Bring your team along / Stay current without drowning depending on what it's for.

Port these branches as data + predicates (a `buildPlan(type, categories, answers)` pure function), not as JSX conditionals.

### AI paths (D / E / F)

The prototype calls a model in-page via a design-tool helper (`window.claude.complete`). In production this must be a **server endpoint** — never a key in the client. Two calls:

1. **Match** — system: maps a description onto a fixed taxonomy, JSON only. User message carries the full category pool for the chosen type plus the description; returns `{"categories":[...]}`, filtered against the real pool, capped at 3.
2. **Draft** — returns `{name, routines:[{label,cadence}], projects:[{label,why,tasks:[]}]}` from type + categories + description + answers.

Both need the fallback the prototype has: on error, empty result, or unparseable JSON, fall back to keyword matching / the template plan, and **say so in the UI** ("Matched offline — closest categories from your words") rather than failing silently. Model output also runs through a sentence-case normalizer that preserves acronyms (GMAT, MBA, UX, AI) and words from the selected categories — the design system forbids title case, and models default to it. Keep both guards.

## State

Per screen, roughly:

```ts
// screen 4
type Step = 'category' | 'details' | 'plan' | 'done';
{ step, goalType, categories: string[], query, family, bucket,
  description, matching, matched, matchFailed, browseOpen,
  answers: Record<string,string>, name: string|null, date,
  dropped: Record<string,boolean>,   // 'r0' | 'p2' | 't2-1'
  warn, aiPlan, drafting }
```

`name === null` means "derive from category"; only a user edit sets a string. Dropping is tracked as an opt-out set keyed by index, so regenerating the plan (any answer change) clears it. Any change to type, categories, or answers invalidates a generated plan.

Screen 3: `{ open, title, due, target, projectName, note, warn, assigned }`. Screen 2: task completion, per-project view mode, streak counts, drag state.

## Data model

```ts
type Goal = {
  id: string; name: string; type: 'ai'|'career'|'school'|'test';
  categories: string[]; targetDate?: string;
  status: 'on-track'|'needs-action';
  projects: Project[]; routines: Routine[];
};
type Project = { id: string; name: string; tasks: Task[]; view?: 'list'|'kanban' };
type Task = {
  id: string; title: string; dueDate?: string;
  status: 'todo'|'in-progress'|'done';
  assignedBy?: { name: string; avatarUrl: string };  // → "via Priya"
  note?: string;
};
type Routine = { id: string; label: string; cadence: string; streak: number; lastCheckedAt?: string };
```

Goal progress = done one-off tasks ÷ total one-off tasks. Overdue count drives the "needs action" status and the rust caption.

## Assets

All from the repo — no new assets needed.

- `src/assets/icons/add-plus.svg`, `chevron-right.svg`, `x.svg`, `check.svg`, `drag-dots.svg`
- `src/assets/profile photos/*` (profile photo.png, pic-7.png, …) — placeholder headshots
- Fonts: SeasonMix + Macan, already loaded by `src/styles/leland-theme.css`
- Flame (streak) and the check ticks are inline SVG in the prototypes — lift the paths.

**Placeholder data to replace:** the category families in screen 4 are invented (≈60 entries across four types). Production has 19 school / 142 career / 29 test categories; wire the real taxonomy and the counts on the goal-type tiles recompute from it. Also: three career entries were renamed off retired taxonomy — "Career Coaching → Career Change", "Leadership Coaching → Leadership Development", "Executive Coaching → Executive Presence". Confirm what production should call them.

## Open questions for the team

1. Which category picker treatment ships (A–F)? F is the recommendation.
2. Real category taxonomy — the 142 career entries and their family grouping.
3. Does the category drive anything besides the plan template (expert matching, pricing)? That decides how skippable it can be.
4. List or kanban as the default project view on screen 2.
5. Are the match/draft model calls in scope for v1, or does v1 ship template plans only (treatments A–C)?

## Files

```
design_handoff_goal_dashboard/
  README.md                                    ← this file
  design-references/
    1-goal-card-widget.dc.html
    2-goal-detail.dc.html
    3-expert-assign-task.dc.html
    4-new-goal-template.dc.html
    support.js                                 ← runtime for the .dc.html files
```
