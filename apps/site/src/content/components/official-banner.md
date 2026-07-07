---
title: Official banner
description: Use the official banner to show users the site is an official Government of Barbados website.
lede: Tells users they are on an official Government of Barbados website.
group: Navigation
---

## Preview

```html title="Official banner" full
<div class="govbb-official-banner">
  <div class="govbb-width-container govbb-official-banner__inner">
    <div class="govbb-official-banner__crest">
      <img
        class="govbb-official-banner__icon"
        src="/assets/images/govbb-creast.svg"
        alt=""
      />
    </div>
    <div class="govbb-official-banner__text">
      <span>Official government website</span>
      <a class="govbb-official-banner__link" href="/about">Learn more</a>
    </div>
  </div>
</div>
```

```tsx
import { OfficialBanner } from '@govtech-bb/react';

<OfficialBanner crestSrc="/assets/images/govbb-creast.svg" linkHref="/about" />;
```

The official banner is a slim strip above the [header](/components/header/)
showing the coat of arms and the words _Official government website_. It gives
users a consistent signal that the site is genuinely run by the Government of
Barbados, with an optional link to a page explaining how to verify that. You
host the crest asset yourself and pass its URL.

## When to use this component

Use the official banner at the very top of every page of a gov.bb service,
above the header. Consistency is the point — the banner only builds trust if
users see it in the same place on every official site.

## When not to use this component

Do not use the official banner on sites that are not operated by the
Government of Barbados. Do not use it lower down the page or as a decorative
element — it belongs at the top, once.

## Customising the text and link

The banner text defaults to _Official government website_ and the link label
to _Learn more_. Both can be changed — the link is optional and only renders
when a destination is given.

```html title="Banner without a link" full
<div class="govbb-official-banner">
  <div class="govbb-width-container govbb-official-banner__inner">
    <div class="govbb-official-banner__crest">
      <img
        class="govbb-official-banner__icon"
        src="/assets/images/govbb-creast.svg"
        alt=""
      />
    </div>
    <div class="govbb-official-banner__text">
      <span>Official government website</span>
    </div>
  </div>
</div>
```

```tsx
import { OfficialBanner } from '@govtech-bb/react';

<OfficialBanner crestSrc="/assets/images/govbb-creast.svg" />;
```
