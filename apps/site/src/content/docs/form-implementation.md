---
title: Form implementation
description: Implement accessible forms with native HTML, React, server validation and resilient submission.
lede: Technical guidance for form state, validation, submission and error handling.
---

Start with a working HTML form. Native submission, labels, names and input
types provide a reliable baseline that can be progressively enhanced. Use the
[Forms pattern](/patterns/forms/) for journey and layout decisions and the
[Form fields foundation](/styles/form-fields/) for shared field anatomy.

## Start with native form semantics

Use a real `<form>` with an `action`, `method` and submit button. Every submitted
control needs a stable `name`; every visible control needs a label or fieldset
legend. A control without a `name` is not included in `FormData` or a normal
browser submission.

```html
<form action="/applications/contact" method="post" novalidate>
  <div class="govbb-form-group">
    <label class="govbb-label" for="email">Email address</label>
    <input
      class="govbb-input"
      id="email"
      name="email"
      type="email"
      autocomplete="email"
    />
  </div>
  <button class="govbb-button" type="submit">Continue</button>
</form>
```

Use `novalidate` when the service renders its own consistent server messages.
Keep useful constraints such as `type`, `required`, `min`, `max` and `pattern`
where they describe the data and support client-side enhancement.

## Use uncontrolled fields by default

Most React forms do not need state for every keystroke. Let the browser own
ordinary field values and read them with `FormData` on submission. This keeps
rendering simple and preserves native form behavior.

```tsx
import { Button, Input } from '@govtech-bb/react';
import type { FormEvent } from 'react';

function ContactForm() {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get('email') ?? '');
    // Send email to the service endpoint.
  };

  return (
    <form action="/applications/contact" method="post" onSubmit={submit}>
      <Input
        name="email"
        type="email"
        autoComplete="email"
        label="Email address"
      />
      <Button type="submit">Continue</Button>
    </form>
  );
}
```

Use controlled state when the value changes another part of the interface,
needs live formatting, or must be synchronized outside the form. Do not make a
field controlled only to collect its final value.

## Model submitted data by name

Treat control names as part of the server contract. Keep them stable, unique
within the form, and meaningful. Radio buttons in one group share a name;
checkboxes may share a name when the server accepts multiple values.

Use `data.get(name)` for one value and `data.getAll(name)` for repeated values.
Normalize and validate the result on the server before using it. Never trust a
value because it passed a browser constraint or client-side schema.

## Validation flow

Use one validation flow regardless of whether submission is enhanced:

1. accept the submitted values
2. normalize values without changing their meaning
3. validate on the server
4. return field errors keyed by control name
5. render the same form with submitted values preserved
6. show and focus an error summary
7. repeat each error beside its field

Run validation on submit for most fields. Validate while typing only when the
feedback is genuinely useful before completion, such as showing which password
requirements have been met.

## Render field errors

An error must be visible and programmatically connected to its control. Replace
the hint with the actionable error and point `aria-describedby` at the error ID.

```html
<div class="govbb-form-group">
  <label class="govbb-label" for="email">Email address</label>
  <span class="govbb-error-message" id="email-error" role="alert">
    Enter an email address in the correct format
  </span>
  <input
    class="govbb-input"
    id="email"
    name="email"
    type="email"
    value="alex@"
    aria-invalid="true"
    aria-describedby="email-error"
  />
</div>
```

The React `Input`, `Textarea` and `Select` components accept `label`, `hint`
and `error` props and wire the generated IDs automatically. Use the lower-level
`FormGroup`, `Label`, `Hint` and `ErrorMessage` primitives when custom
composition is necessary.

## Add an error summary

Render the summary before the form heading or at the start of the form content.
Each item links to the invalid control ID. After an enhanced submission fails,
move focus to the summary so keyboard and screen reader users are told what
happened.

Do not show the summary on first load. Keep field and summary messages aligned,
and list errors in form order rather than the order returned by an API.

## Handle server responses

Return structured field errors for validation failures and a separate form-level
message when the request itself could not be completed. Do not attach a service
outage or authorization failure to an arbitrary field.

Use appropriate HTTP status codes. A normal non-JavaScript submission can
render the page directly; an enhanced request can map the same response model
into component props. Keep the server response as the source of truth.

For unexpected failures, preserve local values and offer a safe retry. Do not
claim success until the server has committed the operation.

## Submission state

While a slow request is pending:

- keep entered values visible
- indicate that the form is being submitted
- prevent duplicate requests without trapping the person in a disabled state
- restore the action if the request fails
- avoid moving focus until there is a meaningful result

Use an idempotency key for consequential operations such as payments or final
applications. Client-side button disabling alone cannot prevent duplicate
server work.

## Progressive enhancement

The form must remain usable when JavaScript fails or loads slowly. Keep real
routes in `action`, use submit buttons rather than click handlers on generic
elements, and apply conditional rules on the server as well as the client.

Enhancement may add inline validation, loading feedback, conditional reveals
or asynchronous submission. It must not remove browser navigation, keyboard
support, autofill or the ability to recover from an error.

## Security and privacy

- Validate and authorize every submission on the server.
- Protect state-changing requests against cross-site request forgery.
- Escape submitted values when rendering them back into HTML.
- Apply rate limits to authentication and other abuse-sensitive endpoints.
- Collect only necessary personal information and avoid logging sensitive
  field values.
- Use HTTPS and never put passwords or sensitive answers in query strings.

## Testing

Test the server-rendered path and the enhanced path. Cover valid submission,
each validation rule, multiple simultaneous errors, network failure, duplicate
submission, browser back/forward navigation, autofill and restored values.

Add accessibility checks for labels, descriptions, error connections and focus
movement. Complete the automated coverage with keyboard, screen reader, zoom
and mobile input testing.
