---
title: Check answers
description: Let users review and change their answers before they submit.
lede: Show a summary of every answer, with a way to change each one, before submitting.
group: Help users to
---

## Preview

```html title="Check your answers"
<dl class="govbb-summary-list">
  <div class="govbb-summary-list__row">
    <dt class="govbb-summary-list__key">Name</dt>
    <dd class="govbb-summary-list__value">Alex Nurse</dd>
    <dd class="govbb-summary-list__actions">
      <a class="govbb-link" href="/service/name/">
        Change<span class="govbb-visually-hidden"> name</span>
      </a>
    </dd>
  </div>
  <div class="govbb-summary-list__row">
    <dt class="govbb-summary-list__key">Date of birth</dt>
    <dd class="govbb-summary-list__value">14 March 1990</dd>
    <dd class="govbb-summary-list__actions">
      <a class="govbb-link" href="/service/date-of-birth/">
        Change<span class="govbb-visually-hidden"> date of birth</span>
      </a>
    </dd>
  </div>
  <div class="govbb-summary-list__row">
    <dt class="govbb-summary-list__key">Email address</dt>
    <dd class="govbb-summary-list__value">alex.nurse@example.com</dd>
    <dd class="govbb-summary-list__actions">
      <a class="govbb-link" href="/service/email-address/">
        Change<span class="govbb-visually-hidden"> email address</span>
      </a>
    </dd>
  </div>
</dl>

<button class="govbb-button" type="submit">Accept and send</button>
```

Before a user submits, show everything they have entered on a single "Check
your answers" page built from a [summary list](/components/summary-list/), with
a way to change each answer and a button to submit. It catches mistakes and
gives the user confidence in what they are sending.

## When to use this pattern

Use it at the end of any multi-step form, before the answers are submitted —
an application, a claim, a registration. Skip it for a single trivial question
where there is nothing to review.

## Change links

Give every row a "Change" link that returns to the relevant question. Add
visually hidden text naming the answer — "Change<span> name</span>" — so a
screen reader user hears "Change name", not a page full of identical "Change"
links. Return the user to this page after they make an edit.

## Grouping answers

For a long form, split the summary into sections with a heading per section, so
the page is easy to scan. Keep the order of answers the same as the order the
user entered them.

## The submit button

Label the button for the action, such as "Accept and send", not a generic
"Continue". Make clear what happens on submit — for example, a declaration
above the button if the user is confirming the information is true.

## After submitting

Send the user to a confirmation page with a reference number they can keep. Do
not leave them on the check answers page wondering whether it worked.
