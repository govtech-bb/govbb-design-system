---
title: Problem with the service (500)
description: The page to show when the service hits an unexpected error.
lede: Shown when something goes wrong that the user cannot fix (HTTP 500).
group: Error pages
---

## Preview

```html title="Sorry, there is a problem with the service"
<main class="govbb-width-container" id="main-content">
  <h1 class="govbb-text-h1">Sorry, there is a problem with the service</h1>
  <p class="govbb-text-body-lg">Try again later.</p>
  <p class="govbb-text-body">
    We have not saved your answers. When the service is available, you will have
    to start again.
  </p>
  <p class="govbb-text-body">
    <a class="govbb-link" href="#">Contact us</a> if you need help.
  </p>
</main>
```

Show this page for an unhandled server error. Return the `500` status code. Be
honest about whether the user's answers were saved so they know what to expect
when they come back.

## When to use this page

Use it for errors the user cannot do anything about - a failed dependency, an
exception, a timeout. For planned downtime use the
[service unavailable](/templates/service-unavailable/) page instead.

## What to include

Tell the user to try again later, say whether their data was kept, and give a
contact route. Never show error details, stack traces or internal identifiers.
