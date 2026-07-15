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
  <a class="govbb-link" href="#">Help us improve alpha.gov.bb</a>
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

## When to use this component

Use the feedback box on content and service pages to give users a consistent
route for telling you whether the page worked for them. Place it once, near
the end of the main content, before the footer.

## When not to use this component

Do not use the feedback box for messages about the page's status, such as a
service being in Alpha or Beta. Use the
[status banner](/components/status-banner/) instead. Do not use it to collect
the feedback itself; link to a page with a form for that.

## Custom heading

Replace the default heading when the prompt needs different wording.

```html title="Feedback box with a custom heading"
<aside class="govbb-feedback">
  <h3 class="govbb-feedback__heading">Rate this service</h3>
  <p>Tell us how your application went.</p>
  <a class="govbb-link" href="#">Give feedback on this service</a>
</aside>
```

```tsx
import { Feedback, Link } from '@govtech-bb/react';

<Feedback heading="Rate this service">
  <p>Tell us how your application went.</p>
  <Link href="/feedback">Give feedback on this service</Link>
</Feedback>;
```
