---
title: Create an account
description: The page where a new user registers for the service.
lede: Collects the details needed to set up an account.
group: Authentication
---

## Preview

```html title="Create an account"
<main class="govbb-width-container" id="main-content">
  <h1 class="govbb-text-h1">Create an account</h1>

  <form action="/account/create/" method="post" novalidate>
    <div class="govbb-form-group">
      <label class="govbb-label" for="email">Email address</label>
      <span class="govbb-hint" id="email-hint">
        We will send a confirmation link to this address
      </span>
      <input
        class="govbb-input"
        id="email"
        name="email"
        type="email"
        autocomplete="username"
        aria-describedby="email-hint"
        spellcheck="false"
      />
    </div>

    <div class="govbb-form-group">
      <label class="govbb-label" for="password">Create a password</label>
      <span class="govbb-hint" id="password-hint">
        Use at least 12 characters
      </span>
      <input
        class="govbb-input"
        id="password"
        name="password"
        type="password"
        autocomplete="new-password"
        aria-describedby="password-hint"
      />
    </div>

    <button class="govbb-button" type="submit">Create account</button>
  </form>

  <p class="govbb-text-body">
    Already have an account?
    <a class="govbb-link" href="/account/sign-in/">Sign in</a>
  </p>
</main>
```

The create-account page sets up a new user. Ask for the least you need - an
email and a password is usually enough to start. Use `autocomplete="new-password"`
so browsers offer to generate and save a strong password.

## When to use this page

Only when the service needs a persistent account. If you just need to reach the
user once, take an email or phone number at the point you need it instead.

## Password rules

Set a minimum length rather than complex composition rules, and state the rule
up front in hint text. Validate on submit and report failures through the
[error summary](/components/error-summary/); do not silently reject.

## Confirming the email

Send a confirmation link and tell the user to check their inbox. Do not block
their progress on it unless the service truly requires a verified address.
