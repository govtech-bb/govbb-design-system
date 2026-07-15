---
title: Personal information
description: Ask for a person's date of birth, place of birth, nationality, sex and marital status.
lede: Collect core personal details, asking only for the ones the service needs.
group: Ask users for
---

## Preview

```html title="Personal information"
<div class="govbb-form-group">
  <fieldset class="govbb-fieldset" role="group" aria-describedby="dob-hint">
    <legend class="govbb-fieldset__legend">Date of birth</legend>
    <span class="govbb-hint" id="dob-hint">For example, 30 December 1986</span>
    <div class="govbb-date-input">
      <div class="govbb-date-input__part">
        <label class="govbb-label" for="dob-day">Day</label>
        <input
          class="govbb-input govbb-date-input__field"
          id="dob-day"
          name="dob[day]"
          type="text"
          inputmode="numeric"
        />
      </div>
      <div class="govbb-date-input__part">
        <label class="govbb-label" for="dob-month">Month</label>
        <input
          class="govbb-input govbb-date-input__field"
          id="dob-month"
          name="dob[month]"
          type="text"
          inputmode="numeric"
        />
      </div>
      <div class="govbb-date-input__part">
        <label class="govbb-label" for="dob-year">Year</label>
        <input
          class="govbb-input govbb-date-input__field govbb-date-input__field--year"
          id="dob-year"
          name="dob[year]"
          type="text"
          inputmode="numeric"
        />
      </div>
    </div>
  </fieldset>
</div>

<div class="govbb-form-group">
  <label class="govbb-label" for="place-of-birth">Place of birth</label>
  <input
    class="govbb-input"
    id="place-of-birth"
    name="place-of-birth"
    type="text"
  />
</div>

<div class="govbb-form-group">
  <label class="govbb-label" for="nationality">Nationality</label>
  <select class="govbb-select" id="nationality" name="nationality">
    <option value="" disabled selected>Select a nationality</option>
    <option value="bb">Barbadian</option>
  </select>
</div>

<fieldset class="govbb-fieldset">
  <legend class="govbb-fieldset__legend">Sex</legend>
  <div class="govbb-radio-item">
    <input
      class="govbb-radio"
      id="sex-female"
      type="radio"
      name="sex"
      value="female"
    />
    <label class="govbb-radio-item__label" for="sex-female">Female</label>
  </div>
  <div class="govbb-radio-item">
    <input
      class="govbb-radio"
      id="sex-male"
      type="radio"
      name="sex"
      value="male"
    />
    <label class="govbb-radio-item__label" for="sex-male">Male</label>
  </div>
</fieldset>

<div class="govbb-form-group">
  <label class="govbb-label" for="marital-status">Marital status</label>
  <select class="govbb-select" id="marital-status" name="marital-status">
    <option value="" disabled selected>Select a marital status</option>
    <option value="single">Single</option>
    <option value="married">Married</option>
    <option value="divorced">Divorced</option>
    <option value="widowed">Widowed</option>
  </select>
</div>
```

Ask for the core personal details a service needs to identify or assess someone:
date of birth, place of birth, nationality, sex and marital status. Ask only
for the details the service will use.

## When to use this pattern

Use it when a service needs demographic details to process an application or
match a person to a record. Do not collect a field "just in case" — each one is
personal data you have to store and protect.

## Date of birth

Ask for the date of birth with three day, month and year fields using the
[date input](/components/date-input/) component, and show an example format in
hint text, such as "For example, 30 December 1986". Do not require leading
zeros.

## Sex, nationality and marital status

Use [radios](/components/radio/) for sex and [selects](/components/select/) for
nationality and marital status. Only ask about sex if the service genuinely
needs it, and be clear why you are asking.

## Errors

Validate the date of birth as a whole on the server and show a single error
message above the fields. Show one error message per other field that fails,
following the [form](/components/form/) error guidance.
