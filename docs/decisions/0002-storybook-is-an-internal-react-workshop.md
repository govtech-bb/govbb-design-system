# 2. Storybook is a React workshop, not the documentation site

**Date:** 2026-07-19
**Status:** Accepted — amended 2026-07-19 to publish the workshop beside Astro.

## Context

[Decision 1](./0001-docs-site-is-bespoke-astro-not-storybook.md) correctly keeps
the public design-system site in Astro. Its information architecture, long-form
guidance, HTML examples, patterns, and changelog do not fit Storybook's single
component tree.

The repository still benefits from a focused development surface for isolated
component states, interactive controls, browser-based interaction tests, and
fast accessibility feedback. The design system has two consumer targets:
framework-agnostic HTML and React. CSS and stable `govbb-*` markup remain
canonical in `@govtech-bb/frontend`; `@govtech-bb/react` is the primary GovTech
consumer API and a thin wrapper over that contract.

## Decision

Add Storybook as a focused React workshop at the repository root, using the
official React + Vite framework.

- Configuration lives in `.storybook`; stories live in `stories` and use typed
  Component Story Format with autodocs.
- React stories import wrapper source directly for fast development feedback,
  while the preview imports the compiled `@govtech-bb/frontend` stylesheet.
  Storybook scripts build that stylesheet first.
- The official Docs, Accessibility, and Vitest addons are enabled. Accessibility
  violations fail story tests, and interaction states use `play` functions that
  run in Chromium through Vitest browser mode.
- Every exported React component has a typed story, including meaningful error,
  disabled, boundary, responsive, and interaction states. New public wrappers
  must add or update their story in the same change.
- The Astro site remains the public guidance product and source of content
  truth. Its component pages link to matching Storybook autodocs pages beside
  their GitHub source links.
- The site build publishes the static workshop at `/storybook/` on the same
  origin. Storybook is an interactive companion, not a second guidance site.

## Why React rather than HTML

The Astro component pages already render canonical HTML examples in isolated
iframes. A second HTML catalogue would duplicate that surface while leaving the
consumer-facing React props and controlled behaviour less visible.

React Storybook exercises the typed wrapper API, controls, callbacks, and state
transitions while still rendering the same classes and shared CSS. Plain HTML
progressive-enhancement behaviour continues to be covered by frontend unit tests
and the Astro previews.

## Consequences

- Contributors can inspect difficult component states without navigating the
  full documentation site.
- Story `play` functions provide browser-level evidence alongside the existing
  jsdom unit tests and Playwright visual suite.
- Storybook adds development dependencies plus type, browser-test, and
  static-build CI checks, but no runtime production dependency or separate host.
- The Astro production artifact includes Storybook, so component links work in
  previews and production without environment-specific URLs.
- Explanatory prose remains in Astro rather than generated autodocs.
