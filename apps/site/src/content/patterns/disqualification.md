---
title: Disqualification
description: Ask whether a user has ever been disqualified, and reveal the details when they have.
lede: Ask a yes/no question first, then reveal the disqualification details only when needed.
group: Ask users for
---

## Preview

```html title="Disqualification"
<div class="govbb-form-group">
  <fieldset class="govbb-fieldset">
    <legend class="govbb-fieldset__legend">
      Have you ever been disqualified?
    </legend>
    <div class="govbb-radio-item">
      <input
        class="govbb-radio"
        id="disqualified-yes"
        type="radio"
        name="disqualified"
        value="yes"
      />
      <label class="govbb-radio-item__label" for="disqualified-yes">Yes</label>
    </div>
    <div class="govbb-radio-item">
      <input
        class="govbb-radio"
        id="disqualified-no"
        type="radio"
        name="disqualified"
        value="no"
      />
      <label class="govbb-radio-item__label" for="disqualified-no">No</label>
    </div>
  </fieldset>
</div>

<div class="govbb-form-group">
  <label class="govbb-label" for="court-name">Court name</label>
  <input class="govbb-input" id="court-name" name="court-name" type="text" />
</div>

<div class="govbb-form-group">
  <fieldset class="govbb-fieldset" role="group">
    <legend class="govbb-fieldset__legend">Date of disqualification</legend>
    <div class="govbb-date-input">
      <div class="govbb-date-input__part">
        <label class="govbb-label" for="disq-day">Day</label>
        <input
          class="govbb-input govbb-date-input__field"
          id="disq-day"
          name="disq-date[day]"
          type="text"
          inputmode="numeric"
        />
      </div>
      <div class="govbb-date-input__part">
        <label class="govbb-label" for="disq-month">Month</label>
        <input
          class="govbb-input govbb-date-input__field"
          id="disq-month"
          name="disq-date[month]"
          type="text"
          inputmode="numeric"
        />
      </div>
      <div class="govbb-date-input__part">
        <label class="govbb-label" for="disq-year">Year</label>
        <input
          class="govbb-input govbb-date-input__field govbb-date-input__field--year"
          id="disq-year"
          name="disq-date[year]"
          type="text"
          inputmode="numeric"
        />
      </div>
    </div>
  </fieldset>
</div>

<div class="govbb-form-group">
  <label class="govbb-label" for="disq-length"
    >Length of disqualification</label
  >
  <input class="govbb-input" id="disq-length" name="disq-length" type="text" />
</div>
```

Ask whether the user has ever been disqualified with a yes/no question first,
and only reveal the details — court name, date and length — when they answer
"Yes".

## When to use this pattern

Use it when a service needs to know about a past disqualification, such as a
driving disqualification on a licence application. The same shape suits any
sensitive "have you ever…?" question.

## Reveal on yes

Ask "Have you ever been disqualified?" as a [radio](/components/radio/) group,
then show the follow-up fields only when the answer is "Yes". Keep the wording
plain and neutral so the question does not feel accusatory.

## Disqualification details

Use text fields for the court name and the length, and the
[date input](/components/date-input/) for the date of disqualification. Repeat
the group if a user can have more than one.

## Errors

Validate on the server and show one error message per field that fails,
following the [form](/components/form/) error guidance.
