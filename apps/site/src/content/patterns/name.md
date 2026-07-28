---
title: Name
description: Ask for a person's name using title, first, middle and last name fields.
lede: Ask for a name using separate fields, and only the parts the service needs.
group: Ask users for
---

## Preview

```html title="Name"
<div class="govbb-form-group">
  <label class="govbb-label" for="title">Title</label>
  <select class="govbb-select" id="title" name="title">
    <option value="" disabled selected>Select a title</option>
    <option value="mr">Mr</option>
    <option value="mrs">Mrs</option>
    <option value="miss">Miss</option>
    <option value="ms">Ms</option>
    <option value="dr">Dr</option>
  </select>
</div>

<div class="govbb-form-group">
  <label class="govbb-label" for="first-name">First name</label>
  <input
    class="govbb-input"
    id="first-name"
    name="first-name"
    type="text"
    autocomplete="given-name"
    spellcheck="false"
  />
</div>

<div class="govbb-form-group">
  <label class="govbb-label" for="middle-name">Middle name(s)</label>
  <span class="govbb-hint" id="middle-name-description">
    If you have more than one, add them in order
  </span>
  <input
    class="govbb-input"
    id="middle-name"
    name="middle-name"
    type="text"
    autocomplete="additional-name"
    spellcheck="false"
    aria-describedby="middle-name-description"
  />
</div>

<div class="govbb-form-group">
  <label class="govbb-label" for="last-name">Last name</label>
  <input
    class="govbb-input"
    id="last-name"
    name="last-name"
    type="text"
    autocomplete="family-name"
    spellcheck="false"
  />
</div>
```

Ask for a name with a separate labelled field for each part: title, first name,
middle name(s) and last name. Show only the parts the service actually needs —
drop the title or middle name if you will not use them.

## When to use this pattern

Use it whenever you need to record or match a person's name, such as on an
application or against an official record. If you only need to greet the user,
a single "Full name" field is enough.

## Fields and hints

Give the middle name field the hint "If you have more than one, add them in
order" so people with several middle names know what to do. Use the title
[select](/components/select/) only when a record needs it — many services do
not.

## Other names

Where a service needs to know about previous or alternative names, add a
"Have you been known by any other name?" [radio](/components/radio/) question
and reveal the extra name fields only when the user answers "Yes". Do not show
fields the user does not need.

## Attributes

Set `autocomplete` to `given-name`, `additional-name` and `family-name` so the
browser can fill saved values, and `spellcheck="false"` so names are not
flagged. Keep validation loose: accept spaces, hyphens, apostrophes and
accented characters.
