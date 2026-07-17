---
title: Service unavailable (503)
description: The page to show during planned downtime or maintenance.
lede: Shown when the service is deliberately offline (HTTP 503).
group: Error pages
---

Show this page for planned maintenance or a service that is temporarily over
capacity. Return the `503` status code, and add a `Retry-After` header when you
know when the service returns. If you have a concrete return time, say it.

## When to use this page

Use it for downtime you expect to recover from - maintenance windows, overnight
batches, a spike in traffic. For an unexpected failure use the
[problem with the service](/templates/problem-with-service/) page instead.

## What to include

Say the service is temporarily unavailable, give a sense of when it will be
back, and point users to other services and a contact route.
