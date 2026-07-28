---
title: ID
description: Ask users for an identity document number, such as a National ID, passport or NIS number.
lede: Ask for one identifier at a time and let users switch to another they hold.
group: Ask users for
---

## Preview

```html title="ID number"
<div class="govbb-form-group">
  <label class="govbb-label" for="national-id">
    National Identification (ID) number
  </label>
  <span class="govbb-hint" id="national-id-description">
    This is on your National Registration card. For example, 900314-0052
  </span>
  <input
    class="govbb-input"
    id="national-id"
    name="national-id"
    type="text"
    inputmode="numeric"
    autocomplete="off"
    spellcheck="false"
    aria-describedby="national-id-description"
  />
  <p>
    <a class="govbb-link" href="/service/passport-number/">
      Use passport number instead
    </a>
  </p>
</div>
```

Ask for one identity document at a time. Lead with the identifier most users
will have — usually the National Identification (ID) number — and let people
switch to another document they hold instead.

## When to use this pattern

Use it when a service has to identify someone against an official record. Ask
for the fewest identifiers that will do the job: one is usually enough. These
numbers are sensitive, so do not collect several "to be safe".

## Switching document

Offer a link such as "Use passport number instead" that swaps the field for the
alternative, rather than showing every identifier at once. Services in Barbados
commonly accept the National ID number, passport number, driver's licence
number, National Insurance number (NIS) or TAMIS number — show only the ones
your service actually accepts.

## Format and hint text

The National ID number is written as six date-of-birth digits, a hyphen, then
four more — for example `900314-0052`. Show that example in hint text and point
the user at the card. Accept the number with or without the hyphen and
normalise it on the server.

## Attributes

Set `inputmode="numeric"` for a digit keyboard, `autocomplete="off"` so the
number is not stored in browser autofill, and `spellcheck="false"`. Do not
pre-fill these numbers or echo them back in URLs.

## Errors

Validate on the server: check the length and, for the National ID number, that
the date portion is a real date. Show one error message following the
[form](/components/form/) error guidance, and never include the number itself
in the error text.
