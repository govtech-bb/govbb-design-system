---
title: Error Summary
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

## When to use this component

Use an error summary whenever a form submission fails validation, even when
only one field has failed. Place it at the top of the page, above the form,
so it is the first thing a user encounters when the page reloads. Always pair
it with an error message next to each failed field.

## When not to use this component

Do not use an error summary for general page notices or success messages; it
is only for validation errors that block submission. Do not show one before
the user has submitted the form.

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
