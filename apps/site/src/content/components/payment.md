---
title: Payment
description: Use the payment component to walk users through paying a fee and show the outcome.
lede: Walks users through paying a fee, and reports whether it worked.
group: Feedback
---

## Preview

```html title="Payment"
<div class="govbb-payment">
  <div class="govbb-payment__heading">
    <h2 class="govbb-payment__title">Complete your payment</h2>
    <p>
      Check the details below, then continue to payment to finish your
      submission
    </p>
  </div>
  <dl class="govbb-payment__items">
    <div class="govbb-payment__row">
      <dt class="govbb-payment__key">Service:</dt>
      <dd class="govbb-payment__value">Application fee</dd>
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

The Payment component summarises a fee before the user pays it (the service,
unit price, quantity and total), with a button that takes them to the payment
provider, and a note telling them where they are being sent. The itemised
rows are a description list (`<dl>`), so screen readers announce each label
with its value. React apps can use the `Payment` wrapper from
`@govtech-bb/react`.

## Usage

<div class="govbb-usage-guidance">
  <section class="govbb-usage-guidance__item" aria-labelledby="payment-when-to-use">
    <h3 id="payment-when-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--do" aria-hidden="true">✓</span>
      When to use
    </h3>
    <ul>
      <li>Use the payment component when a user is ready to pay a confirmed fee for a service.</li>
      <li>Use the outcome variants only after the payment provider returns a verified result.</li>
    </ul>
  </section>
  <section class="govbb-usage-guidance__item" aria-labelledby="payment-when-not-to-use">
    <h3 id="payment-when-not-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--dont" aria-hidden="true">×</span>
      When not to use
    </h3>
    <ul>
      <li>Do not use it to publish general fee information; use a <a href="/components/table/">table</a> or page content.</li>
      <li>Do not use a payment outcome to represent an application, account or service status.</li>
    </ul>
  </section>
</div>

## Best practices

### Confirm the amount before redirecting

Show the service, quantity where relevant, total amount and currency. Name the
payment provider and explain that the user will leave the service to complete
payment.

### Give a complete outcome

On success, provide a reference, date and next step. On failure, state whether
the user was charged and offer a safe route to try again without creating a
duplicate payment.

Always keep the outcome heading: it is what tells screen reader users the
result, since the green or red styling alone cannot. Show the outcome on a
fresh page whose title and heading state the result. If the outcome must
render on the same page after the provider redirect, move focus to the block
or give it `role="status"` so the result is announced.

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
      <dd class="govbb-payment__value">Application fee</dd>
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
      <dd class="govbb-payment__value">12 December 2026</dd>
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
