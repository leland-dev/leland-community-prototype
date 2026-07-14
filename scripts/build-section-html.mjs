// Builds per-SECTION self-contained HTML pages from the leland-courses L1
// session guides, for the community-prototype lesson viewer.
//
// Each session ("lesson") becomes: welcome.html (the hero) plus one page per
// SESSION_CONTENTS section. Everything is inlined (CSS, fonts, renderer);
// the guide's own chrome (top bar, rail, session nav) is hidden — the
// prototype viewer supplies header/sidebar/footer nav.
//
// Also writes src/data/aiBuilderL1Lessons.json (viewer seed manifest).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const COURSES = '/Users/madeleinepimentel/dev/leland-courses';
const GUIDE = join(COURSES, 'public/ai-builder/guide');
const PROTO = '/Users/madeleinepimentel/dev/leland-community-prototype';
const OUT_PUBLIC = join(PROTO, 'public/lessons');
const OUT_MANIFEST = join(PROTO, 'src/data/aiBuilderL1Lessons.json');

// Bump when regenerating so browsers refetch cached lesson iframes.
const CONTENT_VERSION = 2;

function dataUri(path, mime) {
  return `data:${mime};base64,${readFileSync(path).toString('base64')}`;
}

function inlineFontUrls(text) {
  // Handles url("fonts/x.woff2") in guide CSS and
  // url('/ai-builder/guide/fonts/x.woff2') in page/embedded styles.
  return text.replace(
    /url\((["'])(?:\/ai-builder\/guide\/)?(fonts\/[^"']+\.woff2)\1\)/g,
    (orig, quote, rel) => {
      try {
        return `url(${quote}${dataUri(join(GUIDE, rel), 'font/woff2')}${quote})`;
      } catch {
        return orig; // missing in source repo too (404s on the live site)
      }
    },
  );
}

const colorsCss = inlineFontUrls(readFileSync(join(GUIDE, 'colors_and_type.css'), 'utf8'));
const sessionCss = inlineFontUrls(readFileSync(join(GUIDE, 'session.css'), 'utf8'));
const rendererJs = readFileSync(join(GUIDE, 'renderer.js'), 'utf8');
const claudeCodeLogo = dataUri(join(COURSES, 'public/ai-builder/track-logos/claude-code.png'), 'image/png');

const BASE_CHROME_CSS = `
/* Prototype lesson viewer embed: the viewer provides header/sidebar/nav */
.dirD-top { display: none !important; }
.dirB-rail { display: none !important; }
#sg-rail-toggle { display: none !important; }
.dirB-body { grid-template-columns: 1fr !important; }
/* Tool-track switcher (Claude/Gemini/Codex/... pills) hidden — the viewer
   presents a single track; content defaults to the guide's primary track. */
.track-switcher { display: none !important; }
/* Page background removed — the viewer's white content area shows through
   (inner cards keep their own fills). */
html, body { background: transparent !important; }
.dirB { background: transparent !important; }
`;
// Welcome page: hero only. Sections stay in the data (keeps the
// "N builds · model" meta line accurate) but are hidden, as is the
// "Start building" CTA (sidebar handles navigation now).
const WELCOME_CSS = `.dirB-section { display: none !important; } .dirD-cta { display: none !important; }`;
// Section pages: the hero belongs to the welcome page.
const SECTION_CSS = `.dirB-hero { display: none !important; }`;

const HIDE_NAV_JS = `Object.values(window.SESSION_CONTENTS || {}).forEach(function (t) { if (t && t.meta) t.meta.hide_session_nav = true; });`;
const filterJs = (sectionId) =>
  `Object.values(window.SESSION_CONTENTS || {}).forEach(function (t) { if (t && t.sections) t.sections = t.sections.filter(function (s) { return s.id === ${JSON.stringify(sectionId)}; }); });`;

function buildPage(rawHtml, { extraCss, extraJs }) {
  let html = rawHtml;
  html = html.replace(/^---[\s\S]*?---\s*/, ''); // astro frontmatter
  html = html.replace(/ is:global/g, '').replace(/ is:inline/g, '');
  html = html.replace(/^\s*<link rel="(icon|apple-touch-icon)"[^>]*>\n/gm, '');
  html = html.replace(
    /<link rel="stylesheet" href="\/ai-builder\/guide\/colors_and_type\.css">/,
    () => `<style>\n${colorsCss}\n</style>`,
  );
  html = html.replace(
    /<link rel="stylesheet" href="\/ai-builder\/guide\/session\.css">/,
    () => `<style>\n${sessionCss}\n${BASE_CHROME_CSS}\n${extraCss}\n</style>`,
  );
  html = inlineFontUrls(html); // page <style> + SESSION_CONTENTS embedded styles
  html = html.replace(/\/ai-builder\/track-logos\/claude-code\.png/g, claudeCodeLogo);
  html = html.replace(/^\s*<script src="\/ai-builder\/guide\/leland-anon-id\.js"><\/script>\n/m, '');
  html = html.replace(/^\s*<script src="\/ai-builder\/guide\/glossary-autolink\.js" defer><\/script>\n/m, '');
  html = html.replace(
    /<script src="\/ai-builder\/guide\/renderer\.js"><\/script>/,
    () => `<script>${HIDE_NAV_JS}${extraJs}</script>\n<script>\n${rendererJs}\n</script>`,
  );
  const leftovers = [...html.matchAll(/(?:src|href)="(\/[^"]+)"/g)].map((m) => m[1]);
  if (leftovers.length) throw new Error(`unresolved absolute refs: ${leftovers.join(', ')}`);
  return html;
}

const manifest = [];
for (const n of [1, 2, 3, 4]) {
  const raw = readFileSync(join(COURSES, `src/pages/ai-builder/session-${n}-l1-jul-6-26.astro`), 'utf8');
  const contents = JSON.parse(raw.match(/window\.SESSION_CONTENTS = (.*);\n/)[1]);
  const { meta, sections } = contents.claude;

  const dir = join(OUT_PUBLIC, `lesson-${n}`);
  mkdirSync(dir, { recursive: true });

  writeFileSync(join(dir, 'welcome.html'), buildPage(raw, { extraCss: WELCOME_CSS, extraJs: '' }));
  const manifestSections = [
    {
      id: 'welcome',
      title: 'Welcome',
      kind: 'html',
      src: `/lessons/lesson-${n}/welcome.html?v=${CONTENT_VERSION}`,
    },
  ];

  for (const sec of sections) {
    writeFileSync(
      join(dir, `${sec.id}.html`),
      buildPage(raw, { extraCss: SECTION_CSS, extraJs: filterJs(sec.id) }),
    );
    manifestSections.push({
      id: sec.id,
      title: sec.title,
      durationMin: sec.duration_min ?? null,
      kind: 'html',
      src: `/lessons/lesson-${n}/${sec.id}.html?v=${CONTENT_VERSION}`,
    });
  }

  manifest.push({
    id: `lesson-${n}`,
    number: n,
    title: meta.title,
    subtitle: meta.subtitle,
    durationMin: meta.duration_min,
    sections: manifestSections,
  });
  console.log(`lesson-${n}: welcome + ${sections.length} sections`);
}

mkdirSync(join(PROTO, 'src/data'), { recursive: true });
writeFileSync(OUT_MANIFEST, JSON.stringify(manifest, null, 2));
console.log(`manifest: ${OUT_MANIFEST}`);
