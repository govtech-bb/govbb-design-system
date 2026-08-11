---
title: Bank details
description: Ask for the bank details a service needs to pay money to a user.
lede: Ask for the account holder, bank, account number and the details needed to make a transfer.
group: Ask users for
---

## Preview

```html title="Bank details"
<div class="govbb-form-group">
  <label class="govbb-label" for="bank-country">Bank country</label>
  <select class="govbb-select" id="bank-country" name="bank-country">
    <option value="" disabled selected>Select a country</option>
    <option value="bb" selected>Barbados</option>
  </select>
</div>

<div class="govbb-form-group">
  <label class="govbb-label" for="account-holder">Account holder name</label>
  <span class="govbb-hint" id="account-holder-description">
    Enter the full name shown on the bank account
  </span>
  <input
    class="govbb-input"
    id="account-holder"
    name="account-holder"
    type="text"
    spellcheck="false"
    aria-describedby="account-holder-description"
  />
</div>

<div class="govbb-form-group">
  <label class="govbb-label" for="bank-name">Bank name</label>
  <span class="govbb-hint" id="bank-name-description">
    For example: Republic Bank, Scotiabank, CIBC FirstCaribbean.
  </span>
  <input
    class="govbb-input"
    id="bank-name"
    name="bank-name"
    type="text"
    aria-describedby="bank-name-description"
  />
</div>

<div class="govbb-form-group">
  <label class="govbb-label" for="account-number">Account number</label>
  <span class="govbb-hint" id="account-number-description">
    Enter the account number exactly as it appears on your bank statement
  </span>
  <input
    class="govbb-input"
    id="account-number"
    name="account-number"
    type="text"
    inputmode="numeric"
    aria-describedby="account-number-description"
  />
</div>

<div class="govbb-form-group">
  <label class="govbb-label" for="branch-name">Branch name</label>
  <span class="govbb-hint" id="branch-name-description">
    Enter the branch where the account is held.
  </span>
  <input
    class="govbb-input"
    id="branch-name"
    name="branch-name"
    type="text"
    aria-describedby="branch-name-description"
  />
</div>

<div class="govbb-form-group">
  <label class="govbb-label" for="branch-code">Branch code</label>
  <span class="govbb-hint" id="branch-code-description">
    Enter the bank branch code used for transfers
  </span>
  <input
    class="govbb-input"
    id="branch-code"
    name="branch-code"
    type="text"
    inputmode="numeric"
    aria-describedby="branch-code-description"
  />
</div>

<div class="govbb-form-group">
  <fieldset class="govbb-fieldset">
    <legend class="govbb-fieldset__legend">Account type</legend>
    <div class="govbb-radio-item">
      <input
        class="govbb-radio"
        id="account-type-savings"
        type="radio"
        name="account-type"
        value="savings"
      />
      <label class="govbb-radio-item__label" for="account-type-savings">
        Savings
      </label>
    </div>
    <div class="govbb-radio-item">
      <input
        class="govbb-radio"
        id="account-type-chequing"
        type="radio"
        name="account-type"
        value="chequing"
      />
      <label class="govbb-radio-item__label" for="account-type-chequing">
        Chequing
      </label>
    </div>
  </fieldset>
</div>

<div class="govbb-form-group">
  <label class="govbb-label" for="swift">SWIFT/BIC code</label>
  <span class="govbb-hint" id="swift-description">
    For example: RBTTBB2X, BOFAUS3N.
  </span>
  <input
    class="govbb-input"
    id="swift"
    name="swift"
    type="text"
    autocapitalize="characters"
    spellcheck="false"
    aria-describedby="swift-description"
  />
</div>

<div class="govbb-form-group">
  <label class="govbb-label" for="beneficiary-address">
    Beneficiary address
  </label>
  <textarea
    class="govbb-textarea"
    id="beneficiary-address"
    name="beneficiary-address"
    rows="4"
  ></textarea>
</div>
```

Only ask for bank details when the service needs to pay the user. Ask for each
detail in its own labelled field, with hint text that tells the user where to
find the number.

## When to use this pattern

Use it when the service pays money to the user — a grant, a refund, a benefit.
If the user is paying the service, take the payment through a compliant payment
provider instead of collecting card numbers yourself.

## Fields to ask for

Ask for the account holder name, bank name, account number, and the details
needed to make the transfer. Show only what the destination bank requires. For
a local transfer within Barbados, the branch name, branch code and account type
are usually enough; for an international transfer, ask for the SWIFT/BIC code
and beneficiary address as well.

## Hint text

Point users at where each value appears — the bank statement, a cheque, or the
bank's website. Give real examples: banks such as "Republic Bank, Scotiabank,
CIBC FirstCaribbean" and SWIFT codes such as "RBTTBB2X, BOFAUS3N".

## Input types

Use `inputmode="numeric"` on the number fields for a digit keyboard, but keep
`type="text"` so leading zeros are preserved and validation stays on the
server. Uppercase the SWIFT/BIC code with `autocapitalize="characters"`.

## Errors

Validate on the server and, where possible, check the account number and branch
code together before confirming. Show one error message per field that fails,
following the [form](/components/form/) error guidance.
