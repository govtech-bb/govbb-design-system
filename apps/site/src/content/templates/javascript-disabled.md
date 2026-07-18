---
title: JavaScript disabled
description: The message to show when a feature needs JavaScript and it is off.
lede: Shown when part of the service depends on JavaScript that is not running.
group: Error pages
---

## Preview

```html title="This form needs JavaScript to work properly" page
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
  <h1 class="govbb-text-h1">This form needs JavaScript to work properly</h1>
  <p class="govbb-text-body">
    JavaScript is currently turned off in your browser, or your browser does not
    support it.
  </p>

  <h2 class="govbb-text-h3">Suggestions:</h2>
  <ul class="govbb-list govbb-list--bullet">
    <li>
      Turn on JavaScript in your browser settings. The steps differ by browser,
      but you'll usually find the option under Settings, then Privacy and
      Security, or Site Settings. Once it's on, refresh this page.
    </li>
    <li>
      Try a different browser. Most up-to-date browsers (Chrome, Safari,
      Firefox, Edge) support JavaScript by default.
    </li>
    <li>
      Update your browser. If you're using an older version, updating may
      resolve the issue.
    </li>
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

Build services so they work without JavaScript wherever you can, and reserve
this message for the genuinely JavaScript-only parts. Put it inside `<noscript>`
so it shows exactly when scripts do not run, and hide the JavaScript-only
feature until enhancement succeeds.

## When to use this page

Use it for a feature that cannot work server-side - a live map, a drawing tool,
a client-side upload preview. Do not use it as a blanket gate on the whole
service; most pages should still function.

## What to include

Say plainly what needs JavaScript, how to turn it on, and offer a contact route
so the user is never fully blocked.
