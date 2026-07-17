---
title: Page not found (404)
description: The page to show when a URL does not match anything on the service.
lede: Shown when someone follows a broken or mistyped link (HTTP 404).
group: Error pages
---

## Preview

```html title="Page not found"
<main class="govbb-width-container" id="main-content">
  <h1 class="govbb-text-h1">Page not found</h1>
  <p class="govbb-text-body-lg">
    If you typed the web address, check it is correct.
  </p>
  <p class="govbb-text-body">
    If you pasted the web address, check you copied the whole address.
  </p>
  <p class="govbb-text-body">
    If the web address is correct or you selected a link or button,
    <a class="govbb-link" href="#">contact us</a> if you need help.
  </p>
</main>
```

Show this page when a URL does not match anything. Return the `404` status code
so crawlers and monitoring see it as an error, not a normal page. Keep the copy
plain: tell the user what to check and give them a way to get help.

## When to use this page

Use it for any unmatched route. Do not redirect broken links to the homepage -
the user loses the context of what they were trying to reach and cannot tell a
typo from a page that has moved.

## What to include

State that the page was not found, list the things to check, and offer a
contact route. Do not expose stack traces, internal paths or IDs.
