---
title: Contact information
description: Ask for the ways a service can contact a user, such as email and phone number.
lede: Ask for an email address and phone number, and only the extra contact methods the service needs.
group: Ask users for
---

## Preview

```html title="Contact information"
<div class="govbb-form-group">
  <label class="govbb-label" for="email">Email address</label>
  <input
    class="govbb-input"
    id="email"
    name="email"
    type="email"
    spellcheck="false"
    autocapitalize="off"
    autocomplete="email"
  />
</div>

<div class="govbb-form-group">
  <label class="govbb-label" for="telephone">Telephone number</label>
  <span class="govbb-hint" id="telephone-description">
    For a Barbados number, include the area code, like 246 123 4567
  </span>
  <input
    class="govbb-input"
    id="telephone"
    name="telephone"
    type="tel"
    autocomplete="tel"
    aria-describedby="telephone-description"
  />
</div>
```

Ask for the ways the service will actually use to contact the user. Email
address and a telephone number cover most services; add mobile, work phone,
home phone or fax only when the service needs to tell them apart.

## When to use this pattern

Use it when the service will contact the user or send a confirmation. Only ask
for a method if you will use it — an unused number or address is data you have
to store and protect for no reason.

## Email address

Ask for the email address in a single field. Do not ask users to type it twice;
confirm it by sending a message to it instead. Set `type="email"` for the right
keyboard and `autocomplete="email"`, and turn off `spellcheck` and
`autocapitalize` so the address is not "corrected".

## Phone numbers

Use one field per number, not separate boxes for area code and number. Set
`type="tel"` for a numeric dial pad and `autocomplete="tel"`. Accept spaces,
brackets, hyphens and a leading `+`, then strip them on the server. Barbados
numbers use the `246` area code; do not reject international numbers the service
can call.

## Errors

Validate on the server and keep it forgiving — check an email contains an `@`
with text either side, and count a phone number's digits rather than matching
one rigid pattern. Show one error message per field, following the
[form](/components/form/) error guidance.
