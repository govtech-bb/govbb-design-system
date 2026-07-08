---
title: Payment
description: Use the payment component to walk users through paying a fee and show the outcome.
lede: Walks users through paying a fee, and reports whether it worked.
group: Actions
---

## Preview

```html title="Payment"
<div class="govbb-payment">
  <div class="govbb-payment__heading">
    <h2 class="govbb-payment__title">Complete your payment</h2>
    <p>Please review and complete your payment to finalize your submission</p>
  </div>
  <dl class="govbb-payment__items">
    <div class="govbb-payment__row">
      <dt class="govbb-payment__key">Service:</dt>
      <dd class="govbb-payment__value">Application Fee</dd>
    </div>
    <div class="govbb-payment__row">
      <dt class="govbb-payment__key">Unit price:</dt>
      <dd class="govbb-payment__value">$10</dd>
    </div>
    <div class="govbb-payment__row">
      <dt class="govbb-payment__key">Quantity:</dt>
      <dd class="govbb-payment__value">2</dd>
    </div>
    <div class="govbb-payment__row">
      <dt class="govbb-payment__key">Amount:</dt>
      <dd class="govbb-payment__value">$20</dd>
    </div>
  </dl>
  <button class="govbb-button" type="button">Continue to payment</button>
  <p class="govbb-payment__note">
    You will be redirected to EZ Pay to securely complete your payment.
  </p>
</div>
```

The Payment component summarises a fee before the user pays it — the service,
unit price, quantity and total — with a button that takes them to the payment
provider, and a note telling them where they are being sent. The itemised
rows are a description list (`<dl>`), so screen readers announce each label
with its value.

## When to use this component

Use the payment component at the payment step of a service, once the user has
reviewed their application and the fee is fixed. Keep the note honest about
what happens next — name the payment provider the user will be redirected to.

## When not to use this component

Do not use it to list fees the user is not about to pay — use a table instead.
Do not use the success or failed variants for anything other than the outcome
of a payment — use the status banner for page-level notices.

## Success

Show the **success** variant once the payment provider confirms payment. Give
the user a reference number and date they can keep, and confirm what happens
next (such as a confirmation email).

```html title="Successful payment"
<div class="govbb-payment govbb-payment--success">
  <div class="govbb-payment__heading">
    <h2 class="govbb-payment__title">Your payment was successful</h2>
    <p>
      Your payment has been received. We've sent a confirmation email to the
      address you provided.
    </p>
  </div>
  <dl class="govbb-payment__items">
    <div class="govbb-payment__row">
      <dt class="govbb-payment__key">Service:</dt>
      <dd class="govbb-payment__value">Application Fee</dd>
    </div>
    <div class="govbb-payment__row">
      <dt class="govbb-payment__key">Amount:</dt>
      <dd class="govbb-payment__value">$20</dd>
    </div>
    <div class="govbb-payment__row">
      <dt class="govbb-payment__key">Reference number:</dt>
      <dd class="govbb-payment__value">UIGWB248U42</dd>
    </div>
    <div class="govbb-payment__row">
      <dt class="govbb-payment__key">Date:</dt>
      <dd class="govbb-payment__value">12/12/2026</dd>
    </div>
  </dl>
</div>
```

## Failed

Show the **failed** variant when the payment could not be processed. Reassure
the user about whether they have been charged, and give them a way to try
again.

```html title="Failed payment"
<div class="govbb-payment govbb-payment--failed">
  <div class="govbb-payment__heading">
    <h2 class="govbb-payment__title">
      Unfortunately, your payment was unsuccessful
    </h2>
    <p>Your payment could not be processed. You have not been charged.</p>
  </div>
  <p>
    Try paying again. If the problem continues, check with your bank or try a
    different payment method.
  </p>
  <button class="govbb-button govbb-button--secondary" type="button">
    Try again
  </button>
</div>
```
