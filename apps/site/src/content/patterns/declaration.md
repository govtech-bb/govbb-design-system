---
title: Declaration
description: Let users confirm their information is correct before they submit.
lede: Show the name and date, then ask the user to confirm with a single checkbox.
group: Help users to
---

## Preview

```html title="Declaration"
<dl class="govbb-summary-list">
  <div class="govbb-summary-list__row">
    <dt class="govbb-summary-list__key">Applicant's name</dt>
    <dd class="govbb-summary-list__value">Alex Nurse</dd>
  </div>
  <div class="govbb-summary-list__row">
    <dt class="govbb-summary-list__key">Date</dt>
    <dd class="govbb-summary-list__value">15 July 2026</dd>
  </div>
</dl>

<div class="govbb-checkbox-item">
  <input
    class="govbb-checkbox"
    id="declaration"
    type="checkbox"
    name="declaration"
    value="confirmed"
  />
  <label class="govbb-checkbox-item__label" for="declaration">
    I confirm that my information is correct and I am happy for it to be
    verified. I understand that false details may lead to my application being
    rejected, and that the Government of Barbados will keep my information
    confidential.
  </label>
</div>

<button class="govbb-button" type="submit">Accept and send</button>
```

A declaration lets the user formally confirm their information before it is
submitted. Show the name and date the declaration applies to, then a single
[checkbox](/components/checkbox/) the user must tick to agree.

## When to use this pattern

Use it at the end of an application where the user is making a formal statement
that their information is true, and is consenting to it being verified. It
usually sits just before, or on, the [check answers](/patterns/check-answers/)
page.

## Read the details back

Show the applicant's name and the date as read-only rows in a
[summary list](/components/summary-list/), so the user can see exactly what they
are confirming. Fill the date with the day the declaration is made.

## The declaration text

Keep the wording plain and specific: what the user is confirming, what happens
if the information is false, and how their information will be used. Put the
whole statement in the checkbox label so agreeing to it is a single, deliberate
action.

## Errors

Do not let the form submit until the checkbox is ticked. If the user tries to
continue without it, show one error message following the
[form](/components/form/) error guidance, telling them they must confirm to go
on.
