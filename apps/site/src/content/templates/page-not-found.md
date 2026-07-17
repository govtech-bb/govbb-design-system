---
title: Page not found (404)
description: The page to show when a URL does not match anything on the service.
lede: Shown when someone follows a broken or mistyped link (HTTP 404).
group: Error pages
---

## Preview

```html title="Page not found" page
<div class="govbb-official-banner">
  <div class="govbb-width-container govbb-official-banner__inner">
    <div class="govbb-official-banner__crest">
      <img
        class="govbb-official-banner__icon"
        src="/assets/images/govbb-crest.svg"
        alt=""
      />
    </div>
    <div class="govbb-official-banner__text">
      <span>Official government website</span>
      <a class="govbb-official-banner__link" href="#">Learn more</a>
    </div>
  </div>
</div>
<header class="govbb-header">
  <div class="govbb-width-container govbb-header__inner">
    <a href="/">
      <img
        class="govbb-header__logo"
        src="/assets/images/govbb-logo.svg"
        alt="gov.bb"
      />
    </a>
  </div>
</header>
<main class="govbb-width-container govbb-main-wrapper" id="main-content">
  <h1 class="govbb-text-h1">We couldn't find that page</h1>
  <p class="govbb-text-body">
    The page you're looking for may have been moved, removed, or the address may
    have been typed incorrectly.
  </p>

  <h2 class="govbb-text-h3">Suggestions:</h2>
  <ul class="govbb-list govbb-list--bullet">
    <li>Check the web address for typos</li>
    <li>Return to the homepage</li>
    <li>Browse our services directory</li>
  </ul>

  <div class="govbb-button-group">
    <a class="govbb-button govbb-button--secondary" href="#" role="button">
      Browse our services directory
    </a>
    <a class="govbb-button" href="#" role="button">Return to homepage</a>
  </div>
</main>
<footer class="govbb-footer">
  <div class="govbb-width-container govbb-footer__inner">
    <nav class="govbb-footer__nav" aria-label="Footer navigation">
      <a class="govbb-link govbb-footer__link" href="/">Home</a>
      <a class="govbb-link govbb-footer__link" href="/cookies">Cookie policy</a>
      <a class="govbb-link govbb-footer__link" href="/terms">
        Terms &amp; conditions
      </a>
      <a class="govbb-link govbb-footer__link" href="/sitemap">Sitemap</a>
    </nav>
    <hr class="govbb-footer__divider" aria-hidden="true" />
    <div class="govbb-footer__end">
      <img
        class="govbb-footer__coat"
        src="/assets/images/govbb-crest.svg"
        alt=""
      />
      <p class="govbb-footer__copy">© 2026 Government of Barbados</p>
    </div>
  </div>
</footer>
```

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
