---
title: Problem with the service (500)
description: The page to show when the service hits an unexpected error.
lede: Shown when something goes wrong that the user cannot fix (HTTP 500).
group: Error pages
---

Show this page for an unhandled server error and return the `500` status code.
Reassure the user it is not their fault, tell them it is being dealt with, and
give them ways forward rather than a dead end.

## When to use this page

Use it for errors the user cannot do anything about - a failed dependency, an
exception, a timeout. For planned downtime use the
[service unavailable](/templates/service-unavailable/) page instead.

## What to include

Say something went wrong, that the team is aware, and offer next steps. Never
show error details, stack traces or internal identifiers.
