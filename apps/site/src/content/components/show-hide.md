---
title: Show/hide
description: Use show/hide to reveal secondary content on demand.
lede: Reveal secondary content, such as help text, on demand.
group: Content
---

## Preview

```html title="Show/Hide"
<details class="govbb-show-hide">
  <summary class="govbb-show-hide__summary">Help with this form</summary>
  <div class="govbb-show-hide__content">
    <p>
      If you cannot find your ID number, check the back of your citizen card.
    </p>
  </div>
</details>
```

```tsx
import { ShowHide } from '@govtech-bb/react';

<ShowHide summary="Help with this form">
  <p>If you cannot find your ID number, check the back of your citizen card.</p>
</ShowHide>;
```

The Show/Hide component is a disclosure that reveals secondary content when a
user chooses to see it. It is useful for help text and other detail that not
every user needs to read.

## Usage

<div class="govbb-usage-guidance">
  <section class="govbb-usage-guidance__item" aria-labelledby="show-hide-when-to-use">
    <h3 id="show-hide-when-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--do" aria-hidden="true">✓</span>
      When to use
    </h3>
    <ul>
      <li>Use show/hide for one section of supporting information that only some users need.</li>
      <li>Use it for optional help, a worked example or additional explanation.</li>
    </ul>
  </section>
  <section class="govbb-usage-guidance__item" aria-labelledby="show-hide-when-not-to-use">
    <h3 id="show-hide-when-not-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--dont" aria-hidden="true">×</span>
      When not to use
    </h3>
    <ul>
      <li>Do not hide information most users need to understand or complete the task.</li>
      <li>Do not use it for sequential steps, validation errors or the primary action.</li>
    </ul>
  </section>
</div>

## Best practices

### Make the closed summary meaningful

Write a short summary that names what will be revealed, such as “Help with
proof of address”. Avoid vague labels such as “More information”.

### Keep disclosure content focused

Use one show/hide for one secondary section. Avoid nesting disclosures, and
show the content by default when most users need it or when hiding it would
prevent completion.

## Writing the summary

Write the summary as a descriptive noun phrase, such as _"What is a parish?"_,
rather than a vague label like _"More info"_. The summary is built on the native
`<details>` element, so keyboard and screen reader behaviour work without any
extra scripting.

## Open by default

A disclosure can start open if the content inside it is useful to most users but
still optional to read. Use this sparingly: most disclosures should start
closed.

```html title="Open by default"
<details class="govbb-show-hide" open>
  <summary class="govbb-show-hide__summary">More information</summary>
  <div class="govbb-show-hide__content">
    <p>
      This panel is open on page load. Use this sparingly: most disclosures
      should start closed.
    </p>
  </div>
</details>
```

```tsx
import { ShowHide } from '@govtech-bb/react';

<ShowHide summary="More information" open>
  <p>
    This panel is open on page load. Use this sparingly: most disclosures should
    start closed.
  </p>
</ShowHide>;
```
