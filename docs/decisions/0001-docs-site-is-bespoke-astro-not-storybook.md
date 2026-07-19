# 1. The documentation site is a bespoke Astro app, not Storybook

**Date:** 2026-07-02
**Status:** Accepted for the public documentation site — the workshop portion
is amended by [Decision 2](./0002-storybook-is-an-internal-react-workshop.md).

## Context

Issue #4 asked which framework should power the design system site at
`design-system.gov.bb`. #113 answered **Storybook** (`@storybook/web-components-vite`)
and shipped `apps/docs` as the single site, with prose in MDX.

The site we actually want mimics [design-system.service.gov.uk](https://design-system.service.gov.uk/):
distinct top-level sections with their own information architecture, component pages that
show a live preview alongside switchable source code, long-form "how and when to use"
guidance, and a changelog of design decisions. Storybook fights all of these — it gives
one sidebar tree, one renderer per source block, and docs pages that never look like the
target site.

## Decision

The public design-system site is a **bespoke Astro static site** at `apps/site`
(`@govbb/site`), modelled structurally on GOV.UK with GovBB branding.

- **Storybook is not the public documentation stack.** `apps/docs` is removed.
  Decision 2 later introduces a companion React workshop, published below the
  Astro site; it does not replace Astro or revive the `apps/docs` information
  architecture.
- **Component documentation lives in the Astro site** as content pages, using the shared
  [`Example`](../../apps/site/src/components/Example.astro) component: a Preview / Code tab
  switch that renders the component live in an isolated iframe and shows its source. The
  code panel is HTML/CSS today and is structured so a framework switcher (web component /
  React) can be added later without rewriting pages.
- **New components and guidance are added to `apps/site`**, not to any Storybook.

## Consequences

- Retiring Storybook removes its accessibility addon; the a11y-audit epic (#87–#109) needs
  replacement tooling (axe in CI, or manual). Tracked separately.
- The visual design and tokens are placeholders until the real tokens/font ship in
  `@govbb/styles` (#20) and are wired in under follow-up #124.
- Component guidance belongs in Astro. Decision 2 later adopts Storybook as a
  linked interactive development and testing companion.
