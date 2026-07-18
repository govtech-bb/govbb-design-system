---
title: Feedback
description: Use the feedback component to invite users to comment on the current page.
lede: A gold-bordered box asking users whether the page was helpful.
group: Feedback
---

## Preview

```html title="Feedback box"
<aside class="govbb-feedback">
  <h3 class="govbb-feedback__heading">Was this helpful?</h3>
  <p>Give us your feedback about this page.</p>
  <a class="govbb-link" href="/feedback/">Help us improve alpha.gov.bb</a>
</aside>
```

```tsx
import { Feedback, Link } from '@govtech-bb/react';

<Feedback>
  <p>Give us your feedback about this page.</p>
  <Link href="/feedback">Help us improve alpha.gov.bb</Link>
</Feedback>;
```

The Feedback component is a gold-bordered box that asks users whether the
page was helpful and links to a feedback route. It holds a heading, a short
line of body copy and a link. It renders as an `aside`, so it sits alongside
the page's main content rather than inside it.

In React the heading defaults to "Was this helpful?" and can be replaced with
the `heading` prop. The body copy and the link are children, so you keep
control of the link target, analytics attributes and router integration. Use
the [Link](/components/link/) component (or a plain `a` with the `govbb-link`
class) for the link; on the tinted surface it renders in ink and lifts to a
white background on hover, the same as links in the status banner.

## Usage

<div class="govbb-usage-guidance">
  <section class="govbb-usage-guidance__item" aria-labelledby="feedback-when-to-use">
    <h3 id="feedback-when-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--do" aria-hidden="true">✓</span>
      When to use
    </h3>
    <ul>
      <li>Use the feedback box to give users a consistent route for commenting on a page or service.</li>
      <li>Place it once, near the end of the main content and before the footer.</li>
    </ul>
  </section>
  <section class="govbb-usage-guidance__item" aria-labelledby="feedback-when-not-to-use">
    <h3 id="feedback-when-not-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--dont" aria-hidden="true">×</span>
      When not to use
    </h3>
    <ul>
      <li>Do not use it for lifecycle or service messages; use a <a href="/components/status-banner/">status banner</a>.</li>
      <li>Do not place a complete survey or open text field inside the box; link to a focused feedback form.</li>
    </ul>
  </section>
</div>

## Best practices

### Ask about the page the user just used

Keep the prompt short and specific. Carry the page URL or identifier into the
feedback route so users do not have to explain where they were.

### Set expectations before collecting feedback

Make it clear whether feedback will receive a response. Provide a separate
contact route for help with an individual case or urgent service problem.

## Custom heading

Replace the default heading when the prompt needs different wording.

```html title="Feedback box with a custom heading"
<aside class="govbb-feedback">
  <h3 class="govbb-feedback__heading">Rate this service</h3>
  <p>Tell us how your application went.</p>
  <a class="govbb-link" href="/feedback/">Give feedback on this service</a>
</aside>
```

```tsx
import { Feedback, Link } from '@govtech-bb/react';

<Feedback heading="Rate this service">
  <p>Tell us how your application went.</p>
  <Link href="/feedback">Give feedback on this service</Link>
</Feedback>;
```
