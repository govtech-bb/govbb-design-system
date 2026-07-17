---
title: Sign in
description: The page where a returning user signs in to the service.
lede: Collects a user's credentials and links to account recovery.
group: Authentication
---

The sign-in page collects a returning user's credentials. Set the right
`autocomplete` values (`username`, `current-password`) so password managers and
browsers fill the fields, and always offer routes to reset a password and to
create an account. Like every page of a service, the template keeps the
standard [official banner](/components/official-banner/),
[header](/components/header/) and [footer](/components/footer/).

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
