# Anti-patterns

The specific ways design-system conversion goes wrong. Each one is easy to do
by accident and hard to spot in review, which is the combination worth writing
down.

## Inventing `govbb-` names

```html
<!-- No. None of these exist. -->
<div class="govbb-card">
  <span class="govbb-badge">New</span>
  <div class="govbb-alert govbb-alert--warning">…</div>
</div>
```

They render as unstyled markup, Stylelint rejects the prefix in service code,
and — the real cost — they claim the design system supports something it does
not. Someone later greps for `govbb-card`, finds nothing, and cannot tell
whether it was deleted or never existed.

**Instead:** search `/components/` for the behaviour, and fetch the page of
anything that looks close. If nothing covers it, either compose it from what does
exist or record it as a gap. Both are fine; inventing is not.

Do not shortcut that search on the strength of a name. Something that reads as
absent is often present under a different one, or present as part of a larger
component — a tag treatment exists inside Service list, for instance, which is
easy to miss if you searched for "badge" and stopped.

The same applies to tokens. `--govbb-color-primary` sounds right and is not
real; the brand colour is `--govbb-color-brand`. An undefined custom property
silently resolves to nothing, so the element just loses its colour with no
error anywhere.

## Restyling a component's internals

```css
/* No. */
.govbb-button {
  background: #b91c1c;
  border-radius: 12px;
}
.govbb-header__nav a {
  font-size: 14px;
}
```

The component's appearance is the system's to define. Overriding it from
service CSS means this service silently stops matching every other service,
and the override breaks without warning when the component's internals change —
they are not a public API, the class name is.

**Instead:** use the variant the system provides (`govbb-button--negative` for
destructive actions, and similar — the component's page lists its variants). If no
variant fits, that is a finding for the report, not a local patch.

## Reinventing a pattern or template

Building a "check your answers" screen out of raw components when the
**Check answers** pattern exists, or hand-rolling a 404 when the
**Page not found** template exists.

Patterns encode question wording, validation behaviour and error handling that
were decided once and tested. Rebuilding from components loses all of that and
looks like it worked, because the visual result is similar.

**Instead:** fetch `/sitemap/` during inventory and scan the patterns and
templates, before you start assembling.

## Forgetting the progressive-enhancement wiring

```html
<!-- Renders fine. Mobile navigation never opens. -->
<header class="govbb-header">…</header>
```

Header, File upload and Number input need `data-govbb-module` plus one
`initAll()` call. Because the CSS is doing its job, the page looks correct and
the failure only shows up when someone interacts with it — often on the phone,
after release.

**Instead:** treat the JavaScript wiring as part of using those components, not
a follow-up task. A component's page shows `data-govbb-module` in its markup
when it needs one, and `/documentation/using-the-design-system.md` names them.

## Mixing the two consumer targets for one element

Using `<Button>` from `@govtech-bb/react` in one place and hand-written
`class="govbb-button"` markup for the same button elsewhere in the same
surface, or calling `initAll()` in a React app.

`initAll()` over React components double-binds behaviour the wrappers already
have. Mixed usage for the same element means two things to update when the
component changes, and one of them will be missed.

**Instead:** pick a target per surface. Hand-written `govbb-` markup inside a
React app is legitimate where no wrapper exists — the classes are a stable
API — just do not do both for the same element.

## Bridging to a utility framework instead of removing it

```html
<!-- Looks compliant. Is not converted. -->
<div class="max-w-3xl mx-auto px-[var(--govbb-space-s)]">
  <h1 class="text-4xl font-bold text-[var(--govbb-color-brand)]">…</h1>
</div>
```

The tokens are right and the markup still is not the design system. There is a
`govbb-width-container` for that wrapper and a `govbb-text-h1` for that heading,
and using neither means the page keeps a second layout and type system alongside
the one it claims to use.

The cost lands later: a prototype in this state cannot be lifted into alpha
until someone unpicks the utility classes, and that someone will not be whoever
wrote them.

**Instead:** replace utility classes with the design system's own scaffold and
type utilities. For genuinely bespoke layout, write plain CSS against
`--govbb-*` tokens — reviewable and portable, which a bridged utility class is
not.

## Reaching for primitive tokens

```css
/* Works, but pins you to a hue. */
color: var(--govbb-blue-100);

/* Says what you mean. */
color: var(--govbb-color-brand);
```

The primitive ramp exists so the semantic tier has something to resolve to.
Naming a primitive directly drops the meaning, so when the palette moves, this
declaration stays behind and nobody knows whether that was deliberate.

**Instead:** use the semantic name. Reach for a primitive only when no semantic
token expresses the intent — and mention it in the report, because it usually
means a semantic token is missing.

## Forcing an almost-right token

The prototype has `#0d5f63`; the nearest token is `--govbb-teal-00` at
`#0e5f64`. Close enough to substitute silently, different enough to be wrong.

The problem is not the two hex digits — it is that the substitution is
invisible afterwards. A deliberate near-match and an accidental one look
identical in the diff.

**Instead:** substitute when it is clearly the same intent, and say so in the
report. When it genuinely is not, record the gap rather than quietly rounding.

## Dropping functionality to make the conversion clean

The prototype had a modal; the system has no modal; the modal quietly
disappears, or becomes a `<div>` that is always visible.

A conversion that loses behaviour is not a conversion. This is the most
damaging failure here because the report looks _better_ — fewer gaps — while
the service does less than it did.

**Instead:** re-express it (a modal step becomes its own page) or record it.
Both belong in the report. Neither is silent.

## Declaring victory without looking

"Converted the prototype to the GovBB Design System ✅" with no gap list.

There is essentially always something: a colour with no token, an interaction
with no component, a deliberate deviation. A report with no gaps usually means
the inventory was shallow, not that the fit was perfect.

**Instead:** the gap list is the deliverable that gets acted on. An empty one
should make you re-check Step 2 before you believe it.
