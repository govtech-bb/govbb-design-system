---
title: Forms
description: Structure forms so people can understand, complete and recover from them.
lede: Organize questions, sections, actions and errors into a clear service journey.
group: Build forms
---

Good forms ask only for necessary information, in an order people understand,
and make recovery straightforward when something goes wrong. Start with the
service journey and the user need before choosing controls.

Use the [Form fields foundation](/styles/form-fields/) for the rules inside one
field and the [Form implementation guide](/documentation/form-implementation/)
for submission, state and validation code.

## Preview

```html title="A short, structured form"
<main class="govbb-width-container" id="main-content">
  <a class="govbb-back-button" href="/service/previous-step/">Back</a>
  <form action="/service/contact-details/" method="post" novalidate>
    <h1 class="govbb-text-h1">How can we contact you?</h1>
    <p class="govbb-text-body">
      We will only use these details to update you about your application.
    </p>

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

    <div class="govbb-form-group">
      <label class="govbb-label" for="telephone"
        >Telephone number (optional)</label
      >
      <input
        class="govbb-input"
        id="telephone"
        name="telephone"
        type="tel"
        autocomplete="tel"
      />
    </div>

    <button class="govbb-button" type="submit">Continue</button>
  </form>
</main>
```

## Ask only what the service needs

Remove questions that are not necessary to complete the service, meet a legal
requirement, or provide a clearly explained benefit. Every additional question
increases time, uncertainty and the amount of personal data the service must
protect.

Explain why sensitive or unexpected information is needed at the point of the
question. Do not ask people to provide the same information twice.

## One thing per page

For transactional services, prefer one question or one closely related group
per page. Short pages are easier to understand, validate and recover. They also
let the service branch without hiding large parts of a page.

Put several questions on one page only when people naturally think of them as
one task, such as an address or contact details. Use a clear page heading and
keep the group short.

## Order and organization

Arrange questions in the order people expect to answer them. Begin with simple,
low-effort questions and place dependent questions immediately after the answer
that controls them. Keep required questions before optional follow-up details.

For longer forms:

- split the journey into meaningful steps instead of one long page
- group related controls with a [fieldset](/components/fieldset/)
- use headings for genuine sections, not decoration
- show progress only when it helps people understand where they are
- let people review their answers before final submission

Do not hide required questions in collapsed sections. Avoid accordions for the
main journey because hidden fields and hidden errors are easy to miss.

## Field layout

Align form content to the start edge and use a readable content width. Stack
fields vertically by default so labels and answers follow a predictable scan
line. Match field width to expected content, but keep controls fluid on narrow
screens.

Whitespace should distinguish sections without disconnecting labels, hints,
errors and their controls. Use the system's form groups and
[spacing tokens](/styles/spacing/) instead of manual line breaks or repeated
empty elements.

## Actions

Give each form one primary submission action. Put it after the final field,
aligned with the form content, and use a label that describes the next step:
“Continue”, “Check answers” or “Submit application”.

Use secondary buttons for genuine alternative form operations, such as saving
a draft. Use links for navigation. Put “Cancel” after the primary action in
reading and keyboard order, and warn before any action that discards entered
information.

Prevent accidental double submission, but do not leave the button permanently
disabled if the request fails. Show a clear in-progress state for slow actions.

## Conditional questions

Reveal a follow-up only when an earlier answer makes it relevant. Place it
directly after that answer, announce the change when necessary, and keep the
form usable when JavaScript is unavailable by applying the same rules on the
server.

Decide what happens to a hidden answer. Clear it when it is no longer valid;
preserve it only when returning to the earlier choice should restore the
person's work.

## Errors and recovery

Validate after submission unless earlier feedback clearly prevents wasted
work. When validation fails, render the same page with the answers preserved,
an [error summary](/components/error-summary/) at the top, and an error beside
every affected field.

Move focus to the error summary after a failed submission. Link each summary
item to the relevant control and keep messages in the same order as the fields.
Never clear the form or make people rediscover the step that failed.

## Review and completion

For consequential submissions, provide a
[check answers](/patterns/check-answers/) step. Let people return to a specific
question, change it, and come back to the review without repeating the journey.

After success, show a confirmation page with a reference, what happens next,
and any timeframes. Do not rely on the confirmation page alone when the person
will need the information later.

## Test the complete journey

Test more than the default field state. Cover keyboard use, zoom, autofill,
screen readers, validation errors, server failures, timeouts, back navigation,
duplicate submission and resuming with previously entered answers.
