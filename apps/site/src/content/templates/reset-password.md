---
title: Reset password
description: The page where a user asks for a link to reset their password.
lede: Takes an email address and sends a reset link, without revealing who has an account.
group: Authentication
---

## Preview

```html title="Reset your password"
<main class="govbb-width-container" id="main-content">
  <a class="govbb-back-button" href="/account/sign-in/">Back</a>

  <h1 class="govbb-text-h1">Reset your password</h1>
  <p class="govbb-text-body">
    Enter the email address you used to create your account. We will send you a
    link to reset your password.
  </p>

  <form action="/account/reset-password/" method="post" novalidate>
    <div class="govbb-form-group">
      <label class="govbb-label" for="email">Email address</label>
      <input
        class="govbb-input"
        id="email"
        name="email"
        type="email"
        autocomplete="username"
        spellcheck="false"
      />
    </div>

    <button class="govbb-button" type="submit">Send reset link</button>
  </form>
</main>
```

The reset page takes an email address and sends a link. Keep the flow to two
steps: request a link here, then set a new password on the page the link opens.

## Do not reveal who has an account

Show the same confirmation ("If that email address has an account, we have sent
a reset link") whether or not the address exists. Telling the user "no account
found" lets anyone probe which emails are registered.

## The reset link

Make the link single-use and short-lived, and invalidate it once the password
changes. On the page it opens, ask for the new password with
`autocomplete="new-password"` and confirm success before sending the user to
[sign in](/templates/sign-in/).
