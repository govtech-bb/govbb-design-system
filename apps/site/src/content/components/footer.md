---
title: Footer
description: Use the footer to show site-wide links and the Government of Barbados copyright.
lede: Site-wide links, the coat of arms and the copyright line, at the end of every page.
group: Navigation
---

## Preview

```html title="Footer" full
<footer class="govbb-footer">
  <div class="govbb-width-container govbb-footer__inner">
    <nav class="govbb-footer__nav" aria-label="Footer navigation">
      <a class="govbb-footer__link" href="/">Home</a>
      <a class="govbb-footer__link" href="/cookies">Cookie policy</a>
      <a class="govbb-footer__link" href="/terms">Terms &amp; conditions</a>
      <a class="govbb-footer__link" href="/sitemap">Sitemap</a>
    </nav>
    <hr class="govbb-footer__divider" aria-hidden="true" />
    <div class="govbb-footer__end">
      <img
        class="govbb-footer__coat"
        src="/assets/images/govbb-creast.svg"
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
  coatSrc="/assets/images/govbb-creast.svg"
  copy="© 2026 Government of Barbados"
>
  <FooterLink href="/">Home</FooterLink>
  <FooterLink href="/cookies">Cookie policy</FooterLink>
  <FooterLink href="/terms">Terms &amp; conditions</FooterLink>
  <FooterLink href="/sitemap">Sitemap</FooterLink>
</Footer>;
```

The footer closes every page with the site-wide links users expect to find at
the bottom — policies, terms, sitemap — followed by the coat of arms and the
copyright line. You host the coat-of-arms asset yourself and pass its URL.

## When to use this component

Use the footer on every page of a gov.bb service, and keep its links the same
across pages. Link to the pages users look for at the end of a page: the
homepage, cookie policy, terms and conditions, and sitemap.

## When not to use this component

Do not use the footer as a second navigation menu for service content — keep
it to site-wide housekeeping links. If a link matters to completing the task
on the page, it belongs in the page content, not the footer.
