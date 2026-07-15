---
title: Address
description: Ask for an address using separate fields for each line, country, parish and postcode.
lede: Ask for an address with a labelled field for each part so it is easy to fill and read back.
group: Ask users for
---

## Preview

```html title="Address"
<div class="govbb-form-group">
  <label class="govbb-label" for="address-line-1">Address line 1</label>
  <input
    class="govbb-input"
    id="address-line-1"
    name="address-line-1"
    type="text"
    autocomplete="address-line1"
  />
</div>

<div class="govbb-form-group">
  <label class="govbb-label" for="address-line-2">Address line 2</label>
  <input
    class="govbb-input"
    id="address-line-2"
    name="address-line-2"
    type="text"
    autocomplete="address-line2"
  />
</div>

<div class="govbb-form-group">
  <label class="govbb-label" for="address-country">Country</label>
  <select class="govbb-select" id="address-country" name="address-country">
    <option value="" disabled selected>Select a country</option>
    <option value="bb" selected>Barbados</option>
  </select>
</div>

<div class="govbb-form-group">
  <label class="govbb-label" for="address-parish">Parish</label>
  <select class="govbb-select" id="address-parish" name="address-parish">
    <option value="" disabled selected>Select a parish</option>
    <option value="christ-church">Christ Church</option>
    <option value="st-andrew">Saint Andrew</option>
    <option value="st-george">Saint George</option>
    <option value="st-james">Saint James</option>
    <option value="st-john">Saint John</option>
    <option value="st-joseph">Saint Joseph</option>
    <option value="st-lucy">Saint Lucy</option>
    <option value="st-michael">Saint Michael</option>
    <option value="st-peter">Saint Peter</option>
    <option value="st-philip">Saint Philip</option>
    <option value="st-thomas">Saint Thomas</option>
  </select>
</div>

<div class="govbb-form-group">
  <label class="govbb-label" for="address-postcode">Postcode</label>
  <input
    class="govbb-input"
    id="address-postcode"
    name="address-postcode"
    type="text"
    autocomplete="postal-code"
  />
</div>
```

Ask for an address with a separate labelled field for each part. Separate
fields are easier to autofill, easier to validate, and read back cleanly on a
[check answers](/patterns/check-answers/) page.

## When to use this pattern

Use it whenever you need a full postal or residential address. If you only need
to know the parish, ask for the parish on its own with a
[select](/components/select/) instead of a whole address.

## Fields to show

Show address line 1, address line 2 and country by default. Reveal the parish
and postcode fields for Barbados addresses. Only require the fields the service
genuinely cannot work without, and label anything else "(optional)" rather than
marking required fields.

## Parish

For a Barbados address, offer the eleven parishes in a [select](/components/select/):
Christ Church, Saint Andrew, Saint George, Saint James, Saint John, Saint
Joseph, Saint Lucy, Saint Michael, Saint Peter, Saint Philip and Saint Thomas.

## Autocomplete

Set the standard `autocomplete` tokens — `address-line1`, `address-line2` and
`postal-code` — so the browser can fill the whole address from one saved
profile. This is the biggest time-saver for the user and costs nothing.

## Errors

Validate on the server and show one error message per field that fails,
following the [form](/components/form/) error guidance.
