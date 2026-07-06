/*
 * Figma token sync — unidirectional, code → Figma (kumo-style).
 *
 * tokens.css is the source of truth. Unlike kumo's purge-everything sync,
 * this script only ever touches ONE collection it owns ("GovBB tokens
 * (code)") — the designers' own variables and collections in the Pattern
 * Library file are never modified. Within that collection the sync is
 * destructive: variables are recreated from tokens.css each run.
 *
 * Mapping: hex primitives → COLOR, var() semantic aliases → VARIABLE_ALIAS,
 * px/rem/unitless numbers → FLOAT (rem × 16). Anything else (font stacks,
 * shadows) is skipped and listed.
 *
 * Usage:
 *   FIGMA_TOKEN=... node ci/figma/sync-tokens-to-figma.mjs [command]
 *
 * Commands:
 *   sync (default)  Recreate the code-token collection in Figma
 *   get             List the file's variable collections and values
 *   diff            Drift check: compare tokens.css against the file's
 *                   existing variables (matched by normalised name)
 *   --dry-run       With sync: print the payload instead of POSTing
 *
 * Env:
 *   FIGMA_TOKEN     Personal access token with file_variables scopes.
 *                   NOTE: the Variables REST API requires a Figma
 *                   Enterprise plan — a 403 with a valid token means the
 *                   plan, not the token.
 *   FIGMA_FILE_KEY  Defaults to the GOV.BB Pattern Library.
 */
import { readFileSync } from 'node:fs';

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FILE_KEY = process.env.FIGMA_FILE_KEY || 'Rexszlh17fXo0XAxO75Mq5';
const TOKENS_CSS = 'packages/frontend/src/tokens.css';
const COLLECTION = 'GovBB tokens (code)';
const API = `https://api.figma.com/v1/files/${FILE_KEY}/variables`;

const command =
  process.argv[2] && !process.argv[2].startsWith('--')
    ? process.argv[2]
    : 'sync';
const dryRun = process.argv.includes('--dry-run');

// ---- tokens.css → typed token list ----------------------------------------

function parseTokens() {
  const css = readFileSync(TOKENS_CSS, 'utf8');
  const tokens = [];
  const skipped = [];
  for (const [, name, raw] of css.matchAll(/--govbb-([\w-]+):\s*([^;]+);/g)) {
    const value = raw
      .replace(/\/\*.*?\*\//gs, '')
      .replace(/\s+/g, ' ')
      .trim();
    let match;
    if ((match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value))) {
      tokens.push({ name, type: 'COLOR', color: hexToRgba(match[1]) });
    } else if ((match = /^var\(\s*--govbb-([\w-]+)\s*\)$/.exec(value))) {
      tokens.push({ name, type: 'ALIAS', target: match[1] });
    } else if ((match = /^(-?[\d.]+)rem$/.exec(value))) {
      tokens.push({ name, type: 'FLOAT', value: parseFloat(match[1]) * 16 });
    } else if ((match = /^(-?[\d.]+)px$/.exec(value))) {
      tokens.push({ name, type: 'FLOAT', value: parseFloat(match[1]) });
    } else if (/^-?[\d.]+$/.test(value)) {
      tokens.push({ name, type: 'FLOAT', value: parseFloat(value) });
    } else {
      skipped.push(name);
    }
  }
  return { tokens, skipped };
}

function hexToRgba(hex) {
  const full = hex.length === 3 ? [...hex].map((c) => c + c).join('') : hex;
  const n = parseInt(full, 16);
  return {
    r: ((n >> 16) & 255) / 255,
    g: ((n >> 8) & 255) / 255,
    b: (n & 255) / 255,
    a: 1,
  };
}

const rgbaToHex = ({ r, g, b }) =>
  '#' +
  [r, g, b]
    .map((c) =>
      Math.round(c * 255)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('');

// ---- Figma REST ------------------------------------------------------------

async function figma(method, body) {
  if (!FIGMA_TOKEN) {
    console.error('FIGMA_TOKEN is not set — nothing to talk to Figma with.');
    process.exit(1);
  }
  const res = await fetch(API + (method === 'GET' ? '/local' : ''), {
    method,
    headers: {
      'X-Figma-Token': FIGMA_TOKEN,
      ...(body && { 'Content-Type': 'application/json' }),
    },
    ...(body && { body: JSON.stringify(body) }),
  });
  if (res.status === 403) {
    console.error(
      'Figma returned 403. The Variables REST API needs an Enterprise plan\n' +
        'and a token with file_variables:read (and :write for sync) scopes.',
    );
    process.exit(1);
  }
  if (!res.ok) {
    console.error(`Figma API ${res.status}: ${await res.text()}`);
    process.exit(1);
  }
  return res.json();
}

const getLocal = async () => (await figma('GET')).meta;

// ---- commands --------------------------------------------------------------

async function cmdGet() {
  const { variableCollections, variables } = await getLocal();
  for (const collection of Object.values(variableCollections)) {
    console.log(`\n${collection.name} (${collection.modes.length} mode(s))`);
    const modeId = collection.defaultModeId;
    for (const variable of Object.values(variables)) {
      if (variable.variableCollectionId !== collection.id) continue;
      const value = variable.valuesByMode[modeId];
      const shown =
        value && typeof value === 'object' && 'r' in value
          ? rgbaToHex(value)
          : JSON.stringify(value);
      console.log(`  ${variable.name} = ${shown}`);
    }
  }
}

/** Loose name match: "teal 00" ≈ "teal-00" ≈ "color/teal/00" ≈ "--govbb-teal-00". */
const normalise = (name) =>
  name
    .toLowerCase()
    .replace(/^--govbb-/, '')
    .replace(/[^a-z0-9]+/g, '');

async function cmdDiff() {
  const { tokens } = parseTokens();
  const { variableCollections, variables } = await getLocal();
  const byName = new Map();
  for (const variable of Object.values(variables)) {
    const collection = variableCollections[variable.variableCollectionId];
    if (collection?.name === COLLECTION) continue; // don't diff against our own sync
    byName.set(normalise(variable.name), { variable, collection });
  }
  let drift = 0;
  for (const token of tokens.filter((t) => t.type === 'COLOR')) {
    const hit = byName.get(normalise(token.name));
    if (!hit) {
      console.log(`missing in figma: ${token.name}`);
      drift++;
      continue;
    }
    const value = hit.variable.valuesByMode[hit.collection.defaultModeId];
    if (value && typeof value === 'object' && 'r' in value) {
      const theirs = rgbaToHex(value);
      const ours = rgbaToHex(token.color);
      if (theirs !== ours) {
        console.log(`drift: ${token.name} code=${ours} figma=${theirs}`);
        drift++;
      }
    }
  }
  console.log(drift ? `\n${drift} token(s) drifted` : 'no drift 🎉');
  process.exit(drift ? 1 : 0);
}

async function cmdSync() {
  const { tokens, skipped } = parseTokens();
  if (skipped.length)
    console.log(`skipping (unmappable): ${skipped.join(', ')}`);

  // Reuse our collection if it exists; delete every variable in it first.
  const existing = dryRun ? null : await getLocal();
  const ours =
    existing &&
    Object.values(existing.variableCollections).find(
      (c) => c.name === COLLECTION,
    );

  const payload = {
    variableCollections: ours
      ? []
      : [{ action: 'CREATE', id: 'coll', name: COLLECTION }],
    variables: [],
    variableModeValues: [],
  };
  const collectionId = ours ? ours.id : 'coll';
  const modeId = ours ? ours.defaultModeId : undefined;

  if (ours) {
    for (const variable of Object.values(existing.variables)) {
      if (variable.variableCollectionId === ours.id) {
        payload.variables.push({ action: 'DELETE', id: variable.id });
      }
    }
  }

  const tempIds = new Map();
  for (const token of tokens) {
    const id = `t-${token.name}`;
    tempIds.set(token.name, id);
    payload.variables.push({
      action: 'CREATE',
      id,
      name: token.name,
      variableCollectionId: collectionId,
      resolvedType: token.type === 'FLOAT' ? 'FLOAT' : 'COLOR',
    });
  }
  for (const token of tokens) {
    let value;
    if (token.type === 'COLOR') value = token.color;
    else if (token.type === 'FLOAT') value = token.value;
    else {
      const target = tempIds.get(token.target);
      if (!target) continue; // alias to something we don't manage
      value = { type: 'VARIABLE_ALIAS', id: target };
    }
    payload.variableModeValues.push({
      variableId: tempIds.get(token.name),
      // for a fresh collection Figma applies values to its initial mode when
      // modeId is omitted-invalid; we must reference the real mode on reuse
      ...(modeId ? { modeId } : { modeId: 'coll-mode' }),
      value,
    });
  }
  if (!ours) {
    payload.variableCollections[0].initialModeId = 'coll-mode';
  }

  if (dryRun) {
    console.log(JSON.stringify(payload, null, 2));
    console.log(
      `\n${tokens.length} token(s): ` +
        `${tokens.filter((t) => t.type === 'COLOR').length} colors, ` +
        `${tokens.filter((t) => t.type === 'ALIAS').length} aliases, ` +
        `${tokens.filter((t) => t.type === 'FLOAT').length} floats`,
    );
    return;
  }
  await figma('POST', payload);
  console.log(
    `synced ${tokens.length} token(s) to "${COLLECTION}" in ${FILE_KEY}`,
  );
}

if (command === 'get') await cmdGet();
else if (command === 'diff') await cmdDiff();
else if (command === 'sync') await cmdSync();
else {
  console.error(`unknown command: ${command} (use sync | get | diff)`);
  process.exit(1);
}
