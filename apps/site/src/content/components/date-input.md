---
title: Date input
description: Use the date input component to let users enter a memorable date.
lede: Lets users enter a memorable date, such as a date of birth.
group: Form elements
---

## Preview

```html title="Date of birth"
<div class="govbb-form-group">
  <fieldset
    class="govbb-fieldset"
    role="group"
    aria-describedby="dob-description"
  >
    <legend class="govbb-fieldset__legend">Date of birth</legend>
    <span class="govbb-hint" id="dob-description">For example, 27 3 1990</span>
    <div class="govbb-date-input">
      <div class="govbb-date-input__part">
        <label class="govbb-label" for="dob-day">Day</label>
        <input
          class="govbb-input govbb-date-input__field"
          id="dob-day"
          name="dob[day]"
          type="text"
          inputmode="numeric"
          autocomplete="bday-day"
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
          autocomplete="bday-month"
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
          autocomplete="bday-year"
        />
      </div>
    </div>
  </fieldset>
</div>
```

```tsx
import { useState } from 'react';
import { DateInput, type DateInputValue } from '@govtech-bb/react';

const [dob, setDob] = useState<DateInputValue>({
  day: '',
  month: '',
  year: '',
});

<DateInput
  legend="Date of birth"
  description="For example, 27 3 1990"
  name="dob"
  value={dob}
  onChange={setDob}
  dayProps={{ autoComplete: 'bday-day' }}
  monthProps={{ autoComplete: 'bday-month' }}
  yearProps={{ autoComplete: 'bday-year' }}
/>;
```

`value` and `onChange` drive the three fields as one `{ day, month, year }`
object, and `name="dob"` names the fields `dob-day`, `dob-month`, `dob-year`.
`formatDateInput` and `parseDateInput` convert the value object to and from an
ISO `YYYY-MM-DD` string when you need one, such as when submitting to an API.

The Date Input component lets users enter a memorable date, such as a date of
birth or a document's expiry date, using three short text fields for day, month,
and year. A shared `<fieldset>` and `<legend>` group the three fields under a
single question.

## Usage

<div class="govbb-usage-guidance">
  <section class="govbb-usage-guidance__item" aria-labelledby="date-input-when-to-use">
    <h3 id="date-input-when-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--do" aria-hidden="true">✓</span>
      When to use
    </h3>
    <ul>
      <li>Use a date input for a date users already know or can look up without a calendar, such as a date of birth or passport expiry date.</li>
      <li>Use separate day, month and year fields when the complete date is required.</li>
    </ul>
  </section>
  <section class="govbb-usage-guidance__item" aria-labelledby="date-input-when-not-to-use">
    <h3 id="date-input-when-not-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--dont" aria-hidden="true">×</span>
      When not to use
    </h3>
    <ul>
      <li>Do not use it when users need to browse available dates, such as booking an appointment; use a date picker.</li>
      <li>Do not use dropdowns for the day or year because long option lists are difficult to scan.</li>
    </ul>
  </section>
</div>

## Best practices

### Make the expected format clear

Label each field and give a Barbados-appropriate example such as “For example,
27 3 1990”. Keep the order day, month, year and do not move focus automatically
between fields.

### Help browsers fill in known dates

When asking for a date the user's browser may already know, set the matching
`autocomplete` tokens — `bday-day`, `bday-month` and `bday-year` for a date of
birth — so the fields can be filled automatically (WCAG 1.3.5). Skip it for
dates the browser cannot know, such as a planned travel date.

### Validate the date as a whole

Accept reasonable month formats, then check that the date exists and meets the
service rules. Explain whether the day, month, year or complete date needs
correction.

## Labels and hint text

Give the fieldset a clear `<legend>` that states the question, such as "Date of
birth", and label each field "Day", "Month", and "Year". Use hint text
(`.govbb-hint`) below the legend to show an example format, such as "For example,
27 3 1990", and link it to the fieldset with `aria-describedby`. Set
`inputmode="numeric"` on each field so mobile keyboards show digits, and do not
require leading zeros: accept both "3" and "03".

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
    aria-describedby="dob2-description dob2-error"
  >
    <legend class="govbb-fieldset__legend">Date of birth</legend>
    <span class="govbb-hint" id="dob2-description">For example, 27 3 1990</span>
    <span class="govbb-error-message" id="dob2-error" role="alert">
      Date of birth must be a real date
    </span>
    <div class="govbb-date-input">
      <div class="govbb-date-input__part">
        <label class="govbb-label" for="dob2-day">Day</label>
        <input
          class="govbb-input govbb-date-input__field"
          id="dob2-day"
          name="dob2[day]"
          type="text"
          inputmode="numeric"
          aria-invalid="true"
        />
      </div>
      <div class="govbb-date-input__part">
        <label class="govbb-label" for="dob2-month">Month</label>
        <input
          class="govbb-input govbb-date-input__field"
          id="dob2-month"
          name="dob2[month]"
          type="text"
          inputmode="numeric"
          aria-invalid="true"
        />
      </div>
      <div class="govbb-date-input__part">
        <label class="govbb-label" for="dob2-year">Year</label>
        <input
          class="govbb-input govbb-date-input__field govbb-date-input__field--year"
          id="dob2-year"
          name="dob2[year]"
          type="text"
          inputmode="numeric"
          aria-invalid="true"
        />
      </div>
    </div>
  </fieldset>
</div>
```

```tsx
import { DateInput } from '@govtech-bb/react';

<DateInput
  legend="Date of birth"
  description="For example, 27 3 1990"
  error="Date of birth must be a real date"
/>;
```
