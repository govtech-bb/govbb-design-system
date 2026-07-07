---
title: Header
description: Use the header to show the gov.bb logo and link back to the homepage.
lede: The gov.bb masthead — a logo linked to the homepage, at the top of every page.
group: Navigation
---

## Preview

```html title="Header" full
<header class="govbb-header">
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

The header is the masthead at the top of every page. It shows the gov.bb logo,
linked to the homepage, inside the standard width container so it aligns with
the page content. You host the logo asset yourself and pass its URL.

## When to use this component

Use the header on every page of a gov.bb service, directly below the
[official banner](/components/official-banner/). Keep it identical across
pages so users always have a way back to the homepage.

## When not to use this component

Do not add extra navigation, buttons, or branding into the header beyond what
the service needs — it is deliberately minimal. Do not replace the logo's
link to the homepage with anything else.

## Adding search

The header accepts extra content after the logo — typically a borderless
[search](/components/search/) form.

```html title="Header with search" full
<header class="govbb-header">
  <div class="govbb-width-container govbb-header__inner">
    <a href="/">
      <img
        class="govbb-header__logo"
        src="/assets/images/govbb-logo.svg"
        alt="gov.bb"
      />
    </a>
    <form class="govbb-search govbb-search--borderless" action="/search">
      <label class="govbb-visually-hidden" for="hdr-q">Search</label>
      <input class="govbb-search__input" id="hdr-q" name="q" type="search" />
      <button class="govbb-search__button" type="submit">Search</button>
    </form>
  </div>
</header>
```

```tsx
import { Header, Search } from '@govtech-bb/react';

<Header logoSrc="/assets/images/govbb-logo.svg">
  <Search borderless action="/search" inputProps={{ name: 'q' }} />
</Header>;
```
