---
title: Using the design system
description: How to adopt the design system and the standards every service follows.
lede: How to adopt the design system and the standards every service follows.
---

The design system gives every Government of Barbados service a shared set of
[styles](/styles/), [components](/components/) and [patterns](/patterns/), so
services look and behave consistently and teams do not solve the same problems
twice. Use `@govtech-bb/frontend` for framework-agnostic HTML, or add the thin
`@govtech-bb/react` wrappers when your service is built in React.

## Install for HTML or server-rendered services

```sh
pnpm add @govtech-bb/frontend@alpha
```

Install the `alpha` tag, not the default. Every release so far is a prerelease,
so they all publish under `alpha` and none of them moves `latest`, which still
points at an old build. Check what you resolved with
`npm view @govtech-bb/frontend dist-tags`, and pin the version in
`package.json` so a later install cannot drift.

Import the complete stylesheet once:

```js
import '@govtech-bb/frontend/css';
```

Header, file upload and number input markup use progressive enhancement. Add
the matching `data-govbb-module` attribute shown in the component example and
initialise those modules after the document exists:

```js
import { initAll } from '@govtech-bb/frontend';

initAll();
```

## Install for React services

```sh
pnpm add @govtech-bb/frontend@alpha @govtech-bb/react@alpha
```

The `alpha` tag is not optional for React. `@govtech-bb/react@latest` is a build
of the previous Tailwind and Radix design system, missing `Header`, `SkipLink`,
`SummaryList`, `FormGroup`, `Label`, `Hint`, `Fieldset`, `ButtonGroup` and
`List`. Installing without the tag gives you a different design system, and it
fails as missing exports rather than as an obviously wrong package.

Import the stylesheet once at the application root, then import components from
the React package. React components include their own behaviour, so do not run
`initAll()` over them.

```tsx
import '@govtech-bb/frontend/css';
import { Button } from '@govtech-bb/react';

<Button type="submit">Continue</Button>;
```

## Assets and tokens

Images and fonts ship below `@govtech-bb/frontend/assets/*`. Host the image
assets through your bundler or public directory and pass their resulting URLs
to components such as Header, Footer and OfficialBanner.

Use semantic tokens such as `--govbb-color-brand` and `--govbb-space-s` in
service CSS. Tailwind applications can reference them directly with arbitrary
values such as `bg-[var(--govbb-color-brand)]`; the design-system core does not
require Tailwind.

## Standards

Every official Government of Barbados service should:

- use components where they meet the user need and test them in the complete
  service journey
- meet [WCAG 2.2 AA](https://www.w3.org/TR/WCAG22/) accessibility requirements
- use the GovBB design tokens for colour, typography and spacing

## Guidelines

Guidelines explain _how_ and _when_ to use each part of the system. Where a component has
a choice of variants or states, its page describes when each one is appropriate. See the
[Button](/components/button/) page for an example.

## How this is written

Guidance is written in plain language, in the second person, and describes concrete
situations rather than abstract rules. If the same question keeps coming up, we treat that
as a sign the guidance is unclear and fix it ([see why we don't use FAQs](/changelog/no-faqs/)).

## How accessibility reviews work

Documented HTML and React implementations are reviewed in source for semantic
structure and keyboard behaviour. Automated accessibility checks cover
references with React wrappers.

This is component-level evidence, not a WCAG certificate for a complete
service. Content, validation, integrations and the surrounding journey can
introduce new barriers.

Every service team remains responsible for testing its complete implementation
against WCAG 2.2 AA, including its content, validation and surrounding journey.
Teams can follow dated decisions in the [changelog](/changelog/) or
[report a problem with the guidance](/support/).
