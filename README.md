# GovBB Design System

The design system for official Government of Barbados websites — components,
design tokens, and the documentation site published at **design-system.gov.bb**.

This is a [pnpm](https://pnpm.io) monorepo:

- `apps/*` — applications, including the documentation site (`apps/site`).
- `packages/*` — publishable packages (component library, tokens — coming soon).

## Prerequisites

- **Node** — see [`.nvmrc`](.nvmrc) (`nvm use` to match).
- **pnpm** — pinned via the `packageManager` field; run `corepack enable` to use it.

```sh
corepack enable
pnpm install
```

## Documentation site

The docs site lives in [`apps/site`](apps/site) and is a bespoke
[Astro](https://astro.build) static site, modelled on the structure of the
[GOV.UK Design System](https://design-system.service.gov.uk/) with GovBB branding.
It has three sections — **Components**, **Documentation**, and **AI skills** — plus
a **Changelog** of important design decisions.

### Run locally

```sh
pnpm site:dev      # from the repo root
# or: pnpm --filter @govbb/site dev
```

Opens the site at http://localhost:4321.

### Build

```sh
pnpm site:build    # from the repo root
# or: pnpm --filter @govbb/site build
```

Produces static output in `apps/site/dist/`.

### Contributing to the docs

- **Guidelines / standards prose** — add an `.astro` or `.mdx` page under
  `apps/site/src/pages/documentation/`, and link it from
  `documentation/index.astro`.
- **Component reference** — add a page under `apps/site/src/pages/components/`
  using [`ArticleLayout`](apps/site/src/layouts/ArticleLayout.astro) (left
  sidebar + "On this page" rail), and add it to the sidebar in
  [`src/data/nav.ts`](apps/site/src/data/nav.ts). Author each example's markup
  under `apps/site/src/examples/<component>/` and render it with the shared
  [`Example`](apps/site/src/components/Example.astro) component — a **Preview /
  Code** tab switch showing the live preview plus the HTML/CSS source with a copy
  button. (A framework switcher for web-component / React source is planned but
  not built yet — the code panel is HTML/CSS only for now.)
- **Changelog** — add a Markdown file under `apps/site/src/content/changelog/`
  with `title`, `date`, and optional `author` / `summary` frontmatter. The latest
  entries also surface in the homepage "What's new" block.
- **Styling** — the site is modelled on the "New New Alpha" Figma design. Pages
  and components use **placeholder** GovBB tokens in
  `apps/site/src/styles/placeholder-tokens.css`, the **Figtree** web font
  (bundled temporarily via `@fontsource-variable/figtree`), and a placeholder
  coat of arms (`src/assets/coat-of-arms.png`) / crest. These are clearly-marked
  stand-ins; the real tokens and font ship in `@govbb/styles` and get wired in
  once #20 lands (follow-up #124).

### CI & deployment

CI (the PR build check) and the production deploy for the docs site are set up as
part of the development-tooling epic (#15), not here. Production DNS cutover for
`design-system.gov.bb` is tracked under #4.
