---
title: Header
description: Use the header to show users they are on gov.bb and give them a route back to the homepage.
lede: The gold band at the top of every page, holding the gov.bb logo.
group: Page furniture
---

## Preview

```html title="Header"
<header class="govbb-header" style="width: 100%">
  <div class="govbb-width-container govbb-header__inner">
    <a href="/">
      <img
        class="govbb-header__logo"
        src="/assets/images/govbb-logo.svg"
        alt="gov.bb"
      />
    </a>
  </div>
</header>
```

```tsx
import { Header } from '@govtech-bb/react';

<Header logoSrc="/assets/images/govbb-logo.svg" />;
```

The Header sits at the top of every page, directly below the
[official banner](/components/official-banner/). It holds the gov.bb logo, which
links back to the homepage so users always have a way to start again. The logo
image ships in the `@govtech-bb/frontend` package under `assets/images/`. Host
it with your service and point `src` at your copy.

## Usage

<div class="govbb-usage-guidance">
  <section class="govbb-usage-guidance__item" aria-labelledby="header-when-to-use">
    <h3 id="header-when-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--do" aria-hidden="true">✓</span>
      When to use
    </h3>
    <ul>
      <li>Use the header at the top of every page in a gov.bb website or service.</li>
      <li>Use it to identify the service and provide access to its most important sections.</li>
    </ul>
  </section>
  <section class="govbb-usage-guidance__item" aria-labelledby="header-when-not-to-use">
    <h3 id="header-when-not-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--dont" aria-hidden="true">×</span>
      When not to use
    </h3>
    <ul>
      <li>Do not add a second header or use it elsewhere on the page.</li>
      <li>Do not place page-specific notices in the header; use a <a href="/components/status-banner/">status banner</a>.</li>
    </ul>
  </section>
</div>

## Best practices

### Keep navigation short and recognisable

Use plain-language labels for important sections. Highlight the current
section, keep ordering consistent and move lower-level navigation closer to
the content it controls.

### Preserve the same identity at every width

Keep the service name visible and make the mobile menu operable by keyboard and
assistive technology. Do not use the logo as the page's `h1` except where it is
the genuine homepage heading.

## Adding a search

The header can hold a site-wide search. Use the borderless variant of the
search component so it sits flush on the gold band.

```html title="Header with search"
<header class="govbb-header" style="width: 100%">
  <div class="govbb-width-container govbb-header__inner">
    <a href="/">
      <img
        class="govbb-header__logo"
        src="/assets/images/govbb-logo.svg"
        alt="gov.bb"
      />
    </a>
    <form class="govbb-search govbb-search--borderless" action="/search">
      <label class="govbb-visually-hidden" for="site-search">Search</label>
      <input
        class="govbb-search__input"
        id="site-search"
        name="q"
        type="search"
      />
      <button class="govbb-search__button" type="submit">Search</button>
    </form>
  </div>
</header>
```

```tsx
import { Header, Search } from '@govtech-bb/react';

<Header logoSrc="/assets/images/govbb-logo.svg">
  <Search borderless action="/search" />
</Header>;
```
