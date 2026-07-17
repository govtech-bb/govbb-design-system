---
title: Multiple questions page
description: A form page for several closely related questions, like an address.
lede: More than one question on a page - only when the questions are closely related.
group: Forms
---

Put more than one question on a page only when the questions are so closely
related that answering them together makes sense - the lines of an address, the
parts of a name, a set of contact details. When in doubt, use the
[single question page](/templates/single-question-page/) instead. Like every
page of a service, the template keeps the standard
[official banner](/components/official-banner/), [header](/components/header/)
and [footer](/components/footer/).

## The page heading

With several questions there is no single label to double as the `<h1>`, so give
the page its own heading that frames the whole group ("What is your address?").
Each control keeps its own `<label>`. If the questions form one logical answer,
wrap them in a fieldset with the heading as the legend.

## Errors across several fields

The [error summary](/components/error-summary/) lists every failing field in the
order they appear on the page, each linking to its control. Show the specific
message next to each field too, and set `aria-invalid="true"` on the fields that
failed - not the whole group.

## Optional fields

Mark optional fields in the label ("Address line 2 (optional)") rather than
marking every required field. Most fields are required, so flagging the
exceptions is less noise.
