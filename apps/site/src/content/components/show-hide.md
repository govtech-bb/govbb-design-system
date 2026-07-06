---
title: Show/Hide
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

## When to use this component

Use show/hide for supporting information that the average user can skip, such as
help text, worked examples, or extra detail that only some users need.

## When not to use this component

Do not hide content that users need in order to complete the task. If most users
need the information, show it on the page rather than hiding it behind a
disclosure.

## Writing the summary

Write the summary as a descriptive noun phrase, such as _"What is a parish?"_,
rather than a vague label like _"More info"_. The summary is built on the native
`<details>` element, so keyboard and screen reader behaviour work without any
extra scripting.

## Open by default

A disclosure can start open if the content inside it is useful to most users but
still optional to read. Use this sparingly — most disclosures should start
closed.

```html title="Open by default"
<details class="govbb-show-hide" open>
  <summary class="govbb-show-hide__summary">More information</summary>
  <div class="govbb-show-hide__content">
    <p>
      This panel is open on page load. Use this sparingly — most disclosures
      should start closed.
    </p>
  </div>
</details>
```

```tsx
import { ShowHide } from '@govtech-bb/react';

<ShowHide summary="More information" open>
  <p>
    This panel is open on page load. Use this sparingly — most disclosures
    should start closed.
  </p>
</ShowHide>;
```
