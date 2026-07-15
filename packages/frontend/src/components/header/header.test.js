import { describe, expect, it } from 'vitest';
import { Header, initAll } from '../../../index.js';

function markup() {
  return `
    <header class="govbb-header" data-govbb-module="header">
      <div class="govbb-width-container govbb-header__inner">
        <a href="/"><img class="govbb-header__logo" src="/logo.svg" alt="gov.bb" /></a>
        <button class="govbb-header__toggle" type="button" hidden>Menu</button>
        <nav class="govbb-header__nav" aria-label="Menu">
          <a href="/services">Services</a>
        </nav>
      </div>
    </header>`;
}

function mount() {
  document.body.innerHTML = markup();
  initAll();
  return {
    toggle: document.querySelector('.govbb-header__toggle'),
    nav: document.querySelector('.govbb-header__nav'),
  };
}

describe('header module', () => {
  it('reveals the toggle collapsed and points it at the nav', () => {
    const { toggle, nav } = mount();
    expect(toggle.hasAttribute('hidden')).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(nav.id).not.toBe('');
    expect(toggle.getAttribute('aria-controls')).toBe(nav.id);
  });

  it('flips aria-expanded on each click', () => {
    const { toggle } = mount();
    toggle.click();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    toggle.click();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('keeps an existing nav id', () => {
    document.body.innerHTML = markup();
    document.querySelector('.govbb-header__nav').id = 'site-nav';
    initAll();
    expect(
      document
        .querySelector('.govbb-header__toggle')
        .getAttribute('aria-controls'),
    ).toBe('site-nav');
  });

  it('restores the no-JS baseline on destroy', () => {
    document.body.innerHTML = markup();
    const module = new Header(document.querySelector('.govbb-header'));
    const toggle = document.querySelector('.govbb-header__toggle');
    module.destroy();
    expect(toggle.hasAttribute('hidden')).toBe(true);
    expect(toggle.hasAttribute('aria-expanded')).toBe(false);
    toggle.click();
    expect(toggle.hasAttribute('aria-expanded')).toBe(false); // listener gone
  });
});
