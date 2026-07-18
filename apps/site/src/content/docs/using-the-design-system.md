---
title: Using the design system
description: How to adopt the design system and the standards every service follows.
lede: How to adopt the design system and the standards every service follows.
---

The design system gives every Government of Barbados service a shared set of
[styles](/styles/), [components](/components/) and [patterns](/patterns/), so
services look and behave consistently and teams do not solve the same problems
twice. Import `@govtech-bb/frontend` for the CSS and tokens, or
`@govtech-bb/react` if your service is built in React.

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
