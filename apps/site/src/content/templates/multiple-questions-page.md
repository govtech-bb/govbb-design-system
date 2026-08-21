---
title: Multiple questions page
description: A form page for several closely related questions, like an address.
lede: More than one question on a page - only when the questions are closely related.
group: Forms
---

## Preview

```html title="Multiple questions page"
<main class="govbb-width-container govbb-main-wrapper" id="main-content">
  <div class="govbb-service-heading">
    <p class="govbb-service-heading__service">Redirect my business</p>
    <h1 class="govbb-text-h1">What is your address?</h1>
  </div>

  <form action="/service/address/" method="post" novalidate>
    <div class="govbb-form-group">
      <label class="govbb-label" for="address-line-1">Address line 1</label>
      <input
        class="govbb-input"
        id="address-line-1"
        name="address-line-1"
        type="text"
        autocomplete="address-line1"
      />
    </div>

    <div class="govbb-form-group">
      <label class="govbb-label" for="address-line-2">
        Address line 2 <span class="govbb-label__optional">(optional)</span>
      </label>
      <input
        class="govbb-input"
        id="address-line-2"
        name="address-line-2"
        type="text"
        autocomplete="address-line2"
      />
    </div>

    <div class="govbb-form-group">
      <label class="govbb-label" for="town">Town or city</label>
      <input
        class="govbb-input"
        id="town"
        name="town"
        type="text"
        autocomplete="address-level2"
      />
    </div>

    <div class="govbb-form-group">
      <label class="govbb-label" for="parish">Parish</label>
      <input
        class="govbb-input"
        id="parish"
        name="parish"
        type="text"
        autocomplete="address-level1"
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

Put more than one question on a page only when the questions are so closely
related that answering them together makes sense - the lines of an address, the
parts of a name, a set of contact details. When in doubt, use the
[single question page](/templates/single-question-page/) instead.

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

Mark optional fields with the muted `govbb-label__optional` suffix inside the
label - or `optional` on the React `Label`, which self-composing fields derive
from `required={false}`. Do not mark every required field: most fields are
required, so flagging the exceptions is less noise. See
[Label](/components/label/).
