# Design system sync — porting rules

This folder mirrors the Leland production design system from the monorepo
(`leland-dev/leland-applicant-web`). `port-manifest.json` records what is
ported from where and the monorepo commit last synced. A scheduled routine
diffs the watched paths weekly and ports changes by these rules.

## Environment differences (why 1:1 copies don't work)

| Monorepo | Prototype |
| --- | --- |
| Next.js (`next/link`, `next/image`) | Vite + `react-router-dom` (`<Link to=…>`) |
| Tailwind v3 JS preset (`tailwind-config.js`) | Tailwind v4 CSS-first (`@theme` in `src/styles/leland-theme.css`) |
| Base text scale overridden: `text-sm`=12px, `text-base`=14px | Tailwind defaults kept: substitute explicit sizes (`text-[0.75rem]`, `text-[0.875rem]`) in ported class strings |
| Radix UI primitives available | Avoid adding radix deps for trivial primitives (ProgressBar uses plain divs); fine to add a radix package when a complex component genuinely needs it (Modal, Menu) |
| Default sans = Macan via preset | Default sans = Macan via `--font-sans` in `src/index.css` |

## Rules

1. **Class-string parity first.** Ported components keep the production
   Tailwind class strings verbatim except the documented substitutions above.
   Color/typography utilities (`bg-leland-*`, `text-heading-*`, `leland-heading-*`)
   resolve through `src/styles/leland-theme.css` — if a component uses a new
   token, add the token there (translated to v4 `@theme` syntax).
2. **Theme changes** (`tailwind-config.js`, `brand-tokens.css`): translate into
   `leland-theme.css`. Do NOT port the base `text-*`/`fontWeight` scale
   overrides or change the prototype-wide `--color-*`/spacing tokens — the
   port is additive and namespaced.
3. **Icons** (`packages/ui-library/src/svg/`): copy changed/new files verbatim
   into `src/components/leland/svg/`, including the `index.tsx` barrels.
4. **Structure**: this port flattens each component (component + constants in
   one file). Apply upstream diffs to the corresponding section of the
   flattened file rather than recreating the monorepo file layout.
5. **Verify** with `npx tsc --noEmit` before committing. The reference page at
   `/components/leland` (`src/pages/LelandKitTest.tsx`) should render every
   variant — extend it when new components are ported.
6. **After syncing**, set `lastSyncedMonorepoCommit` in `port-manifest.json`
   to the monorepo main commit you synced to.
7. **Adding new ports by hand**: add a manifest entry (target, sourcePaths,
   notes) so the routine watches it going forward.
