# Scaffold the bespoke design-system.gov.bb Astro site (#123)

**Date:** 2026-07-02
**Branch:** `worktree-feat+123-scaffold-astro-site` → merges into `main`
**Issue:** [#123](https://github.com/govtech-bb/govbb-design-system/issues/123) (sub-issue of #4)

## What shipped

A bespoke [Astro](https://astro.build) static site at `apps/site` (`@govbb/site`), and the
removal of the Storybook site (`apps/docs`). The site is modelled on the "New New Alpha"
Figma design — GOV.UK structure with GovBB branding.

- **Global chrome:** official-government banner, white navbar (brand + section nav +
  Search), deep-navy footer with the Barbados coat of arms and copyright.
- **Sections:** Components, Documentation, AI skills, Changelog.
  - **Components** — sidebar + article layout; a worked **Button** page with the
    `Example` component (Preview / Code tabs) and an "On this page" rail.
  - **Documentation** — colored foundations card grid + one example guidelines page
    (sidebar + on-this-page).
  - **AI skills** — intentional empty state.
  - **Changelog** — content collection; the "no FAQs" decision post; latest entries
    also surface in the homepage "What's new" block.
- **Homepage:** hero + CTAs, "Explore the design system" card band, "What's new" +
  "Community"/email-signup.

## Why it looks this way

**Bespoke Astro, not Storybook.** The full reasoning and the supersession of #113 are
recorded in [ADR 0001](../decisions/0001-docs-site-is-bespoke-astro-not-storybook.md).
Short version: the target design (design-system.service.gov.uk) needs multi-section IA, a
live-preview-plus-switchable-code pattern, and long-form guidance that Storybook can't
deliver. Plain Astro (not Starlight) was chosen so the layout is fully ours.

**The `Example` component.** Renders the example markup live inside a **srcdoc iframe** so
its CSS is isolated from the page chrome (the same approach GOV.UK uses), with a Preview /
Code tab switch. Examples are authored as real `.html` files imported `?raw`, so the
rendered preview and the shown source are guaranteed identical. The code panel is HTML/CSS
only for now, but the tab structure is deliberately generic so a web-component / React
switcher drops in later without touching pages — matching the scope decided in planning.

**Two-phase build in one session.** The site was first scaffolded with a plain baseline,
then — on request — reshaped to match the Figma. During the reshape the user chose to keep
our agreed sections (Components / Documentation / AI skills / Changelog) rather than adopt
the Figma's literal nav (Get started / Styles / Patterns / Community / Accessibility), and
to apply the Figma *visual* design on top. Tokens, colours and type were transcribed from
the Figma into the placeholder token file.

**Placeholders, clearly marked.** Design tokens (`placeholder-tokens.css`), the Button CSS,
the **Figtree** font (bundled via `@fontsource-variable/figtree`), and the coat of arms /
crest are all temporary stand-ins. The real tokens and font arrive with `@govbb/styles`
(#20) and get wired in under follow-up **#124**.

## Scope decisions

- **Storybook removed and deferred concerns noted.** `apps/docs` deleted; root scripts
  renamed `docs:*` → `site:*`. Retiring Storybook drops its a11y addon — the audit epic
  (#87–#109) needs replacement tooling.
- **#20 reconciliation.** Its `packages/styles` (vanilla CSS + tokens + Figtree) is still
  needed; its proposed `apps/components` Storybook workshop is replaced by component pages
  on this site.
- **Dead chrome links left as-is.** The footer (`/cookies/`, `/terms/`, `/sitemap/`) and
  navbar Search (`/search/`) come from the Figma and currently 404 — kept for design
  fidelity; real pages come later. (User decision.)
- **CI/deploy deferred to #15; DNS/hosting to #4.**

## Verification

`astro build` (8 pages) and `astro check` (0 errors; remaining hints are the upstream Zod
`z`-deprecation) both pass. Driven in a headless browser — the home and Button pages were
screenshot-compared to the Figma frames and match (chrome, hero, colored cards, What's
new/Community, navy footer, sidebar with active state, Preview/Code tabs with the three
button variants, on-this-page rail). One bug was caught and fixed mid-verification: the
homepage CTA/Subscribe buttons were unstyled because `button.css` was only injected into
the preview iframe — now imported globally too.

## Follow-ups

- **#124** — wire `apps/site` onto real `packages/styles` (tokens + Figtree + Button);
  drop the placeholder baseline, font and coat-of-arms stand-in.
- **#20** — reconcile as above.
- **#15** — add the site build check (`pnpm --filter @govbb/site build`) to CI.
- **#4** — hosting + DNS cutover for `design-system.gov.bb`.
- **#87–#109** — replacement a11y tooling now that Storybook's addon is gone.
- Real pages for the footer/search links; more components and guidance content.
