/* Prose leak audit — prose rules are specificity 0, so a component defends
   itself by declaring the property it cares about. Anything it leaves
   undeclared, prose paints. This clones every component out of the playground
   into a .govbb-prose wrapper, diffs the computed styles against the same
   markup outside prose, and reports what changed. Clean run prints 0.

   node scripts/prose-audit.mjs   (run `pnpm build` first) */
import { chromium } from 'playwright';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const page = join(mkdtempSync(join(tmpdir(), 'prose-audit-')), 'page.html');
writeFileSync(
  page,
  readFileSync(join(root, 'index.html'), 'utf8').replace(
    '<link rel="stylesheet" href="/src/index.css" />',
    `<style>${readFileSync(join(root, 'dist/govbb.css'), 'utf8')}</style>`,
  ),
);

/* Widths worth checking: the desktop rules and the mobile-only ones. */
const WIDTHS = [1100, 375];

const browser = await chromium.launch();
const findings = [];

for (const width of WIDTHS) {
  const p = await browser.newPage({ viewport: { width, height: 900 } });
  await p.goto(`file://${page}`);
  findings.push(
    ...(await p.evaluate((stageWidth) => {
      /* overflow-wrap and scroll-margin are inherited/anchor niceties prose is
         entitled to hand down; everything else here is a component's own look. */
      const PROPS = [
        'marginTop',
        'marginRight',
        'marginBottom',
        'marginLeft',
        'paddingTop',
        'paddingRight',
        'paddingBottom',
        'paddingLeft',
        'fontSize',
        'lineHeight',
        'fontFamily',
        'letterSpacing',
        'color',
        'backgroundColor',
        'listStyleType',
        'listStylePosition',
        'maxInlineSize',
        'tableLayout',
        'overflowX',
        'borderRadius',
        'borderTopWidth',
        'borderBottomWidth',
        'borderLeftWidth',
        'borderTopStyle',
        'borderBottomStyle',
        'borderBottomColor',
      ];
      const BLOCK = /^govbb-[a-z0-9-]+$/;
      const blockName = (el) =>
        [...el.classList].find((c) => BLOCK.test(c) && !c.includes('__'));

      const roots = [...document.querySelectorAll('[class*="govbb-"]')].filter(
        (el) => blockName(el) && !el.parentElement.closest('[class*="govbb-"]'),
      );

      const stage = document.createElement('div');
      stage.style.cssText = `position:absolute;left:-99999px;top:0;width:${stageWidth - 32}px`;
      document.body.append(stage);

      const out = [];
      for (const root of roots) {
        const plain = document.createElement('div');
        const prose = document.createElement('div');
        prose.className = 'govbb-prose';
        const a = root.cloneNode(true);
        const b = root.cloneNode(true);
        plain.append(a);
        prose.append(b);
        stage.append(plain, prose);

        const outside = [a, ...a.querySelectorAll('*')];
        const inside = [b, ...b.querySelectorAll('*')];
        for (let i = 0; i < outside.length; i++) {
          const ca = getComputedStyle(outside[i]);
          const cb = getComputedStyle(inside[i]);
          const diffs = PROPS.filter((k) => ca[k] !== cb[k]).map(
            (k) => `${k}: ${ca[k]} -> ${cb[k]}`,
          );
          if (diffs.length) {
            const el = outside[i];
            out.push({
              component: blockName(root),
              el:
                el.tagName.toLowerCase() +
                (el.classList.length ? `.${[...el.classList].join('.')}` : ''),
              diffs,
            });
          }
        }
        plain.remove();
        prose.remove();
      }
      stage.remove();
      return out;
    }, width)),
  );
  await p.close();
}
await browser.close();

for (const f of findings)
  console.log(`${f.component} — ${f.el}\n  ${f.diffs.join('\n  ')}`);
console.log(`\nprose leaks: ${findings.length}`);
process.exit(findings.length ? 1 : 0);
