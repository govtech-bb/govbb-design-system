# Judging contrast in the GovBB Design System

Method only. **This file deliberately holds no colour values and no ratios**, so
there is nothing in it that can quietly stop being true.

An earlier version cached a table of the palette's ratios. It was a liability
rather than a shortcut: a cached ratio that has gone stale does not announce
itself, it just reports a pass for something that now fails — the one outcome this
skill exists to prevent. And the cache bought nothing, because the script
regenerates the whole picture in a second.

## Getting the current picture

```sh
# Every semantic token against surface and ink — the whole palette, current
node scripts/contrast.mjs --tokens

# One pair, by token name (resolved through tokens.css, following var() chains)
node scripts/contrast.mjs govbb-color-interactive govbb-color-surface

# Non-text threshold: control boundaries, focus indicators, meaningful graphics
node scripts/contrast.mjs govbb-color-focus govbb-color-surface --non-text
```

For which threshold applies, and why you must measure the rendered text size
rather than infer it from a token or heading level, see the contrast pass in
`SKILL.md`. Do not reason about thresholds yourself — pass `--size` and
`--weight` and let the script name the threshold it applied.

## Where contrast actually fails in a token-based system

These are patterns, not measurements, so they hold as the palette changes. Each
one is worth a deliberate check.

**Focus indicators are the most likely non-text failure.** A focus colour gets
chosen for visibility against the _control_ it surrounds, which does not make it
visible against the _page_ behind it. Compute the ring against **both** adjacent
surfaces — the control's own edge and the page surface — because SC 1.4.11 needs
3:1 and it is easy to satisfy on one side and fail on the other.

If a ring comes out under 3:1 against the page: **do not report it against a
service team.** They cannot fix a core token, and telling them to is noise. It is
a design-system-level escalation, filed once as an issue. Note also that SC
1.4.11's "adjacent colours" is genuinely ambiguous for a ring sandwiched between
a high-contrast border and a low-contrast page — the stricter reading (and WCAG
2.2's AAA SC 2.4.13 Focus Appearance) fails it, the narrower one passes. That
argument should be settled once by an accessibility specialist for the whole
system, not re-litigated in every review. Check whether it already has been
before spending time on it.

**Pale tints and bright accents are background-only, and tempting as text.** Any
palette built for government branding contains light wash colours and a
saturated accent. They are designed to sit _behind_ ink, and they are exactly what
someone reaches for when they want a heading to look brand-forward. Compute
before accepting any of them as a text colour, however official it looks.

**Control boundaries depend on which token was chosen, not on any markup.** A
field's border passing 3:1 is a property of the token in the component's CSS. A
change to a lighter border token drops it below the minimum without altering a
line of HTML, and most palettes contain tokens low enough to do that. Read which
token the component uses, then compute it against the surface behind it — never
carry "field borders are fine" as an assumption.

**A pairing that passes on white may fail on a tint.** Error text on a white page
and the same error text on the error tint are two different computations. Check
the surface the text actually sits on, including anything a component overrides
on its own container.

**Text over images, gradients or transparency is where guessing is most
tempting.** axe reports these as `incomplete` because it cannot determine the
backdrop, and that is the honest answer. Composite the real backdrop and compute
it, or mark it `needs-manual-test`. Do not estimate.

## Things that legitimately have no contrast requirement

- **Disabled controls.** SC 1.4.3 exempts inactive components, so a dimmed
  disabled control is not a contrast failure however low it computes. Still worth
  a `judgement` note if it carries information someone needs.
- **Purely decorative graphics**, and text that forms part of a logo.

## Alpha and layered colours

Overlay and shadow tokens are semi-transparent, and `contrast.mjs` refuses to
compute a ratio for a colour with an alpha channel — deliberately, because the
result depends entirely on what is behind it, and a ratio against an assumed
backdrop is worse than no ratio. Composite the real stack first, or read the
rendered pixel from the browser, then compute that.

## Reporting a contrast finding

A `computed` finding must be reproducible by whoever reads it. Give the command
you ran, the ratio it returned, and the threshold that applied and why — the
rendered size and weight for text, or non-text for a boundary or indicator.
"Contrast is too low" is not a finding; it is an assertion.

If anything here disagrees with what the script currently reports, the script is
right.
