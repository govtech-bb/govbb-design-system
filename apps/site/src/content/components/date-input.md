---
title: Date Input
description: Use the date input component to let users enter a memorable date.
lede: Lets users enter a memorable date, such as a date of birth.
group: Form elements
---

## Preview

```html title="Date of birth"
<div class="govbb-form-group">
  <fieldset class="govbb-fieldset" role="group" aria-describedby="dob-hint">
    <legend class="govbb-fieldset__legend">Date of birth</legend>
    <p class="govbb-hint" id="dob-hint">For example, 27 3 1990</p>
    <div class="govbb-date-input">
      <div class="govbb-date-input__part">
        <label class="govbb-date-input__label" for="dob-day">Day</label>
        <div class="govbb-date-input-wrapper">
          <input
            class="govbb-date-input__field"
            id="dob-day"
            name="dob[day]"
            type="text"
            inputmode="numeric"
          />
        </div>
      </div>
      <div class="govbb-date-input__part">
        <label class="govbb-date-input__label" for="dob-month">Month</label>
        <div class="govbb-date-input-wrapper">
          <input
            class="govbb-date-input__field"
            id="dob-month"
            name="dob[month]"
            type="text"
            inputmode="numeric"
          />
        </div>
      </div>
      <div class="govbb-date-input__part">
        <label class="govbb-date-input__label" for="dob-year">Year</label>
        <div class="govbb-date-input-wrapper govbb-date-input-wrapper--year">
          <input
            class="govbb-date-input__field"
            id="dob-year"
            name="dob[year]"
            type="text"
            inputmode="numeric"
          />
        </div>
      </div>
    </div>
  </fieldset>
</div>
```

The Date Input component lets users enter a memorable date, such as a date of
birth or a document's expiry date, using three short text fields for day, month,
and year. A shared `<fieldset>` and `<legend>` group the three fields under a
single question.

## When to use this component

Use a date input for dates the user already knows and can recall unassisted —
such as a date of birth, a passport expiry date, or an anniversary. Typing three
short numbers is faster and more reliable than operating a calendar widget for
dates like these.

## When not to use this component

Do not use a date input when the user needs to look up a date rather than recall
it — for example, choosing the next available appointment slot or selecting a date
range. Use a date picker instead, so the user can browse a calendar and see which
dates are available.

## Labels and hint text

Give the fieldset a clear `<legend>` that states the question, such as "Date of
birth", and label each field "Day", "Month", and "Year". Use hint text
(`.govbb-hint`) below the legend to show an example format, such as "For example,
27 3 1990", and link it to the fieldset with `aria-describedby`. Set
`inputmode="numeric"` on each field so mobile keyboards show digits, and do not
require leading zeros — accept both "3" and "03".

## Errors

Validate the whole date together on the server and report a single error message
(`.govbb-error-message`) above the fields with `role="alert"`, rather than one
error per field. Mark every field in the group with `aria-invalid="true"` so
screen reader users understand the whole date is in question, not just one part
of it.

```html title="Date of birth with error"
<div class="govbb-form-group">
  <fieldset
    class="govbb-fieldset"
    role="group"
    aria-describedby="dob2-hint dob2-error"
  >
    <legend class="govbb-fieldset__legend">Date of birth</legend>
    <p class="govbb-hint" id="dob2-hint">For example, 27 3 1990</p>
    <p class="govbb-error-message" id="dob2-error" role="alert">
      Enter a valid date
    </p>
    <div class="govbb-date-input">
      <div class="govbb-date-input__part">
        <label class="govbb-date-input__label" for="dob2-day">Day</label>
        <div class="govbb-date-input-wrapper">
          <input
            class="govbb-date-input__field"
            id="dob2-day"
            name="dob2[day]"
            type="text"
            inputmode="numeric"
            aria-invalid="true"
          />
        </div>
      </div>
      <div class="govbb-date-input__part">
        <label class="govbb-date-input__label" for="dob2-month">Month</label>
        <div class="govbb-date-input-wrapper">
          <input
            class="govbb-date-input__field"
            id="dob2-month"
            name="dob2[month]"
            type="text"
            inputmode="numeric"
            aria-invalid="true"
          />
        </div>
      </div>
      <div class="govbb-date-input__part">
        <label class="govbb-date-input__label" for="dob2-year">Year</label>
        <div class="govbb-date-input-wrapper govbb-date-input-wrapper--year">
          <input
            class="govbb-date-input__field"
            id="dob2-year"
            name="dob2[year]"
            type="text"
            inputmode="numeric"
            aria-invalid="true"
          />
        </div>
      </div>
    </div>
  </fieldset>
</div>
```
