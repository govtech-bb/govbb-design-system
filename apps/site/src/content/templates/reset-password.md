---
title: Reset password
description: The page where a user asks for a link to reset their password.
lede: Takes an email address and sends a reset link, without revealing who has an account.
group: Authentication
---

The reset page takes an email address and sends a link. Keep the flow to two
steps: request a link here, then set a new password on the page the link opens.
Like every page of a service, the template keeps the standard
[official banner](/components/official-banner/), [header](/components/header/)
and [footer](/components/footer/).

## Do not reveal who has an account

Show the same confirmation ("If that email address has an account, we have sent
a reset link") whether or not the address exists. Telling the user "no account
found" lets anyone probe which emails are registered.

## The reset link

Make the link single-use and short-lived, and invalidate it once the password
changes. On the page it opens, ask for the new password with
`autocomplete="new-password"` and confirm success before sending the user to
[sign in](/templates/sign-in/).
