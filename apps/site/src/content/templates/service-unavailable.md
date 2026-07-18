---
title: Service unavailable (503)
description: The page to show during planned downtime or maintenance.
lede: Shown when the service is deliberately offline (HTTP 503).
group: Error pages
---

## Preview

```html title="This service is temporarily unavailable" page
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
      <a
        class="govbb-official-banner__link"
        href="/government/website-information/"
      >
        Learn more
      </a>
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
  <h1 class="govbb-text-h1">This service is temporarily unavailable</h1>
  <p class="govbb-text-body">
    We're performing scheduled maintenance or experiencing unusually high
    traffic. This service should be back soon.
  </p>

  <h2 class="govbb-text-h3">Suggestions:</h2>
  <ul class="govbb-list govbb-list--bullet">
    <li>Try again in a few minutes</li>
    <li>Return to the homepage to access other services</li>
    <li>Contact us for urgent enquiries</li>
  </ul>

  <div class="govbb-button-group">
    <a class="govbb-button govbb-button--secondary" href="/contact/"
      >Contact us</a
    >
    <a class="govbb-button" href="/">Return to homepage</a>
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
