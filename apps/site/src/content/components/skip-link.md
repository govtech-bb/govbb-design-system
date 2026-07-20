---
title: Skip link
description: Use a skip link to let keyboard users move directly to the main page content.
lede: Lets keyboard users bypass repeated navigation and reach the main content.
group: Navigation
---

## Preview

```html title="Skip link"
<a class="govbb-skip-link" href="#main-content">Skip to main content</a>

<main id="main-content" tabindex="-1">
  <h1 class="govbb-text-h1">Apply for a passport</h1>
</main>
```

```tsx
import { SkipLink } from '@govtech-bb/react';

<>
  <SkipLink href="#main-content" />
  <main id="main-content" tabIndex={-1}>
    <h1 className="govbb-text-h1">Apply for a passport</h1>
  </main>
</>;
```

Place the skip link first in the page's focus order. It stays off-screen until
it receives keyboard focus, then appears at the top of the page. Its `href`
must match the id of the main content container.

## Usage

<div class="govbb-usage-guidance">
  <section class="govbb-usage-guidance__item" aria-labelledby="skip-link-when-to-use">
    <h3 id="skip-link-when-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--do" aria-hidden="true">✓</span>
      When to use
    </h3>
    <ul>
      <li>Use one on every page that repeats navigation or other content before the main task.</li>
      <li>Keep the label clear and name the destination, usually “Skip to main content”.</li>
    </ul>
  </section>
  <section class="govbb-usage-guidance__item" aria-labelledby="skip-link-when-not-to-use">
    <h3 id="skip-link-when-not-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--dont" aria-hidden="true">×</span>
      When not to use
    </h3>
    <ul>
      <li>Do not hide the link from keyboard focus or remove its visible focused state.</li>
      <li>Do not point it at a missing or non-unique id.</li>
    </ul>
  </section>
</div>

## Best practices

### Make the destination focusable

Use `tabindex="-1"` on the main container when your browser support or routing
setup needs focus to move with the anchor. Keep the main landmark in the normal
document structure and give each page only one main landmark.

### Test it from the address bar

Press Tab from the browser chrome. The skip link should be the first page
control shown. Activate it and confirm that the next Tab continues from the
main content rather than returning to the header.
