---
title: Service heading
description: Use the service heading to open a form page with the service name, the question and any supporting detail.
lede: 'Opens a form page: the service it belongs to, the question, and why you are asking.'
group: Page furniture
---

## Preview

```html title="Service heading"
<div class="govbb-service-heading">
  <p class="govbb-service-heading__service">Redirect my business</p>
  <h1 class="govbb-text-h1">Tell us what position you hold in the business</h1>
  <p class="govbb-service-heading__description">
    We ask so we can check you are allowed to make this request.
  </p>
</div>
```

```tsx
import { ServiceHeading } from '@govtech-bb/react';

<ServiceHeading
  service="Redirect my business"
  description="We ask so we can check you are allowed to make this request."
>
  Tell us what position you hold in the business
</ServiceHeading>;
```

The service heading is the first thing on a form page. It tells someone which
service they are in, asks the question, and — when the question needs it — says
why you are asking. The service name sits behind a quiet rule so it frames the
page without competing with the question.

## Usage

<div class="govbb-usage-guidance">
  <section class="govbb-usage-guidance__item" aria-labelledby="service-heading-when-to-use">
    <h3 id="service-heading-when-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--do" aria-hidden="true">✓</span>
      When to use
    </h3>
    <ul>
      <li>Use it at the top of every question page in a form journey.</li>
      <li>Use it on the pages around the journey — confirmation, check answers — so the service name stays put.</li>
    </ul>
  </section>
  <section class="govbb-usage-guidance__item" aria-labelledby="service-heading-when-not-to-use">
    <h3 id="service-heading-when-not-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--dont" aria-hidden="true">×</span>
      When not to use
    </h3>
    <ul>
      <li>Do not use it for a page heading outside a service, such as guidance or a landing page. Use a heading on its own.</li>
      <li>Do not use it to hold breadcrumbs. The service name states where you are; it is not navigation.</li>
    </ul>
  </section>
</div>

## Content

- **Service name** — the name people saw when they started, unchanged for the
  whole journey. Do not restate the step ("Step 2 of 5") or the department.
- **Question** — the page's `h1`, phrased as the question you are asking:
  "Tell us what position you hold in the business", not "Position".
- **Description** — only when the question cannot carry it. Say why you are
  asking or what happens next, in a line or two. Field-level help belongs in the
  field's hint instead, next to the control it explains.

## The question and the field label

The question is the heading; the field keeps its own label naming the answer.
On a page asking for a position, the heading asks "Tell us what position you
hold in the business" and the input is labelled "Position". Keep the label
short — it names the answer, it does not repeat the question.

## Accessibility

- The service name is a paragraph, not a heading, so the question stays the
  page's only top-level heading and the outline reads as one question per page.
- Keep the question as the `h1`. Use `as="h2"` only when the block opens a
  section of a longer page that already has an `h1`.
- The rule beside the service name is decorative. It carries no meaning that is
  not already in the text.

## Related

- [Single question page](/templates/single-question-page/) — the page this
  heading opens
- [Label](/components/label/) — names the field under the question
- [Typography](/styles/typography/) — the type scale the heading uses
