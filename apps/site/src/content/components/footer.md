---
title: Footer
description: Use the footer to show supporting links and the coat of arms at the end of every page.
lede: The dark blue band at the end of every page.
group: Page furniture
---

## Preview

```html title="Footer"
<footer class="govbb-footer" style="width: 100%">
  <div class="govbb-width-container govbb-footer__inner">
    <nav class="govbb-footer__nav" aria-label="Footer navigation">
      <a class="govbb-link govbb-footer__link" href="/">Home</a>
      <a class="govbb-link govbb-footer__link" href="/cookies">Cookie policy</a>
      <a class="govbb-link govbb-footer__link" href="/terms"
        >Terms &amp; conditions</a
      >
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

```tsx
import { Footer, FooterLink } from '@govtech-bb/react';

<Footer
  coatSrc="/assets/images/govbb-crest.svg"
  copy="© 2026 Government of Barbados"
>
  <FooterLink href="/">Home</FooterLink>
  <FooterLink href="/cookies">Cookie policy</FooterLink>
  <FooterLink href="/terms">Terms &amp; conditions</FooterLink>
  <FooterLink href="/sitemap">Sitemap</FooterLink>
</Footer>;
```

The Footer ends every page with supporting links, the coat of arms and a
copyright line. On small screens the links stack above a divider; from tablet
width the links and the coat of arms sit in two columns. The coat of arms image
ships in the `@govtech-bb/frontend` package under `assets/images/`. Host it
with your service and point `src` at your copy.

## Usage

<div class="govbb-usage-guidance">
  <section class="govbb-usage-guidance__item" aria-labelledby="footer-when-to-use">
    <h3 id="footer-when-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--do" aria-hidden="true">✓</span>
      When to use
    </h3>
    <ul>
      <li>Use the footer at the end of every page in a gov.bb website or service.</li>
      <li>Use it for a small, consistent set of utility, contact and legal links.</li>
    </ul>
  </section>
  <section class="govbb-usage-guidance__item" aria-labelledby="footer-when-not-to-use">
    <h3 id="footer-when-not-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--dont" aria-hidden="true">×</span>
      When not to use
    </h3>
    <ul>
      <li>Do not place information users need to complete the current task only in the footer.</li>
      <li>Do not duplicate the entire header navigation or turn the footer into a directory of every page.</li>
    </ul>
  </section>
</div>

## Best practices

### Curate links around remaining user needs

Include destinations such as contact, accessibility, privacy and terms when
they are relevant. Keep labels short and remove stale or rarely useful links.

### Keep the footer consistent

Use the same ordering and content throughout a service. Mark footer navigation
with a clear accessible label and make phone numbers and email addresses usable
as links.

## Footer links

Keep the list of links short. Link to policy and support pages that apply to
the whole site, such as the cookie policy, terms and conditions, and the
sitemap, not to individual services or campaigns.
