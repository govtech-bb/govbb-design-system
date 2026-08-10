/*
 * Reproduction attempts for two layout defects reported against the design
 * system. Both were claimed independently by two agents building React apps;
 * neither reproduces here.
 *
 * Claim A — `.govbb-grid-row` overflows the mobile frame.
 *   Twelve tracks and eleven 32px column gaps give a 352px floor. The 375px
 *   design frame leaves ~343px of content box, so every page using the
 *   documented scaffold should scroll sideways by ~9px.
 *
 * Claim B — `.govbb-width-container` does not stretch.
 *   Its `margin-inline: auto` suppresses cross-axis stretch once `.govbb-page`
 *   makes it a flex item, so `<main>` shrinks to its content and drifts out of
 *   alignment with the header.
 *
 * Run:  node ci/layout-claims/reproduce.mjs
 *       node ci/layout-claims/reproduce.mjs --css <path-or-url-to-govbb.css>
 *
 * Exits non-zero if either claim reproduces, so this doubles as a regression
 * guard if the defects are ever confirmed and fixed.
 */

import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const argCss = process.argv[process.argv.indexOf('--css') + 1];
const LOCAL = new URL('../../packages/frontend/dist/govbb.css', import.meta.url)
  .href;
const CSS =
  process.argv.includes('--css') && argCss
    ? argCss.startsWith('http')
      ? argCss
      : pathToFileURL(resolve(process.cwd(), argCss)).href
    : LOCAL;

if (CSS.startsWith('file://') && !existsSync(new URL(CSS))) {
  console.error(
    `stylesheet not found: ${CSS}\nBuild it with: pnpm --filter @govtech-bb/frontend build`,
  );
  process.exit(2);
}

const page = (body) =>
  `<!doctype html><html lang="en"><head><meta charset="utf-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <link rel="stylesheet" href="${CSS}"></head>${body}</html>`;

/* The documented scaffold, per packages/frontend/layout.html. */
const scaffold = (inner, { pageOn = 'body' } = {}) => {
  const shell = `<header class="govbb-header">
      <div class="govbb-width-container govbb-header__inner">Government of Barbados</div>
    </header>
    <div class="govbb-width-container">
      <main class="govbb-main-wrapper">
        <div class="govbb-grid-row">
          <div class="govbb-grid-column-two-thirds">${inner}</div>
        </div>
      </main>
    </div>
    <footer class="govbb-footer">
      <div class="govbb-width-container govbb-footer__inner">© 2026</div>
    </footer>`;
  return pageOn === 'body'
    ? `<body class="govbb-page">${shell}</body>`
    : `<body><div id="root" class="govbb-page">${shell}</div></body>`;
};

let failures = 0;
const browser = await chromium.launch();

const measure = async (html, width, evaluate) => {
  const ctx = await browser.newContext({ viewport: { width, height: 800 } });
  const p = await ctx.newPage();
  await p.setContent(html);
  await p.waitForLoadState('load');
  const r = await p.evaluate(evaluate);
  await ctx.close();
  return r;
};

const overflow = () => ({
  scrollWidth: document.documentElement.scrollWidth,
  viewport: window.innerWidth,
  row: Math.round(
    document.querySelector('.govbb-grid-row').getBoundingClientRect().width,
  ),
});

console.log(`stylesheet: ${CSS}\n`);

/* ---- Claim A: horizontal overflow at narrow widths ---- */
console.log('Claim A — .govbb-grid-row overflows the mobile frame');
console.log('  Predicted: ~9px of horizontal scroll at 375px.\n');

for (const width of [320, 360, 375, 414]) {
  const r = await measure(
    page(scaffold('<p>Short paragraph.</p>')),
    width,
    overflow,
  );
  const over = r.scrollWidth - r.viewport;
  if (over > 0) failures++;
  console.log(
    `  ${String(width).padStart(4)}px  scrollWidth ${String(r.scrollWidth).padStart(4)}  row ${String(r.row).padStart(4)}  ` +
      (over > 0 ? `REPRODUCES — overflows by ${over}px` : 'no overflow'),
  );
}

/* Content with intrinsic width is the likeliest trigger: a track floor of 0
   only holds if nothing inside demands more. */
console.log('\n  With content that has intrinsic minimum width, at 375px:');
const contents = {
  'a text input': '<input class="govbb-input" id="a" name="a">',
  'an unbreakable string': '<p>BB2026004512999999999999</p>',
  'a two-column table':
    '<table class="govbb-table"><thead><tr><th class="govbb-table__header" scope="col">Business structure</th><th class="govbb-table__header" scope="col">Registration fee</th></tr></thead></table>',
  'a nested grid row':
    '<div class="govbb-grid-row"><div class="govbb-grid-column-one-half"><p>a</p></div><div class="govbb-grid-column-one-half"><p>b</p></div></div>',
  'a wide summary list':
    '<dl class="govbb-summary-list"><div class="govbb-summary-list__row"><dt class="govbb-summary-list__key">Who registers you</dt><dd class="govbb-summary-list__value">Corporate Affairs and Intellectual Property Office</dd></div></dl>',
};
for (const [label, inner] of Object.entries(contents)) {
  const r = await measure(page(scaffold(inner)), 375, overflow);
  const over = r.scrollWidth - r.viewport;
  if (over > 0) failures++;
  console.log(
    `    ${label.padEnd(24)} ${over > 0 ? `REPRODUCES — ${over}px` : 'no overflow'}`,
  );
}

/* ---- Claim B: width-container fails to stretch ---- */
console.log(
  '\nClaim B — .govbb-width-container shrinks to content as a flex item',
);
console.log('  Predicted: <main> drifts right of the header logo at 1280px.\n');

const alignment = () => {
  const header = document
    .querySelector('.govbb-header__inner')
    .getBoundingClientRect();
  const content = [...document.querySelectorAll('.govbb-width-container')].find(
    (el) =>
      !el.classList.contains('govbb-header__inner') &&
      !el.classList.contains('govbb-footer__inner'),
  );
  const c = content.getBoundingClientRect();
  return {
    headerLeft: Math.round(header.left),
    contentLeft: Math.round(c.left),
    contentWidth: Math.round(c.width),
    viewport: window.innerWidth,
  };
};

const structures = {
  'govbb-page on <body> (documented)': scaffold('<p>Short.</p>'),
  'govbb-page on a React mount node': scaffold('<p>Short.</p>', {
    pageOn: 'div',
  }),
  'width-container is itself <main>': `<body class="govbb-page">
    <header class="govbb-header"><div class="govbb-width-container govbb-header__inner">Government of Barbados</div></header>
    <main class="govbb-width-container govbb-main-wrapper"><p>Short.</p></main>
    <footer class="govbb-footer"><div class="govbb-width-container govbb-footer__inner">© 2026</div></footer></body>`,
};

for (const [label, body] of Object.entries(structures)) {
  const r = await measure(page(body), 1280, alignment);
  const drift = r.contentLeft - r.headerLeft;
  if (Math.abs(drift) > 2) failures++;
  console.log(
    `  ${label.padEnd(36)} drift ${String(drift).padStart(4)}px  width ${r.contentWidth}/${r.viewport}  ` +
      (Math.abs(drift) > 2 ? 'REPRODUCES — misaligned' : 'aligned'),
  );
}

await browser.close();

console.log(
  failures === 0
    ? '\nNeither claim reproduces on this stylesheet.'
    : `\n${failures} measurement(s) reproduced a claim — investigate before dismissing.`,
);
process.exit(failures === 0 ? 0 : 1);
