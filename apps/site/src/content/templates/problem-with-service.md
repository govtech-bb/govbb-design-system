---
title: Problem with the service (500)
description: The page to show when the service hits an unexpected error.
lede: Shown when something goes wrong that the user cannot fix (HTTP 500).
group: Error pages
---

## Preview

```html title="Something went wrong on our end" page
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
  <h1 class="govbb-text-h1">Something went wrong on our end</h1>
  <p class="govbb-text-body">
    We're experiencing a technical problem. This isn't your fault.
  </p>
  <p class="govbb-text-body">
    Our team has been notified and is working to fix it.
  </p>

  <h2 class="govbb-text-h3">Suggestions:</h2>
  <ul class="govbb-list govbb-list--bullet">
    <li>Refresh the page and try again</li>
    <li>Return to the homepage</li>
    <li>Try again in a few minutes</li>
    <li>Contact us if the problem continues</li>
  </ul>

  <div class="govbb-button-group">
    <a class="govbb-button govbb-button--secondary" href="#" role="button">
      Contact us
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
