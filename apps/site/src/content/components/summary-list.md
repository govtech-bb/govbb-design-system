---
title: Summary list
description: Use summary lists to show a set of key/value pairs, such as a user's answers.
lede: Summary lists show information as key/value pairs, one row per pair.
group: Content
---

## Preview

```html title="Summary list"
<dl class="govbb-summary-list">
  <div class="govbb-summary-list__row">
    <dt class="govbb-summary-list__key">Name</dt>
    <dd class="govbb-summary-list__value">Alex Nurse</dd>
  </div>
  <div class="govbb-summary-list__row">
    <dt class="govbb-summary-list__key">Date of birth</dt>
    <dd class="govbb-summary-list__value">14 March 1990</dd>
  </div>
  <div class="govbb-summary-list__row">
    <dt class="govbb-summary-list__key">National registration number</dt>
    <dd class="govbb-summary-list__value">900314-0052</dd>
  </div>
  <div class="govbb-summary-list__row">
    <dt class="govbb-summary-list__key">
      Have you been known by any other last name?
    </dt>
    <dd class="govbb-summary-list__value">No</dd>
  </div>
</dl>
```

```tsx
import { SummaryList } from '@govtech-bb/react';

<SummaryList
  rows={[
    { key: 'Name', value: 'Alex Nurse' },
    { key: 'Date of birth', value: '14 March 1990' },
  ]}
/>;
```

The Summary list component displays pairs of related information (a bold key
and a plain value), one row per pair. It is built on a description list
(`<dl>`), so each key is a `<dt>` and each value a `<dd>`. On small screens the
key stacks above the value; from tablet widths up they sit side by side with
the keys in a fixed-width column.

## Sections

On a [check your answers](/patterns/check-answers/) page, wrap each page's
answers in a summary section: a heading, one change link for the whole
section, and a rule closing it off. The change link returns the user to the
form page the section summarises; give it visually hidden text naming the
section so screen reader users can tell the "Change" links apart.

```html title="Summary section"
<section class="govbb-summary-section">
  <div class="govbb-summary-section__header">
    <h2 class="govbb-summary-section__title">Tell us about yourself</h2>
    <a class="govbb-link" href="/form/about-you/">
      Change<span class="govbb-visually-hidden"> tell us about yourself</span>
    </a>
  </div>
  <dl class="govbb-summary-list">
    <div class="govbb-summary-list__row">
      <dt class="govbb-summary-list__key">Title</dt>
      <dd class="govbb-summary-list__value">Mr</dd>
    </div>
    <div class="govbb-summary-list__row">
      <dt class="govbb-summary-list__key">First name</dt>
      <dd class="govbb-summary-list__value">Alex</dd>
    </div>
  </dl>
</section>
```

```tsx
import { SummaryList } from '@govtech-bb/react';

<SummaryList
  section={{
    title: 'Tell us about yourself',
    action: {
      href: '/form/about-you/',
      label: 'Change',
      visuallyHiddenText: 'tell us about yourself',
    },
  }}
  rows={[
    { key: 'Title', value: 'Mr' },
    { key: 'First name', value: 'Alex' },
  ]}
/>;
```

The section heading defaults to an `<h2>`; set `section.headingLevel` when it
sits under a different heading structure.

### Stacking sections

Sections space themselves: 24px between siblings, matching the gap between
answer groups in the check-your-answers comp. Stack them one after another and
add nothing.

```html title="Two stacked sections"
<section class="govbb-summary-section">
  <div class="govbb-summary-section__header">
    <h2 class="govbb-summary-section__title">Tell us about yourself</h2>
    <a class="govbb-link" href="/form/about-you/">
      Change<span class="govbb-visually-hidden"> tell us about yourself</span>
    </a>
  </div>
  <dl class="govbb-summary-list">
    <div class="govbb-summary-list__row">
      <dt class="govbb-summary-list__key">Name</dt>
      <dd class="govbb-summary-list__value">Alex Nurse</dd>
    </div>
  </dl>
</section>
<section class="govbb-summary-section">
  <div class="govbb-summary-section__header">
    <h2 class="govbb-summary-section__title">Your contact details</h2>
    <a class="govbb-link" href="/form/contact/">
      Change<span class="govbb-visually-hidden"> your contact details</span>
    </a>
  </div>
  <dl class="govbb-summary-list">
    <div class="govbb-summary-list__row">
      <dt class="govbb-summary-list__key">Email address</dt>
      <dd class="govbb-summary-list__value">alex.nurse@example.com</dd>
    </div>
  </dl>
</section>
```

The spacing is a top margin on every section after the first, so a stack never
carries a dangling margin at either end. If your page lays its own blocks out
with a flex or grid gap, that gap and these margins would space the sections
twice — set `--govbb-summary-section-gap: 0` on the page (or on any ancestor of
the stack) and let the gap do the work. Set it to a `--govbb-space-*` value to
space the sections differently.

### Router links

Change links are plain `<a>` elements. In React, `linkComponent` swaps in a
router link that takes an `href`. For a router whose link takes something else —
TanStack Router's takes `to` — use `renderLink` instead: it is called with
`{ href, className, children }`, where `children` is the label plus any visually
hidden text, and it takes precedence over `linkComponent`.

## Row actions

Add a change link to a row when an individual answer can be revisited on its
own. The link sits in its own `<dd>` at the end of the row; give each one
visually hidden text naming the row so screen reader users hear "Change name",
not three identical "Change" links. On a
[check your answers](/patterns/check-answers/) page, prefer one link per
[summary section](#sections) instead.

```html title="Summary list with actions"
<dl class="govbb-summary-list">
  <div class="govbb-summary-list__row">
    <dt class="govbb-summary-list__key">Name</dt>
    <dd class="govbb-summary-list__value">Alex Nurse</dd>
    <dd class="govbb-summary-list__actions">
      <a class="govbb-link" href="/service/name/">
        Change<span class="govbb-visually-hidden"> name</span>
      </a>
    </dd>
  </div>
  <div class="govbb-summary-list__row">
    <dt class="govbb-summary-list__key">Date of birth</dt>
    <dd class="govbb-summary-list__value">14 March 1990</dd>
    <dd class="govbb-summary-list__actions">
      <a class="govbb-link" href="/service/date-of-birth/">
        Change<span class="govbb-visually-hidden"> date of birth</span>
      </a>
    </dd>
  </div>
</dl>
```

```tsx
import { SummaryList } from '@govtech-bb/react';

<SummaryList
  rows={[
    {
      key: 'Name',
      value: 'Alex Nurse',
      actions: {
        href: '/service/name/',
        label: 'Change',
        visuallyHiddenText: 'name',
      },
    },
    {
      key: 'Date of birth',
      value: '14 March 1990',
      actions: {
        href: '/service/date-of-birth/',
        label: 'Change',
        visuallyHiddenText: 'date of birth',
      },
    },
  ]}
/>;
```

`actions` takes one link or an array; pass `linkComponent` to render them with
a router link.

## Usage

<div class="govbb-usage-guidance">
  <section class="govbb-usage-guidance__item" aria-labelledby="summary-list-when-to-use">
    <h3 id="summary-list-when-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--do" aria-hidden="true">✓</span>
      When to use
    </h3>
    <ul>
      <li>Use a summary list for key–value facts about one person, application, service or record.</li>
      <li>Use it to let users review answers before submitting a service.</li>
    </ul>
  </section>
  <section class="govbb-usage-guidance__item" aria-labelledby="summary-list-when-not-to-use">
    <h3 id="summary-list-when-not-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--dont" aria-hidden="true">×</span>
      When not to use
    </h3>
    <ul>
      <li>Do not use it to compare the same fields across several records; use a <a href="/components/table/">table</a>.</li>
      <li>Do not use it for a plain list of links, tasks or steps.</li>
    </ul>
  </section>
</div>

## Best practices

### Use clear keys and complete values

Choose short labels such as “Date of birth” and show the value exactly as users
need to verify it. Long values such as email addresses and references wrap
inside their column. Group multiple summary lists under meaningful headings.

### Give every action context

If a row includes a “Change” link, add visually hidden text such as “Change
date of birth” so links remain distinct out of context. Return users to the
review page after the change.
