---
title: Error summary
description: Use an error summary to list every problem on a page after a failed form submission.
lede: Lists every problem on a page and links straight to the field that caused it.
group: Feedback
---

## Preview

```html title="Error summary with multiple errors"
<div
  class="govbb-error-summary"
  role="alert"
  aria-labelledby="error-summary-title"
>
  <h2 id="error-summary-title" class="govbb-error-summary__title">
    There is a problem
  </h2>
  <ul class="govbb-error-summary__list">
    <li>
      <a class="govbb-link govbb-error-summary__link" href="#email"
        >Enter an email address in the correct format, like name@example.com</a
      >
    </li>
    <li>
      <a class="govbb-link govbb-error-summary__link" href="#parish"
        >Select a parish</a
      >
    </li>
    <li>
      <a class="govbb-link govbb-error-summary__link" href="#terms"
        >Accept the terms and conditions</a
      >
    </li>
  </ul>
</div>
```

```tsx
import { ErrorSummary } from '@govtech-bb/react';

<ErrorSummary
  errors={[
    {
      href: '#email',
      label:
        'Enter an email address in the correct format, like name@example.com',
    },
    { href: '#parish', label: 'Select a parish' },
    { href: '#terms', label: 'Accept the terms and conditions' },
  ]}
/>;
```

The Error Summary component lists every problem on a page after a failed form
submission, with a link to each field that needs to be fixed. It gives users a
single place to see what went wrong instead of hunting through the form for
individual error messages.

## Usage

<div class="govbb-usage-guidance">
  <section class="govbb-usage-guidance__item" aria-labelledby="error-summary-when-to-use">
    <h3 id="error-summary-when-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--do" aria-hidden="true">✓</span>
      When to use
    </h3>
    <ul>
      <li>Use an error summary whenever a submitted form contains a validation error, even if there is only one.</li>
      <li>Use it together with an error message beside every field that needs correction.</li>
    </ul>
  </section>
  <section class="govbb-usage-guidance__item" aria-labelledby="error-summary-when-not-to-use">
    <h3 id="error-summary-when-not-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--dont" aria-hidden="true">×</span>
      When not to use
    </h3>
    <ul>
      <li>Do not use an error summary for service notices, warnings or successful outcomes.</li>
      <li>Do not show it before the user submits the form or has had a reasonable chance to answer.</li>
    </ul>
  </section>
</div>

## Best practices

### Help users reach each error

Place the summary at the start of the form, move focus to it after an
unsuccessful submission and link every message to the relevant field or group.

### Keep messages consistent

Use the heading “There is a problem”. Match each summary message to the inline
message and prefix the document title with “Error:” so the state is announced
as soon as the page loads.

## Placement and focus

Render the error summary at the top of the page, immediately after a failed
submission, and move keyboard focus to it so users land on the summary
straight away rather than having to scroll to find it. This matters most for
keyboard and screen reader users, who otherwise have no way of knowing the
submission failed.

## Linking errors to fields

Each item in the list should link to the field that caused the error, using
the input's `id` as the anchor. Use the same wording in the summary link and
the field-level error message, so users are not left guessing whether they
refer to the same problem.

## Single error

Show the summary even when only one field has failed. Keeping the behaviour
the same on every failed submission means keyboard focus always lands in the
same place and users learn one pattern, not two. The field itself still gets
its own error message.

```html title="Error summary with a single error"
<div
  class="govbb-error-summary"
  role="alert"
  aria-labelledby="error-summary-title"
>
  <h2 id="error-summary-title" class="govbb-error-summary__title">
    There is a problem
  </h2>
  <ul class="govbb-error-summary__list">
    <li>
      <a class="govbb-link govbb-error-summary__link" href="#full-name"
        >Enter your full name</a
      >
    </li>
  </ul>
</div>
```

```tsx
import { useRef } from 'react';
import { ErrorSummary } from '@govtech-bb/react';

// after a failed submit: summaryRef.current?.focus()
const summaryRef = useRef<HTMLDivElement>(null);

<ErrorSummary
  ref={summaryRef}
  errors={[{ href: '#full-name', label: 'Enter your full name' }]}
/>;
```
