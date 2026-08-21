---
title: Sign in
description: The page where a returning user signs in to the service.
lede: Collects a user's credentials and links to account recovery.
group: Authentication
---

## Preview

```html title="Sign in"
<main class="govbb-width-container govbb-main-wrapper" id="main-content">
  <h1 class="govbb-text-h1">Sign in</h1>

  <form action="/account/sign-in/" method="post" novalidate>
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

    <div class="govbb-form-group">
      <label class="govbb-label" for="password">Password</label>
      <input
        class="govbb-input"
        id="password"
        name="password"
        type="password"
        autocomplete="current-password"
      />
    </div>

    <button class="govbb-button" type="submit">Sign in</button>
  </form>

  <p class="govbb-text-body">
    <a class="govbb-link" href="/account/reset-password/"
      >Reset your password</a
    >
  </p>
  <p class="govbb-text-body">
    <a class="govbb-link" href="/account/create/">Create an account</a>
  </p>
</main>
```

The sign-in page collects a returning user's credentials. Set the right
`autocomplete` values (`username`, `current-password`) so password managers and
browsers fill the fields, and always offer routes to reset a password and to
create an account.

## When to use this page

Use it only when the service genuinely needs an account - to save progress, show
history, or protect personal data. Many services do not: prefer a magic link or
a reference number over forcing account creation.

## Failed sign-in

On a wrong email or password, return a single message that does not reveal which
field was wrong ("The email address or password is not correct"). Show it with
the [error summary](/components/error-summary/) at the top of the form.

## Security

Post credentials over HTTPS, never in the URL. Rate-limit attempts and lock or
delay after repeated failures. Do not disable paste on the password field.
