/*
 * Header menu toggle. Enhances .govbb-header at every width: reveals the
 * .govbb-header__toggle button (server-rendered [hidden]) and collapses the
 * __nav panel behind it, flipping the button's aria-expanded and the nav's
 * hidden attribute on click. Without JS the toggle stays hidden and the nav
 * panel stays open.
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
    this.nav.hidden = true;
    this.toggle.addEventListener('click', this.onClick);
  }

  onClick() {
    const expanded = this.toggle.getAttribute('aria-expanded') === 'true';
    this.toggle.setAttribute('aria-expanded', String(!expanded));
    this.nav.hidden = expanded;
  }

  destroy() {
    if (!this.toggle || !this.nav) return;
    this.toggle.removeEventListener('click', this.onClick);
    // back to the no-JS baseline: hidden toggle, open panel
    this.toggle.removeAttribute('aria-expanded');
    this.toggle.setAttribute('hidden', '');
    this.nav.hidden = false;
  }
}
