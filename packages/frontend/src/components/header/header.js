/*
 * Header menu toggle. Enhances .govbb-header: reveals the phone-only
 * .govbb-header__toggle button (server-rendered [hidden]) and collapses the
 * __nav panel behind it — the CSS keys the panel's visibility off the
 * toggle's aria-expanded, so this module only flips the attribute. Without
 * JS the toggle stays hidden and the nav panel stays open.
 */
export class Header {
  /** @param {HTMLElement} el */
  constructor(el) {
    this.el = el;
    this.toggle = el.querySelector('.govbb-header__toggle');
    this.nav = el.querySelector('.govbb-header__nav');
    if (!this.toggle || !this.nav) return;
    if (!this.nav.id) this.nav.id = 'govbb-header-nav';
    this.onClick = this.onClick.bind(this);
    this.toggle.setAttribute('aria-controls', this.nav.id);
    this.toggle.setAttribute('aria-expanded', 'false'); // start collapsed
    this.toggle.removeAttribute('hidden');
    this.toggle.addEventListener('click', this.onClick);
  }

  onClick() {
    const expanded = this.toggle.getAttribute('aria-expanded') === 'true';
    this.toggle.setAttribute('aria-expanded', String(!expanded));
  }

  destroy() {
    if (!this.toggle || !this.nav) return;
    this.toggle.removeEventListener('click', this.onClick);
    // back to the no-JS baseline: hidden toggle, open panel
    this.toggle.removeAttribute('aria-expanded');
    this.toggle.setAttribute('hidden', '');
  }
}
