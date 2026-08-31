// Records the app-promo phone screens as videos for engineering handoff.
// Each capture route renders ONLY the screen content, so the output drops
// straight into a device frame.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE ?? 'http://localhost:5175';
const OUT = process.env.OUT ?? '/tmp/promo-video';
mkdirSync(OUT, { recursive: true });

// Design sizes match each phone screen; ?zoom scales them up so the recorded
// pixels are crisp. Viewport == recording size, so nothing gets letterboxed.
const CLIPS = [
  // Inbox: title → chips → rows cascade → new message arrives → beat.
  { name: 'inbox', path: '/capture/inbox', dw: 257, dh: 557, zoom: 3, ms: 7000 },
  // Dashboard: cascade in → swipe burst → pause → swipe burst → rest.
  { name: 'dashboard', path: '/capture/dashboard', dw: 390, dh: 845, zoom: 2, ms: 11500 },
];

for (const clip of CLIPS) {
  const browser = await chromium.launch();
  const width = clip.dw * clip.zoom;
  const height = clip.dh * clip.zoom;
  const context = await browser.newContext({
    viewport: { width, height },
    recordVideo: { dir: `${OUT}/${clip.name}`, size: { width, height } },
  });
  const page = await context.newPage();
  await page.goto(`${BASE}${clip.path}?zoom=${clip.zoom}`, { waitUntil: 'load' });
  await page.waitForTimeout(clip.ms);
  await context.close();
  await browser.close();
  console.log(`recorded ${clip.name}`);
}
