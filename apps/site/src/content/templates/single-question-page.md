---
title: Single question page
description: The one-thing-per-page form scaffold - back link, error summary, one question, continue.
lede: 'One question per page: the default shape of a form step.'
group: Forms
---

This is the default shape of a form step: a back link, an error summary that
appears only when validation fails, one question, and a continue button. One
thing per page is easier to answer, easier to validate and easier to recover
from an error - use it unless you have a specific reason to
[group questions](/templates/multiple-questions-page/). Like every page of a
service, the template keeps the standard
[official banner](/components/official-banner/), [header](/components/header/)
and [footer](/components/footer/).

## Should this live in Patterns or Templates?

Both, at different altitudes. The [patterns](/patterns/) say _how_ to ask for a
particular thing - a name, an address, bank details - and what good looks like.
This template is the _page_ those patterns drop into. Reach for the pattern to
decide the question; copy this template to build the page.

## The question as the page heading

When a page asks a single question, make the question the `<h1>` and wrap it in
the `<label>` (or a fieldset legend for grouped controls). The heading and the
label are then the same text, so there is nothing to duplicate.

## Errors

On a failed submit, show the [error summary](/components/error-summary/) at the
top with `role="alert"`, move focus to it, and link each entry to its field.
Repeat the message next to the field and set `aria-invalid="true"`. Keep
messages specific: "Enter your full name", not "This field is required".

## Continue, not submit

Label the button "Continue" while the user is moving through questions. Save the
answer, then send them to the next question - or to a
[check answers](/patterns/check-answers/) page at the end.
