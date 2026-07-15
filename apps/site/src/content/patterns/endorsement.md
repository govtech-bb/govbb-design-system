---
title: Endorsement
description: Ask whether a user has a licence endorsement, and reveal the details when they do.
lede: Ask a yes/no question first, then reveal the endorsement details only when needed.
group: Ask users for
---

## Preview

```html title="Endorsement"
<fieldset class="govbb-fieldset">
  <legend class="govbb-fieldset__legend">Do you have any endorsements?</legend>
  <div class="govbb-radio-item">
    <input
      class="govbb-radio"
      id="endorsement-yes"
      type="radio"
      name="endorsement"
      value="yes"
    />
    <label class="govbb-radio-item__label" for="endorsement-yes">Yes</label>
  </div>
  <div class="govbb-radio-item">
    <input
      class="govbb-radio"
      id="endorsement-no"
      type="radio"
      name="endorsement"
      value="no"
    />
    <label class="govbb-radio-item__label" for="endorsement-no">No</label>
  </div>
</fieldset>

<div class="govbb-form-group">
  <label class="govbb-label" for="licence-type">Type of licence</label>
  <select class="govbb-select" id="licence-type" name="licence-type">
    <option value="" disabled selected>Select a licence type</option>
    <option value="private">Private motor car</option>
    <option value="commercial">Commercial</option>
    <option value="motorcycle">Motorcycle</option>
  </select>
</div>

<div class="govbb-form-group">
  <fieldset class="govbb-fieldset" role="group">
    <legend class="govbb-fieldset__legend">Date of endorsement</legend>
    <div class="govbb-date-input">
      <div class="govbb-date-input__part">
        <label class="govbb-label" for="endorsement-day">Day</label>
        <input
          class="govbb-input govbb-date-input__field"
          id="endorsement-day"
          name="endorsement-date[day]"
          type="text"
          inputmode="numeric"
        />
      </div>
      <div class="govbb-date-input__part">
        <label class="govbb-label" for="endorsement-month">Month</label>
        <input
          class="govbb-input govbb-date-input__field"
          id="endorsement-month"
          name="endorsement-date[month]"
          type="text"
          inputmode="numeric"
        />
      </div>
      <div class="govbb-date-input__part">
        <label class="govbb-label" for="endorsement-year">Year</label>
        <input
          class="govbb-input govbb-date-input__field govbb-date-input__field--year"
          id="endorsement-year"
          name="endorsement-date[year]"
          type="text"
          inputmode="numeric"
        />
      </div>
    </div>
  </fieldset>
</div>

<div class="govbb-form-group">
  <label class="govbb-label" for="duration">Duration</label>
  <input class="govbb-input" id="duration" name="duration" type="text" />
</div>
```

Ask whether the user has an endorsement with a yes/no question first, and only
reveal the details — type of licence, date and duration — when they answer
"Yes". Most people will answer "No" and can move straight on.

## When to use this pattern

Use it when a service needs to know about endorsements on a driving licence or
similar record. The same shape works for any "do you have any X?" question that
opens up follow-up fields.

## Reveal on yes

Ask "Do you have any endorsements?" as a [radio](/components/radio/) group, then
show the endorsement fields only when the answer is "Yes". This keeps the form
short and avoids asking most people for details that do not apply to them.

## Endorsement details

Use a [select](/components/select/) for the type of licence, the
[date input](/components/date-input/) for the date of endorsement, and a text
field for how long it lasts. Repeat the group if a user can have more than one
endorsement.

## Errors

Validate on the server and show one error message per field that fails,
following the [form](/components/form/) error guidance.
