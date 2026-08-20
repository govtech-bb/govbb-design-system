---
title: Accordion
description: Use an accordion to let users show and hide sections of related content on a page.
lede: Sections of related content, each collapsed behind its heading.
group: Content
---

## Preview

```html title="Accordion"
<div class="govbb-accordion">
  <details class="govbb-accordion__section">
    <summary class="govbb-accordion__summary">
      <h3 class="govbb-accordion__heading">Before you apply</h3>
    </summary>
    <div class="govbb-accordion__content">
      <p>Check you have your national registration number to hand.</p>
    </div>
  </details>
  <details class="govbb-accordion__section">
    <summary class="govbb-accordion__summary">
      <h3 class="govbb-accordion__heading">What it costs</h3>
    </summary>
    <div class="govbb-accordion__content">
      <p>The fee is BBD 50, payable when you submit the application.</p>
    </div>
  </details>
  <details class="govbb-accordion__section">
    <summary class="govbb-accordion__summary">
      <h3 class="govbb-accordion__heading">How long it takes</h3>
    </summary>
    <div class="govbb-accordion__content">
      <p>Most applications are decided within 10 working days.</p>
    </div>
  </details>
</div>
```

```tsx
import { Accordion, AccordionSection } from '@govtech-bb/react';

<Accordion>
  <AccordionSection heading="Before you apply">
    <p>Check you have your national registration number to hand.</p>
  </AccordionSection>
  <AccordionSection heading="What it costs">
    <p>The fee is BBD 50, payable when you submit the application.</p>
  </AccordionSection>
</Accordion>;
```

The accordion is built on the browser's own `details` and `summary` elements,
so it opens, closes and takes keyboard focus with no JavaScript. Sections
animate open where the browser supports it, and open instantly everywhere
else.

Each section takes its own heading level through `headingLevel`, so the
accordion fits your page outline rather than forcing one. The default is `h3`.

Two props shape the whole accordion: `variant` for how the group is framed,
and `allowsMultipleExpanded` for how many can be open at once. `disabled`
works on the accordion or on a single section. There is one size and one row
height everywhere; pick the heading level for your page outline, not for its
look.

## Usage

<div class="govbb-usage-guidance">
  <section class="govbb-usage-guidance__item" aria-labelledby="accordion-when-to-use">
    <h3 id="accordion-when-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--do" aria-hidden="true">✓</span>
      When to use
    </h3>
    <ul>
      <li>Use an accordion when a page holds several sections and most users only need one of them.</li>
      <li>Use it to let users scan the headings and choose what to read.</li>
    </ul>
  </section>
  <section class="govbb-usage-guidance__item" aria-labelledby="accordion-when-not-to-use">
    <h3 id="accordion-when-not-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--dont" aria-hidden="true">×</span>
      When not to use
    </h3>
    <ul>
      <li>Do not hide content users need to read to complete their task, or content they will need to find with the browser's find-in-page.</li>
      <li>Do not use an accordion for a single section. Use <a href="/components/show-hide/">show and hide</a> instead.</li>
    </ul>
  </section>
</div>

## Framing: quiet, divided, boxed and cards

By default the accordion is quiet: a stack of pressable rows, each taking a
hover fill and its own rounding, with nothing drawn between them. Three
`variant` values draw borders instead.

Use `divided` for rules between sections, where headings run long and users
scan the list rather than aim at it. Use `boxed` for one border around the
whole group, where the accordion sits among other bordered blocks and needs
to match them. Use `cards` to give each section its own bordered card, where
sections are peers a user picks between rather than a list they read down.

```html title="Divided accordion"
<div class="govbb-accordion govbb-accordion--divided">
  <details class="govbb-accordion__section">
    <summary class="govbb-accordion__summary">
      <h3 class="govbb-accordion__heading">Before you apply</h3>
    </summary>
    <div class="govbb-accordion__content">
      <p>Check you have your national registration number to hand.</p>
    </div>
  </details>
  <details class="govbb-accordion__section">
    <summary class="govbb-accordion__summary">
      <h3 class="govbb-accordion__heading">What it costs</h3>
    </summary>
    <div class="govbb-accordion__content">
      <p>The fee is BBD 50.</p>
    </div>
  </details>
</div>
```

```tsx
import { Accordion, AccordionSection } from '@govtech-bb/react';

<Accordion variant="divided">
  <AccordionSection heading="Before you apply">
    <p>Check you have your national registration number to hand.</p>
  </AccordionSection>
  <AccordionSection heading="What it costs">
    <p>The fee is BBD 50.</p>
  </AccordionSection>
</Accordion>;
```

The boxed and cards frames use the same markup with a different modifier
class.

```html title="Cards accordion"
<div class="govbb-accordion govbb-accordion--cards">
  <details class="govbb-accordion__section">
    <summary class="govbb-accordion__summary">
      <h3 class="govbb-accordion__heading">Before you apply</h3>
    </summary>
    <div class="govbb-accordion__content">
      <p>Check you have your national registration number to hand.</p>
    </div>
  </details>
  <details class="govbb-accordion__section">
    <summary class="govbb-accordion__summary">
      <h3 class="govbb-accordion__heading">What it costs</h3>
    </summary>
    <div class="govbb-accordion__content">
      <p>The fee is BBD 50.</p>
    </div>
  </details>
</div>
```

```tsx
import { Accordion, AccordionSection } from '@govtech-bb/react';

<Accordion variant="cards">
  <AccordionSection heading="Before you apply">
    <p>Check you have your national registration number to hand.</p>
  </AccordionSection>
  <AccordionSection heading="What it costs">
    <p>The fee is BBD 50.</p>
  </AccordionSection>
</Accordion>;
```

## Icons and hints

A section heading can carry a decorative icon before it, and a hint line
under it. Use a hint when the heading alone cannot say what is inside;
front-load the heading anyway, because the hint is what users skip. Icons are
hidden from screen readers, and an SVG drawn in `currentColor` follows the
row's hover and open colours. Hints are announced as part of the row.

```html title="Section with an icon and a hint"
<details class="govbb-accordion__section">
  <summary class="govbb-accordion__summary">
    <span class="govbb-accordion__icon" aria-hidden="true">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor">…</svg>
    </span>
    <span class="govbb-accordion__text">
      <h3 class="govbb-accordion__heading">What it costs</h3>
      <span class="govbb-accordion__hint"
        >The fee, and the ways you can pay it</span
      >
    </span>
  </summary>
  <div class="govbb-accordion__content">
    <p>The fee is BBD 50, payable when you submit the application.</p>
  </div>
</details>
```

```tsx
import { Accordion, AccordionSection } from '@govtech-bb/react';

<Accordion>
  <AccordionSection
    heading="What it costs"
    hint="The fee, and the ways you can pay it"
    icon={<CoinIcon />}
  >
    <p>The fee is BBD 50, payable when you submit the application.</p>
  </AccordionSection>
</Accordion>;
```

## Sections users cannot open

Set `disabled` on the accordion to stop every section opening, or on a single
section for one that is not available yet. A disabled section is dimmed, drops
out of the tab order and does not respond to a click, and it announces as
disabled rather than as a heading users can act on.

Prefer explaining why a section is empty to disabling it. A user who cannot
open a section learns nothing about what would put content in it.

```html title="Disabled section"
<details class="govbb-accordion__section">
  <summary class="govbb-accordion__summary" aria-disabled="true" tabindex="-1">
    <h3 class="govbb-accordion__heading">Your documents</h3>
  </summary>
  <div class="govbb-accordion__content">
    <p>Available once your application is submitted.</p>
  </div>
</details>
```

```tsx
import { Accordion, AccordionSection } from '@govtech-bb/react';

<Accordion>
  <AccordionSection disabled heading="Your documents">
    <p>Available once your application is submitted.</p>
  </AccordionSection>
</Accordion>;
```

## One section at a time

Set `allowsMultipleExpanded={false}` and the browser keeps one section open,
closing the others as the user moves through them. It does that natively: the
wrapper gives every section the same `name`, which is what the plain HTML
example below sets by hand.

Leaving several sections open is the default, and the safer one for content
users may want to compare.

```html title="Exclusive accordion"
<div class="govbb-accordion">
  <details class="govbb-accordion__section" name="guidance">
    <summary class="govbb-accordion__summary">
      <h3 class="govbb-accordion__heading">Before you apply</h3>
    </summary>
    <div class="govbb-accordion__content">
      <p>Check you have your national registration number to hand.</p>
    </div>
  </details>
  <details class="govbb-accordion__section" name="guidance">
    <summary class="govbb-accordion__summary">
      <h3 class="govbb-accordion__heading">What it costs</h3>
    </summary>
    <div class="govbb-accordion__content">
      <p>The fee is BBD 50.</p>
    </div>
  </details>
</div>
```

```tsx
import { Accordion, AccordionSection } from '@govtech-bb/react';

<Accordion allowsMultipleExpanded={false}>
  <AccordionSection heading="Before you apply">
    <p>Check you have your national registration number to hand.</p>
  </AccordionSection>
  <AccordionSection heading="What it costs">
    <p>The fee is BBD 50.</p>
  </AccordionSection>
</Accordion>;
```

## Nesting

Accordions nest without any extra wiring: put one inside a section's content
and each group manages its own sections, so an exclusive outer group never
closes because something opened inside it. Treat two levels as the limit; if
you need a third, the page needs restructuring more than the accordion needs
depth.

```html title="Nested accordion"
<div class="govbb-accordion">
  <details class="govbb-accordion__section" name="settings">
    <summary class="govbb-accordion__summary">
      <h3 class="govbb-accordion__heading">General settings</h3>
    </summary>
    <div class="govbb-accordion__content">
      <div class="govbb-accordion">
        <details class="govbb-accordion__section">
          <summary class="govbb-accordion__summary">
            <h4 class="govbb-accordion__heading">Language</h4>
          </summary>
          <div class="govbb-accordion__content">
            <p>Pick the language the service is shown in.</p>
          </div>
        </details>
      </div>
    </div>
  </details>
</div>
```

```tsx
import { Accordion, AccordionSection } from '@govtech-bb/react';

<Accordion allowsMultipleExpanded={false}>
  <AccordionSection heading="General settings">
    <Accordion>
      <AccordionSection heading="Language">
        <p>Pick the language the service is shown in.</p>
      </AccordionSection>
    </Accordion>
  </AccordionSection>
</Accordion>;
```

## Best practices

### Write headings users can choose between

The heading is the only thing a user sees before they open a section, so it
has to describe what is inside. Front-load the words that distinguish one
section from the next.

### Keep sections independent

A user may open the third section first. Each section should make sense on its
own rather than reading as step three of a sequence.
