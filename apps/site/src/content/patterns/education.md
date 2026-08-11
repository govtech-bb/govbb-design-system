---
title: Education
description: Ask about a user's education level, institution and courses studied.
lede: Collect education history, revealing the fields that fit the level of study.
group: Ask users for
---

## Preview

```html title="Education"
<div class="govbb-form-group">
  <fieldset class="govbb-fieldset">
    <legend class="govbb-fieldset__legend">
      What is your education level?
    </legend>
    <div class="govbb-radio-item">
      <input
        class="govbb-radio"
        id="level-primary"
        type="radio"
        name="level"
        value="primary"
      />
      <label class="govbb-radio-item__label" for="level-primary">Primary</label>
    </div>
    <div class="govbb-radio-item">
      <input
        class="govbb-radio"
        id="level-secondary"
        type="radio"
        name="level"
        value="secondary"
      />
      <label class="govbb-radio-item__label" for="level-secondary"
        >Secondary</label
      >
    </div>
    <div class="govbb-radio-item">
      <input
        class="govbb-radio"
        id="level-tertiary"
        type="radio"
        name="level"
        value="tertiary"
      />
      <label class="govbb-radio-item__label" for="level-tertiary"
        >Tertiary</label
      >
    </div>
  </fieldset>
</div>

<div class="govbb-form-group">
  <label class="govbb-label" for="institution">Name of institution</label>
  <input class="govbb-input" id="institution" name="institution" type="text" />
</div>

<div class="govbb-form-group">
  <label class="govbb-label" for="degree">Degree</label>
  <input class="govbb-input" id="degree" name="degree" type="text" />
</div>

<div class="govbb-form-group">
  <label class="govbb-label" for="courses">Courses studied</label>
  <span class="govbb-hint" id="courses-description">
    Separate each course with a comma
  </span>
  <textarea
    class="govbb-textarea"
    id="courses"
    name="courses"
    rows="4"
    aria-describedby="courses-description"
  ></textarea>
</div>

<div class="govbb-form-group">
  <label class="govbb-label" for="start-year">Start year</label>
  <input
    class="govbb-input"
    id="start-year"
    name="start-year"
    type="text"
    inputmode="numeric"
  />
</div>

<div class="govbb-form-group">
  <label class="govbb-label" for="end-year">End year</label>
  <input
    class="govbb-input"
    id="end-year"
    name="end-year"
    type="text"
    inputmode="numeric"
  />
</div>
```

Ask for the user's education level first, then the details of where and what
they studied. Match the fields you show to the level of study.

## When to use this pattern

Use it when a service needs a user's education history — a job application, a
scholarship, a professional registration. Ask only for what the service uses.

## Education level

Ask "What is your education level?" as a [radio](/components/radio/) group
(Primary, Secondary, Tertiary). Use the answer to decide which later fields are
relevant.

## Courses and dates

For a list of courses, use a [textarea](/components/input/) with the hint
"Separate each course with a comma". For the period of study, a start year and
end year field are enough — you rarely need the exact day. Add a "Level reached"
field where a course may be incomplete, with a hint such as "For example,
completed, partially completed, or highest level achieved".

## Optional fields

Where a service needs them, add fields such as name of principal or country of
study, and mark them "(optional)" when they are not required. Do not show
fields the service will not use.

## Errors

Validate on the server and show one error message per field that fails,
following the [form](/components/form/) error guidance.
