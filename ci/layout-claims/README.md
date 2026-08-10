# Layout claim reproductions

Standing reproduction attempts for layout defects reported against the design
system. The point is to make a "cannot reproduce" verdict inspectable rather
than something someone has to take on trust.

```sh
node ci/layout-claims/reproduce.mjs                    # local build
node ci/layout-claims/reproduce.mjs --css <path|url>   # a published package, say
```

Exits `0` when nothing reproduces and non-zero when something does, so each
entry doubles as a regression guard once a defect is confirmed and fixed.

## Currently tracked

Two defects were reported independently by two agents scaffolding React
applications during the `design-system-compliance` skill evaluation:

- **`.govbb-grid-row` overflows the mobile frame.** Twelve tracks and eleven
  32px column gaps give a 352px floor, against roughly 343px of content box at
  the 375px design frame — predicted to scroll sideways by about 9px on every
  page using the documented scaffold.
- **`.govbb-width-container` does not stretch.** Its `margin-inline: auto` was
  said to suppress cross-axis stretch once `.govbb-page` makes it a flex item,
  shrinking `<main>` to its content and drifting it out of alignment with the
  header.

**Neither reproduces.** Eighteen measurements per stylesheet — four viewport
widths, five kinds of content with intrinsic minimum width, and three page
structures including a React-style mount node and the width container used
directly as `<main>` — against both the local build and the published
`@govtech-bb/frontend@1.0.0-alpha.21`. No horizontal overflow, no
misalignment.

The reports are recorded as unconfirmed in
[docs/plans/ai-skills.md](../../docs/plans/ai-skills.md). Two independent
agents agreeing is not a reproduction, and both applied workarounds inside
their own scaffolds, so the cause is more likely in that application code than
in `layout.css`. Isolate it before changing the design system.

## Adding a claim

Add a case to `reproduce.mjs` alongside the existing two, with the prediction
written out in the comment header: what should be observed, at what width, and
by how much. A claim without a number is not testable, and the number is what
makes the negative result meaningful.
