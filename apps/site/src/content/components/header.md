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

## When to use this component

Use the header at the top of every page of a gov.bb service, directly below the
official banner. Keep it consistent across the whole service so users always
know where they are.

## When not to use this component

Do not use the header anywhere other than the top of the page, and do not add a
second header. If you need to tell users about the status of a page or service,
use a status banner below the header instead.

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
