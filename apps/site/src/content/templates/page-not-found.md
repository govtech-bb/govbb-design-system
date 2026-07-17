---
title: Page not found (404)
description: The page to show when a URL does not match anything on the service.
lede: Shown when someone follows a broken or mistyped link (HTTP 404).
group: Error pages
---

Show this page when a URL does not match anything, and return the `404` status
code so crawlers and monitoring see it as an error, not a normal page. Lead with
a plain heading, say what may have happened, then give the user concrete ways
forward: a short list of suggestions and buttons to the service directory and
the homepage.

## When to use this page

Use it for any unmatched route. Do not redirect broken links to the homepage -
the user loses the context of what they were trying to reach and cannot tell a
typo from a page that has moved.

## What to include

State that the page was not found, list what to check, and offer routes onward.
Do not expose stack traces, internal paths or IDs. The page keeps the standard
[official banner](/components/official-banner/), [header](/components/header/)
and [footer](/components/footer/) so users still know where they are.
