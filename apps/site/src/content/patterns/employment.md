---
title: Employment
description: Ask about a user's employment status, employer, role and dates.
lede: Collect employment details, revealing the fields that fit the user's status.
group: Ask users for
---

## Preview

```html title="Employment"
<div class="govbb-form-group">
  <fieldset class="govbb-fieldset">
    <legend class="govbb-fieldset__legend">
      What is your employment status?
    </legend>
    <div class="govbb-radio-item">
      <input
        class="govbb-radio"
        id="status-studying"
        type="radio"
        name="status"
        value="studying"
      />
      <label class="govbb-radio-item__label" for="status-studying"
        >Studying</label
      >
    </div>
    <div class="govbb-radio-item">
      <input
        class="govbb-radio"
        id="status-employed"
        type="radio"
        name="status"
        value="employed"
      />
      <label class="govbb-radio-item__label" for="status-employed"
        >Employed</label
      >
    </div>
    <div class="govbb-radio-item">
      <input
        class="govbb-radio"
        id="status-self-employed"
        type="radio"
        name="status"
        value="self-employed"
      />
      <label class="govbb-radio-item__label" for="status-self-employed"
        >Self-employed</label
      >
    </div>
    <div class="govbb-radio-item">
      <input
        class="govbb-radio"
        id="status-unemployed"
        type="radio"
        name="status"
        value="unemployed"
      />
      <label class="govbb-radio-item__label" for="status-unemployed"
        >Unemployed</label
      >
    </div>
    <div class="govbb-radio-item">
      <input
        class="govbb-radio"
        id="status-other"
        type="radio"
        name="status"
        value="other"
      />
      <label class="govbb-radio-item__label" for="status-other">Other</label>
    </div>
  </fieldset>
</div>

<div class="govbb-form-group">
  <label class="govbb-label" for="employer"
    >Name of employer or organisation</label
  >
  <input class="govbb-input" id="employer" name="employer" type="text" />
</div>

<div class="govbb-form-group">
  <label class="govbb-label" for="occupation">Occupation</label>
  <span class="govbb-hint" id="occupation-description">Your job title</span>
  <input
    class="govbb-input"
    id="occupation"
    name="occupation"
    type="text"
    aria-describedby="occupation-description"
  />
</div>

<div class="govbb-form-group">
  <label class="govbb-label" for="salary">Salary</label>
  <span class="govbb-hint" id="salary-description">
    Enter the amount in Barbados dollars (BBD)
  </span>
  <input
    class="govbb-input"
    id="salary"
    name="salary"
    type="text"
    inputmode="numeric"
    aria-describedby="salary-description"
  />
</div>

<div class="govbb-form-group">
  <label class="govbb-label" for="main-tasks">Your main tasks</label>
  <span class="govbb-hint" id="main-tasks-description">
    Provide a brief description of what you did in your role
  </span>
  <textarea
    class="govbb-textarea"
    id="main-tasks"
    name="main-tasks"
    rows="4"
    aria-describedby="main-tasks-description"
  ></textarea>
</div>
```

Ask about the user's employment status first, then reveal the fields that fit
their answer. Someone who is unemployed should not be asked for an employer or
salary.

## When to use this pattern

Use it when a service needs a user's employment details — an application that
depends on income, occupation or work history. Ask only for what the service
uses to make its decision.

## Employment status

Ask "What is your employment status?" as a [radio](/components/radio/) group
(Studying, Employed, Self-employed, Unemployed, Other) and use the answer to
decide which later fields to show. This keeps the form short for people the
extra questions do not apply to.

## Dates and duration

Where you need the length of a job, ask for a start date and an end date using
the [date input](/components/date-input/) component, and offer an "I am
currently working here" [checkbox](/components/checkbox/) that hides the end
date. For a running count, the [number input](/components/number-input/)
component suits a "years of employment" field.

## Salary

Say what currency and period you want — for example, the annual amount in
Barbados dollars — so people do not guess. Keep `type="text"` with
`inputmode="numeric"` so values are not silently reformatted.

## Errors

Validate on the server and show one error message per field that fails,
following the [form](/components/form/) error guidance.
