# Layout and vertical rhythm

The design system owns horizontal layout completely and vertical rhythm barely
at all. Knowing which is which is the difference between a page that looks like
a government service and one that looks almost like one.

Facts below verified against `packages/frontend/src` on 2026-08-10. They are
hand-maintained, unlike the generated references — if spacing behaves
unexpectedly, read the component's stylesheet before trusting this file.

## Contents

- [What the system owns](#what-the-system-owns)
- [What you own](#what-you-own)
- [Why pages come out cramped](#why-pages-come-out-cramped)
- [How to add rhythm](#how-to-add-rhythm)
- [Spacing tokens](#spacing-tokens)

## What the system owns

**Horizontal layout — use it, do not rebuild it.**

| Need                                                          | Class                                                                               |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Page gutters (16px phone → 128px at the 1512px desktop frame) | `govbb-width-container`                                                             |
| Main content region                                           | `govbb-main-wrapper`                                                                |
| Row                                                           | `govbb-grid-row`                                                                    |
| Columns                                                       | `govbb-grid-column-{full,one-half,one-third,two-thirds,one-quarter,three-quarters}` |
| Columns that only split on desktop                            | the same names with `-from-desktop`                                                 |

Body text sits in `govbb-grid-column-two-thirds` in the system's own examples —
that is the measure the type scale was designed for. A full-width paragraph at
`--govbb-font-size-body` is too long a line to read comfortably.

**Vertical rhythm the system does own:**

| Element                 | Margin                                   |
| ----------------------- | ---------------------------------------- |
| `h1`–`h6` (base styles) | `0 0 var(--govbb-space-s)` — 16px bottom |
| `p` (base styles)       | `0 0 var(--govbb-space-s)` — 16px bottom |
| `govbb-form-group`      | 24px bottom — owns form-flow rhythm      |
| `govbb-error-summary`   | 32px bottom                              |

Base styles use `:where()`, so they carry zero specificity and anything you
write wins without `!important`.

## What you own

Nothing in the system sets these, so they are yours:

| Element              | What it does | Consequence                                             |
| -------------------- | ------------ | ------------------------------------------------------- |
| `govbb-button`       | no margin    | sits flush against whatever is next to it               |
| `govbb-back-button`  | no margin    | jams against the heading below it                       |
| `govbb-list`         | `margin: 0`  | **no space above or below the list at all**             |
| `govbb-summary-list` | `margin: 0`  | same                                                    |
| Section spacing      | nothing      | consecutive sections get only the 16px paragraph margin |

**There are no spacing utility classes.** `--govbb-space-*` are tokens, not
classes; there is no `govbb-mb-m`. Checking `utilities.css` confirms it —
deliberately minimal, type scale and `govbb-visually-hidden` only.

## Why pages come out cramped

Two compounding effects, both easy to miss until you look at the rendered page:

1. **The block margin is flat.** 16px follows an 80px `govbb-text-display`
   heading and a 12px caption alike. Large type needs proportionally more space
   around it, so big headings read as crowded while small text reads as loose.
2. **The components most used for content set `margin: 0`.** Lists and summary
   lists actively remove the browser's margin and replace it with nothing, so a
   heading, a list and a button in sequence collapse into one undifferentiated
   block.

The result looks _deliberate_ — everything is evenly spaced — which is why it
survives review. It is worth rendering the page and looking at it rather than
trusting that classes alone produce the layout.

## How to add rhythm

Writing a small amount of service CSS here is correct, not a failure. What
matters is where it goes and what it is made of.

**Put the margin on your own class, never on the component's.**

```css
/* Yes — an owned wrapper spaces its children. */
.app-section {
  margin-block-start: var(--govbb-space-m);
}

/* No — this is restyling a component's internals, and every other
   service using .govbb-list now disagrees with this one. */
.govbb-list {
  margin-bottom: 2rem;
}
```

**Prefer one owned wrapper over sprinkled margins.** A single rule that spaces
whatever follows a heading is easier to review, and easier to delete when the
system grows real spacing utilities:

```css
/* Space between major blocks, scaled to the type it follows. */
.app-prose > * + * {
  margin-block-start: var(--govbb-space-s);
}
.app-prose > h2 {
  margin-block-start: var(--govbb-space-m);
}
.app-prose > .govbb-button {
  margin-block-start: var(--govbb-space-xm);
}
```

**Scale the gap to the type.** A heading should sit closer to the text it
introduces than to the block above it — proximity is what signals which
content belongs together. Equal space above and below a heading makes it
ambiguous which section it heads.

**Do not add margins around components that already own their rhythm.**
`govbb-form-group` and `govbb-error-summary` bring their own bottom margin;
adding more double-spaces the form.

**Never use literal values.** Every gap comes from `--govbb-space-*`. A literal
`24px` looks identical today and drifts the moment the scale changes.

## Spacing tokens

| Token               | Value | Use                                     |
| ------------------- | ----- | --------------------------------------- |
| `--govbb-space-xxs` | 4px   | inside tight groupings (list items)     |
| `--govbb-space-xs`  | 8px   | label-to-control, icon gaps             |
| `--govbb-space-s`   | 16px  | between related blocks; the base margin |
| `--govbb-space-xm`  | 24px  | between form groups                     |
| `--govbb-space-m`   | 32px  | between sections                        |
| `--govbb-space-l`   | 64px  | major page divisions                    |
| `--govbb-space-xl`  | 128px | desktop page gutter                     |

`s`, `xm` and `m` are confirmed against Figma. `xxs`, `xs` and `l` are marked in
`tokens.css` as placeholders pending confirmation — usable, but expect them to
move, which is another reason not to hard-code their current values.

## Worth reporting

The absence of spacing utilities is a reasonable design decision — GOV.UK
Frontend ships `govuk-!-margin-*` overrides and they are widely considered a
mixed blessing. But the current position means **every service invents its own
vertical rhythm**, which is the outcome a design system exists to prevent.

If a conversion needed more than a handful of spacing rules, say so in the
report. Repeated evidence from real services is what turns this from an opinion
into a decision the design team can act on.
