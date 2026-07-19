---
title: Check answers
description: Let users review and change their answers before they submit.
lede: Show a summary of every answer, with a way to change each one, before submitting.
group: Help users to
---

## Preview

```html title="Check your answers"
<section class="govbb-summary-section">
  <div class="govbb-summary-section__header">
    <h2 class="govbb-summary-section__title">Tell us about yourself</h2>
    <a class="govbb-link" href="/service/about-you/">
      Change<span class="govbb-visually-hidden"> tell us about yourself</span>
    </a>
  </div>
  <dl class="govbb-summary-list">
    <div class="govbb-summary-list__row">
      <dt class="govbb-summary-list__key">Name</dt>
      <dd class="govbb-summary-list__value">Alex Nurse</dd>
    </div>
    <div class="govbb-summary-list__row">
      <dt class="govbb-summary-list__key">Date of birth</dt>
      <dd class="govbb-summary-list__value">14 March 1990</dd>
    </div>
  </dl>
</section>
<section class="govbb-summary-section">
  <div class="govbb-summary-section__header">
    <h2 class="govbb-summary-section__title">Your contact details</h2>
    <a class="govbb-link" href="/service/contact/">
      Change<span class="govbb-visually-hidden"> your contact details</span>
    </a>
  </div>
  <dl class="govbb-summary-list">
    <div class="govbb-summary-list__row">
      <dt class="govbb-summary-list__key">Email address</dt>
      <dd class="govbb-summary-list__value">alex.nurse@example.com</dd>
    </div>
  </dl>
</section>

<button class="govbb-button" type="submit">Accept and send</button>
```

Before a user submits, show everything they have entered on a single "Check
your answers" page: one [summary section](/components/summary-list/#sections)
per form page, each holding a summary list of that page's answers and a change
link back to it, with a button to submit. It
catches mistakes and gives the user confidence in what they are sending.

## When to use this pattern

Use it at the end of any multi-step form, before the answers are submitted —
an application, a claim, a registration. Skip it for a single trivial question
where there is nothing to review.

## Change links

Give every section a "Change" link that returns to the form page it summarises.
Add visually hidden text naming the section — "Change<span> your contact
details</span>" — so a screen reader user hears which section each identical
"Change" link edits. Return the user to this page after they make an edit.

Use a per-row change link ([summary list actions](/components/summary-list/#row-actions))
only when answers on one page must be edited individually; do not mix per-row
and per-section links in the same summary.

## Grouping answers

Give each section a heading matching the form page it came from, so the page is
easy to scan. Keep the order of sections and answers the same as the order the
user entered them.

## The submit button

Label the button for the action, such as "Accept and send", not a generic
"Continue". Make clear what happens on submit — for example, a declaration
above the button if the user is confirming the information is true.

## After submitting

Send the user to a confirmation page with a reference number they can keep. Do
not leave them on the check answers page wondering whether it worked.
