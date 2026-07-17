// Keeps src/examples/ and the content markdown in step, both ways:
// - every `::example{id …}` directive (and every templates page, which
//   references templates/<slug> by convention) must have its .html file;
// - every .html file must be referenced by some page (no orphans);
// - a .tsx React source must sit next to an .html twin.
// Missing markup also fails the build (lib/examples.ts throws), but this runs
// as the site's test script so pre-push catches orphans the build cannot see.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const site = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const contentDir = path.join(site, 'src/content');
const examplesDir = path.join(site, 'src/examples');

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });

// Referenced ids: directives in any content collection, keyed by the
// collection directory the page lives in; plus the templates convention.
const referenced = new Map(); // id -> first referencing file (for messages)
for (const file of walk(contentDir).filter((f) => f.endsWith('.md'))) {
  const rel = path.relative(contentDir, file);
  const collection = rel.split(path.sep)[0];
  const body = fs.readFileSync(file, 'utf8');
  for (const match of body.matchAll(/^::example\{([^}]*)\}/gm)) {
    const id = /id="([^"]+)"/.exec(match[1])?.[1];
    if (!id) {
      fail(`${rel}: ::example directive without an id`);
    }
    referenced.set(`${collection}/${id}`, rel);
  }
  if (collection === 'templates') {
    // Templates reference their example by slug convention, not a directive:
    // templates/<slug>.md -> src/examples/templates/<slug>.html.
    referenced.set(rel.replace(/\.md$/, ''), rel);
  }
}

// Example files on disk.
const htmlIds = new Set();
const tsxIds = new Set();
for (const file of walk(examplesDir)) {
  const rel = path.relative(examplesDir, file);
  if (rel.endsWith('.html')) htmlIds.add(rel.replace(/\.html$/, ''));
  else if (rel.endsWith('.tsx')) tsxIds.add(rel.replace(/\.tsx$/, ''));
}

const problems = [];
for (const [id, from] of referenced) {
  if (!htmlIds.has(id)) {
    problems.push(
      `${from} references "${id}" but src/examples/${id}.html does not exist`,
    );
  }
}
for (const id of htmlIds) {
  if (!referenced.has(id)) {
    problems.push(
      `src/examples/${id}.html is orphaned - no page references it`,
    );
  }
}
for (const id of tsxIds) {
  if (!htmlIds.has(id)) {
    problems.push(
      `src/examples/${id}.tsx has no ${id}.html twin - the React tab needs the markup it renders as`,
    );
  }
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (problems.length > 0) {
  fail(`examples out of step with content:\n  ${problems.join('\n  ')}`);
}
console.log(
  `examples in step: ${htmlIds.size} html (${tsxIds.size} with React), ${referenced.size} references`,
);
