/*
 * Progressive-enhancement runtime. Plain ESM with no build step, so a browser
 * can load it with <script type="module"> and a bundler can import it as-is.
 *
 * Components that need JS register here, keyed by their data-govbb-module value.
 * CSS-only components register nothing.
 */

/** @type {Record<string, new (el: HTMLElement) => { destroy(): void }>} */
const registry = {
  // e.g. 'show-hide': ShowHide
};

/**
 * Scan `root` for [data-govbb-module] elements and enhance each one.
 * @param {ParentNode} [root]
 */
export function initAll(root = document) {
  for (const el of root.querySelectorAll('[data-govbb-module]')) {
    const Module = registry[el.dataset.govbbModule];
    if (Module) new Module(el);
  }
}
