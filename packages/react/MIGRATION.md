# Migrating from `@govtech-bb/react@1.0.0-alpha.17`

The current `@govtech-bb/react` is a rewrite, not an incremental release. The
alpha.17 line shipped self-contained React components with their own styling
packages (`@govtech-bb/styles`, `@govtech-bb/design`). The rewrite follows the
GOV.UK Frontend model instead: all styling lives in one framework-agnostic CSS
package, `@govtech-bb/frontend`, and the React package is a thin layer of
wrappers that emit the stable `govbb-*` classes. Components are lower-level and
closer to the platform: native `onChange` instead of `onCheckedChange`, a form
that submits instead of an `onSearch` callback, children instead of config
arrays.

Expect to touch every call site. The sections below list each change with
before/after code.

## Packaging and CSS

`@govtech-bb/styles` and `@govtech-bb/design` are replaced by a single package,
`@govtech-bb/frontend`. It ships the tokens, the component CSS and the
progressive-enhancement JS. `@govtech-bb/react` depends on it and re-exposes
nothing from the old packages.

```sh
npm remove @govtech-bb/styles
npm install @govtech-bb/react @govtech-bb/frontend
```

Non-Tailwind consumers can remove `@govtech-bb/design` at the same time.
Tailwind consumers should follow the additional migration note below first.

Import the stylesheet once at the app root:

```tsx
import '@govtech-bb/frontend/css';
```

Static assets (coat of arms, crest, logo) are no longer bundled. Host them
yourself and pass URLs via props (`coatSrc`, `imageSrc`, `logoSrc`), or copy
them from `@govtech-bb/frontend/assets/*`.

### Tailwind consumers

`@govtech-bb/design` also supplied a Tailwind theme, including utilities such
as `bg-blue-100`, `text-body` and `p-s`. The new frontend package is
framework-agnostic and does not recreate those utility names. Do not remove the
old design package from an existing Tailwind application until those classes
and unprefixed variables have been migrated.

The new tokens are deliberately prefixed (`--govbb-*`). Use them directly in
application CSS or Tailwind arbitrary values, for example
`bg-[var(--govbb-color-brand)]`. A large application can temporarily own a
Tailwind `@theme inline` compatibility mapping, but that mapping must cover the
utilities the application actually uses and should be removed after migration.
Once no old theme utilities or variables remain, remove `@govtech-bb/design`.

## Typography: variant helpers are CSS utilities now

`Heading` and `Text` remain as convenience components. The lower-level
`textVariants` and `linkVariants` helpers are gone; use the React components or
plain elements with the `govbb-text-*` and `govbb-link` classes.

```tsx
// Before
<Heading as="h1" size="display">Services</Heading>
<Text size="body-lg">Find government services.</Text>

// After, using the convenience components
<Heading as="h1" size="display">Services</Heading>
<Text size="body-lg">Find government services.</Text>

// After, using plain HTML
<h1 className="govbb-text-display">Services</h1>
<p className="govbb-text-body-lg">Find government services.</p>
```

Headings pick up their size from base styles; add a class only to decouple
visual size from heading level.

The alpha package also re-exported `cn`. That utility is no longer part of the
design-system API; use your application's existing class-name utility or
`class-variance-authority` directly.

## Button: `link` variant renamed to `text`

```tsx
// Before
<Button variant="link">Cancel</Button>

// After
<Button variant="text">Cancel</Button>
```

Other variants (`primary`, `secondary`, `tertiary`) are unchanged. New boolean
variants: `negative` (danger, primary and text only) and `inverse` (dark
backgrounds). `type` now defaults to `"button"`, so add `type="submit"` on
submit buttons.

## Link and LinkButton

`Link` no longer doubles as a button. A `Link` with a button `variant` becomes
`LinkButton`; the `external` prop remains available on both components.

```tsx
// Before
<Link href="/start" variant="primary">Start now</Link>
<Link href="https://example.org" external>Example</Link>

// After
<LinkButton href="/start">Start now</LinkButton>
<Link href="https://example.org" external>
  Example
</Link>
```

`external` defaults `target` to `_blank` and `rel` to
`noopener noreferrer`; explicit `target` or `rel` values still win. It is
available on `Link`, `LinkButton`, `FooterLink`, and typed Footer link items.
`noUnderline` and `noVisited` on `Link` are unchanged.

## Form fields: `description` is unchanged

`Input`, `Select` and `TextArea` continue to compose a label, description and
error around the control. The help-text prop remains `description`, and the
component name remains `TextArea`.

```tsx
<Input label="Email" description="We only use this to reply" error={err} />
<TextArea label="Details" description="Optional" />
```

With none of `label`/`description`/`error` set, each renders the bare control,
so they also work inside your own `FormGroup`/`Label` composition (those
primitives are exported too: `FormGroup`, `Label`, `Hint`, `ErrorMessage`,
`Fieldset`). Descriptions remain visible when an error is present, and both
the description and error are included in the control's `aria-describedby`
value.

## Checkbox and CheckboxGroup

`Checkbox` uses the native `onChange` instead of `onCheckedChange`:

```tsx
// Before
<Checkbox label="Remember me" onCheckedChange={(checked) => set(checked)} />

// After
<Checkbox label="Remember me" onChange={(e) => set(e.currentTarget.checked)} />
```

`CheckboxGroup` renames `label` to `legend`; `description` is unchanged. It
holds no state: each `Checkbox` child stays individually controlled (there is
no group `value`/`onValueChange`).

```tsx
// Before
<CheckboxGroup label="Contact methods" description="Pick all that apply">

// After
<CheckboxGroup legend="Contact methods" description="Pick all that apply">
```

## RadioGroup

`label` becomes `legend`, while `description` is unchanged. `name` is now
required; the group no longer auto-generates one. `value`/`onValueChange` work
as before. Per-option descriptions and conditional reveals are supported via
the `Radio` props `description` and `conditional`.

```tsx
// Before
<RadioGroup label="Where do you live?" value={v} onValueChange={setV}>

// After
<RadioGroup legend="Where do you live?" name="residence" value={v} onValueChange={setV}>
```

## DateInput

The `{ value: { day, month, year }, onChange }` object API carries over:
`value`/`onChange` drive all three fields, and `name` prefixes the field names
(`start-date-day`, `start-date-month`, `start-date-year` — dashes, where the
alpha used `start-date[day]` brackets). `label` becomes `legend`;
`description` is unchanged.

```tsx
// Before
<DateInput
  label="Start date"
  description="For example, 27 3 1990"
  name="start-date"
  value={date}
  onChange={setDate}
/>

// After
<DateInput
  legend="Start date"
  description="For example, 27 3 1990"
  name="start-date"
  value={date}
  onChange={setDate}
/>
```

`formatDateInput`/`parseDateInput` convert the value object to and from
`'YYYY-MM-DD'` (replacing `DateInput.format`/`DateInput.deformat`-style
helpers and hand-rolled `padStart` assembly).

For per-field control (`autoComplete`, `aria-invalid`, explicit ids, refs),
`dayProps`/`monthProps`/`yearProps` reach each `<input>` directly and override
the derived props. With `name` set, part ids follow it (`start-date-day`), so
`ErrorSummary` links like `#start-date-day` work without explicit ids; without
a `name`, ids are auto-generated. The same convention applies to `Input`,
`TextArea` and `Select`: a composed field's `id` defaults to its `name`.

## ErrorSummary: `{ text, target }` becomes `{ href, label }`

Items now carry a full `href` (including the `#`) and a `label`:

```tsx
// Before
<ErrorSummary errors={[{ text: 'Enter your name', target: 'full-name' }]} />

// After
<ErrorSummary errors={[{ href: '#full-name', label: 'Enter your name' }]} />
```

Clicking a summary link now focuses the linked control by default (the GOV.UK
behaviour). `onErrorClick(item, event)` still exists; call
`event.preventDefault()` inside it to opt out of the default focus. The
component is focusable (`tabIndex={-1}`), so `summaryRef.current?.focus()` on
failed submit works as before.

## Search: `onSearch` removed, it is a form

`Search` renders a real `<form role="search">` and submits like one. Give it an
`action` (GET) or an `onSubmit`; reach the input via `inputProps` (its `name`
defaults to `q`).

```tsx
// Before
<Search onSearch={(value) => router.push(`/search?q=${value}`)} />

// After: plain navigation
<Search action="/search" />

// After: intercepting submit
<Search
  onSubmit={(e) => {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get('q') as string;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }}
/>
```

The ref goes to the `<form>`; use `inputProps.ref` for the input. `borderless`
is unchanged.

## StatusBanner: `service-issue` renamed to `service`

```tsx
// Before
<StatusBanner variant="service-issue">Renew a passport</StatusBanner>

// After
<StatusBanner variant="service">Renew a passport</StatusBanner>
```

`alpha`, `beta`, `migrated` and `rounded` are unchanged.

## Footer: typed links with a custom-child escape hatch

`logoSrc` and `copyrightText` become `coatSrc` and `copy`. The `links` array
remains the preferred API, with `label` replacing custom child content:

```tsx
// Before
<Footer
  links={[{ label: 'Privacy', href: '/privacy' }]}
  logoSrc="/coat-of-arms.png"
  copyrightText="© 2026 Government of Barbados"
/>

// After
<Footer
  links={[{ label: 'Privacy', href: '/privacy' }]}
  coatSrc="/coat-of-arms.png"
  copy="© 2026 Government of Barbados"
/>
```

Use `linkComponent` for an href-compatible router adapter, or `renderLink` when
the router uses a different destination prop:

```tsx
<Footer
  links={[{ label: 'Privacy', href: '/privacy' }]}
  renderLink={({ href, ...props }) => <RouterLink to={href} {...props} />}
/>
```

For custom entries, `FooterLink` children remain available as an escape hatch.
Typed and custom links may be used together; the Footer places both in one
semantic list. With neither `links` nor children, it omits the navigation
landmark entirely.

## Header: custom `nav` and `children`

The Header owns the logo, menu disclosure and navigation landmark while the
consumer owns its content. `homeLabel` maps to `logoAlt`, and `logoSrc` is
required and consumer-hosted. `linkComponent` renders the logo's home link.

```tsx
// Before
<Header
  homeLabel="gov.bb"
  navItems={[{ label: 'Services', href: '/services' }]}
  linkComponent={NextLink}
/>

// After
<Header
  logoSrc="/gov-bb-logo.svg"
  logoAlt="gov.bb"
  homeHref="/"
  linkComponent={NextLink}
  nav={
    <NextLink className="govbb-link" href="/services">
      Services
    </NextLink>
  }
/>
```

Use `nav` for the menu-panel contents and `children` for optional custom
top-row content. The Header does not prescribe either region's controls or
links. Routers that use a destination prop other than `href` need a small
adapter only for the logo's `linkComponent`; navigation can use the router's
link component directly.

## OfficialBanner

`imageSrc`, `imageAlt`, `showLearnMore` and `learnMoreHref` remain supported.
Keep `imageAlt=""` when the adjacent banner text already conveys the image's
meaning. The banner text itself can now be customised with `children`, and
`linkLabel` customises the learn-more link text.

```tsx
<OfficialBanner
  imageSrc="/crest.png"
  imageAlt=""
  showLearnMore
  learnMoreHref="/about"
  linkLabel="Learn more"
/>
```

## New in this package

Components with no alpha.17 equivalent, available immediately: `BackButton`,
`Breadcrumbs`, `FileUpload`, `List`, `NumberInput`, `Payment`, `ShowHide`,
`SkipLink`, `SummaryList`, `Table` (with `TableHeader`/`TableCell`), and the
form primitives (`FormGroup`, `Label`, `Hint`, `ErrorMessage`, `Fieldset`).

## Versioning recommendation

Do not publish this as `0.0.0`, and do not restart at `1.0.0`. Both collide
with the old line: npm sorts `1.0.0-alpha.17 < 1.0.0`, but plenty of tooling,
changelogs and humans will read any `0.x` or `1.x` as a sibling of the alphas,
and a `^1.0.0-alpha` range in an existing consumer would resolve to the rewrite
silently.

Concretely:

1. Publish the rewrite of `@govtech-bb/react` as `2.0.0` (via `2.0.0-beta.n`
   prereleases under a `next` dist-tag while it stabilises). A clean major
   above the old line makes the break visible in every lockfile diff and keeps
   semver ranges from crossing the rewrite boundary in either direction.
2. Publish `@govtech-bb/frontend` at the same `2.0.0`, even though the name is
   new and `1.0.0` would be legal. Keeping the two packages in lockstep makes
   compatibility trivial to state ("use matching majors") and avoids a
   permanent "react is at N, frontend is at N minus 1" tax.
3. Deprecate the old packages on npm so installs surface the move:
   `npm deprecate @govtech-bb/styles "Replaced by @govtech-bb/frontend"` and
   the same for `@govtech-bb/design`; deprecate the `1.0.0-alpha.*` versions of
   `@govtech-bb/react` with a pointer to this guide.
4. Only move the `latest` dist-tag to `2.0.0` when the guide above is
   published; until then `latest` should keep pointing at whatever consumers
   can actually run.

Keeping the `@govtech-bb/react` name is right (it is the same product with the
same owner); the major bump plus deprecation notices carry the "this is a
rewrite" signal without a rename.
