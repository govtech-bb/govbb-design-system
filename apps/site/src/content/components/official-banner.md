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
        src="/assets/images/govbb-crest.svg"
        alt=""
      />
    </div>
    <div class="govbb-official-banner__text">
      <span>Official government website</span>
      <a
        class="govbb-official-banner__link"
        href="/government/website-information/"
      >
        Learn more
      </a>
    </div>
  </div>
</div>
```

```tsx
import { OfficialBanner } from '@govtech-bb/react';

<OfficialBanner
  imageSrc="/assets/images/govbb-crest.svg"
  imageAlt=""
  showLearnMore
  learnMoreHref="/government/website-information/"
/>;
```

The official banner is a thin dark blue bar at the very top of the page,
above the [header](/components/header/). It shows the coat of arms and a short
message confirming that users are on a genuine Government of Barbados website,
with an optional link to more detail. The crest image is decorative, so keep
`alt=""`. It ships in the `@govtech-bb/frontend` package under
`assets/images/`.

## Usage

<div class="govbb-usage-guidance">
  <section class="govbb-usage-guidance__item" aria-labelledby="official-banner-when-to-use">
    <h3 id="official-banner-when-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--do" aria-hidden="true">✓</span>
      When to use
    </h3>
    <ul>
      <li>Use the official banner at the very top of a Government of Barbados website or service.</li>
      <li>Use it to help people recognise the site as an official government destination.</li>
    </ul>
  </section>
  <section class="govbb-usage-guidance__item" aria-labelledby="official-banner-when-not-to-use">
    <h3 id="official-banner-when-not-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--dont" aria-hidden="true">×</span>
      When not to use
    </h3>
    <ul>
      <li>Do not use the banner on a site that is not an official Government of Barbados service.</li>
      <li>Do not use it for alerts, service updates or page-level messages.</li>
    </ul>
  </section>
</div>

## Best practices

### Use the standard message and position

Keep the banner above the header and use the approved wording without adding
campaign copy, navigation or service-specific messages.

### Support trust without making unsupported claims

Link any expanded explanation to useful information about the government
domain and secure connection. The banner should identify the site; it should
not promise that a particular transaction or third-party destination is safe.
