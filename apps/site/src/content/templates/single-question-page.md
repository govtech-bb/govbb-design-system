---
title: Single question page
description: The one-thing-per-page form scaffold - service heading, error summary, one question, back and continue.
lede: 'One question per page: the default shape of a form step.'
group: Forms
---

## Preview

```html title="Single question page"
<main class="govbb-width-container govbb-main-wrapper" id="main-content">
  <div class="govbb-error-summary" role="alert" tabindex="-1">
    <h2 class="govbb-error-summary__title">There is a problem</h2>
    <ul class="govbb-error-summary__list">
      <li>
        <a class="govbb-error-summary__link" href="#full-name">
          Enter your full name
        </a>
      </li>
    </ul>
  </div>

  <div class="govbb-service-heading">
    <p class="govbb-service-heading__service">Redirect my business</p>
    <h1 class="govbb-text-h1">What is your full name?</h1>
  </div>

  <form action="/service/answer/" method="post" novalidate>
    <div class="govbb-form-group">
      <label class="govbb-label" for="full-name">Full name</label>
      <span class="govbb-error-message" id="full-name-error" role="alert">
        Enter your full name
      </span>
      <input
        class="govbb-input"
        id="full-name"
        name="full-name"
        type="text"
        autocomplete="name"
        aria-invalid="true"
        aria-describedby="full-name-error"
      />
    </div>

    <div class="govbb-button-group">
      <a
        class="govbb-button govbb-button--secondary"
        href="/service/previous-step/"
      >
        Back
      </a>
      <button class="govbb-button" type="submit">Continue</button>
    </div>
  </form>
</main>
```

This is the default shape of a form step: a
[service heading](/components/service-heading/) carrying the question, an error
summary that appears only when validation fails, one answer, then Back and
Continue. One thing per page is easier to answer, easier to validate and easier
to recover from an error - use it unless you have a specific reason to
[group questions](/templates/multiple-questions-page/).

## Should this live in Patterns or Templates?

Both, at different altitudes. The [patterns](/patterns/) say _how_ to ask for a
particular thing - a name, an address, bank details - and what good looks like.
This template is the _page_ those patterns drop into. Reach for the pattern to
decide the question; copy this template to build the page.

## The question and the field label

The question is the page's `<h1>`, inside the service heading. The field keeps
its own label naming the answer: the heading asks "What is your full name?" and
the input is labelled "Full name". Keep the label short - it names the answer,
it does not repeat the question.

For a group of controls answering one question, the fieldset's `<legend>` does
that naming instead, and each control keeps its own label.

## Errors

On a failed submit, show the [error summary](/components/error-summary/) at the
top with `role="alert"`, move focus to it, and link each entry to its field.
Repeat the message next to the field and set `aria-invalid="true"`. Keep
messages specific: "Enter your full name", not "This field is required".

## Back and continue

The two actions sit together in a [button group](/components/button/) after the
last field: Back as a secondary button, Continue as the primary one. Back is a
link styled as a button, pointing at the previous step, so it works without
JavaScript. Use the standalone [back button](/components/back-button/) above the
title on pages with no form to submit.

## Continue, not submit

Label the button "Continue" while the user is moving through questions. Save the
answer, then send them to the next question - or to a
[check answers](/patterns/check-answers/) page at the end.
