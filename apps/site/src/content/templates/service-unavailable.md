---
title: Service unavailable (503)
description: The page to show during planned downtime or maintenance.
lede: Shown when the service is deliberately offline (HTTP 503).
group: Error pages
---

## Preview

```html title="Sorry, the service is unavailable"
<main class="govbb-width-container" id="main-content">
  <h1 class="govbb-text-h1">Sorry, the service is unavailable</h1>
  <p class="govbb-text-body-lg">
    You will be able to use the service from 9am on Monday 21 July.
  </p>
  <p class="govbb-text-body">
    <a class="govbb-link" href="#">Contact us</a> if you need help.
  </p>
</main>
```

Show this page for planned maintenance or a service that is closed for the day.
Return the `503` status code, and add a `Retry-After` header when you know when
the service returns. Give the user a concrete time to come back if you have one.

## When to use this page

Use it for downtime you chose - deployments, overnight batch windows, a service
with opening hours. For an unexpected failure use the
[problem with the service](/templates/problem-with-service/) page instead.

## What to include

Say the service is unavailable and, if known, when it will be back. Offer a
contact route for anyone who cannot wait.
