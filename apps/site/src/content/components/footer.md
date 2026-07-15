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

## When to use this component

Use the footer at the end of every page of a gov.bb service. Keep the same set
of links across the whole service so users can find them wherever they are.

## When not to use this component

Do not use the footer for content users need to complete their task. Put that
in the body of the page. Do not use it for primary navigation.

## Footer links

Keep the list of links short. Link to policy and support pages that apply to
the whole site, such as the cookie policy, terms and conditions, and the
sitemap, not to individual services or campaigns.
