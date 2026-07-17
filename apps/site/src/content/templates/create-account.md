---
title: Create an account
description: The page where a new user registers for the service.
lede: Collects the details needed to set up an account.
group: Authentication
---

The create-account page sets up a new user. Ask for the least you need - an
email and a password is usually enough to start. Use `autocomplete="new-password"`
so browsers offer to generate and save a strong password. Like every page of a
service, the template keeps the standard
[official banner](/components/official-banner/), [header](/components/header/)
and [footer](/components/footer/).

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
