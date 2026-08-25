---
title: Header
description: Use the header to show users they are on gov.bb and give them a route back to the homepage.
lede: The white band at the top of every page, holding the gov.bb logo and primary navigation.
group: Page furniture
---

## Preview

```html title="Header"
<header class="govbb-header" data-govbb-module="header" style="width: 100%">
  <div class="govbb-width-container govbb-header__inner">
    <a class="govbb-header__home" href="/">
      <img
        class="govbb-header__logo"
        src="/assets/images/govbb-logo.svg"
        alt="gov.bb"
      />
    </a>
    <div class="govbb-header__controls">
      <button
        class="govbb-button govbb-button--text govbb-header__toggle"
        type="button"
        hidden
      >
        Menu
      </button>
    </div>
    <nav class="govbb-header__nav" aria-label="Primary navigation">
      <div class="govbb-header__nav-inner">
        <a class="govbb-link govbb-link--no-visited" href="/services">
          Services
        </a>
        <a class="govbb-button" href="/assistant">Ask Assistant</a>
      </div>
    </nav>
  </div>
</header>
```

```tsx
import { Header, Link, LinkButton } from '@govtech-bb/react';

<Header
  logoSrc="/assets/images/govbb-logo.svg"
  navAriaLabel="Primary navigation"
  nav={
    <>
      <Link href="/services" noVisited>
        Services
      </Link>
      <LinkButton href="/assistant">Ask Assistant</LinkButton>
    </>
  }
/>;
```

The Header sits at the top of every page, directly below the
[official banner](/components/official-banner/). It holds the gov.bb logo, which
links back to the homepage so users always have a way to start again. The logo
image ships in the `@govtech-bb/frontend` package under `assets/images/`. Host
it with your service and point `src` at your copy.

Pass consumer-owned navigation content through `nav`. At tablet and desktop
widths the logo and navigation share one horizontal row. On mobile, the
Header places the navigation in a tinted panel behind a Menu disclosure after
JavaScript loads. A button in the navigation stretches across the mobile panel
and appears before regular links while retaining its supplied order on larger
screens. Without JavaScript, the navigation remains visible so its links are
always available.

The Header owns the navigation landmark, responsive disclosure state and
accessibility wiring, but does not prescribe the links or controls inside it.
It omits the menu control and navigation landmark when `nav` is empty. Use
`children` for optional custom content in the top row.

## Usage

<div class="govbb-usage-guidance">
  <section class="govbb-usage-guidance__item" aria-labelledby="header-when-to-use">
    <h3 id="header-when-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--do" aria-hidden="true">✓</span>
      When to use
    </h3>
    <ul>
      <li>Use the header at the top of every page in a gov.bb website or service.</li>
      <li>Use it to identify gov.bb and provide access to the site's most important sections.</li>
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

Keep the gov.bb identity visible and make the menu operable by keyboard and
assistive technology. Do not use the logo as the page's `h1`.

## Client-side routing

An href-compatible router component can render the logo's home link. Render
the same router's links directly inside `nav`:

```html title="Header links rendered by a client-side router"
<a class="govbb-header__home" href="/">
  <img
    class="govbb-header__logo"
    src="/assets/images/govbb-logo.svg"
    alt="gov.bb"
  />
</a>
<a class="govbb-link govbb-link--no-visited" href="/services"> Services </a>
```

```tsx
import NextLink from 'next/link';

<Header
  logoSrc="/assets/images/govbb-logo.svg"
  linkComponent={NextLink}
  nav={
    <NextLink className="govbb-link govbb-link--no-visited" href="/services">
      Services
    </NextLink>
  }
/>;
```

If a router uses a destination prop other than `href`, provide a small
href-compatible adapter for the logo's `linkComponent`. Menu content can use
that router's components directly.
