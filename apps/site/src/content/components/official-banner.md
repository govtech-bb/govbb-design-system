---
title: Official banner
description: Use the official banner to confirm to users that they are on a genuine Government of Barbados website.
lede: A thin dark blue bar confirming this is a genuine government website.
group: Page furniture
---

## Preview

```html title="Official banner"
<div class="govbb-official-banner" style="width: 100%">
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
      <a class="govbb-official-banner__link" href="#">Learn more</a>
    </div>
  </div>
</div>
```

```tsx
import { OfficialBanner } from '@govtech-bb/react';

<OfficialBanner crestSrc="/assets/images/govbb-creast.svg" linkHref="#" />;
```

The official banner is a thin dark blue bar at the very top of the page,
above the [header](/components/header). It shows the coat of arms and a short
message confirming that users are on a genuine Government of Barbados website,
with an optional link to more detail. The crest image is decorative, so keep
`alt=""` — it ships in the `@govtech-bb/frontend` package under
`assets/images/`.

## When to use this component

Use the official banner at the very top of every page of a gov.bb service,
above the header. It helps users trust that the service — and any personal
information it asks for — belongs to the Government of Barbados.

## When not to use this component

Do not use the official banner anywhere other than the top of the page, and do
not change its message. To tell users about the status of a page or service,
such as a beta phase or a disruption, use a status banner instead.
