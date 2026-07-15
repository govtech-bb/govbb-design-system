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
npm remove @govtech-bb/styles @govtech-bb/design
npm install @govtech-bb/react @govtech-bb/frontend
```

Import the stylesheet once at the app root:

```tsx
import '@govtech-bb/frontend/css';
```

Static assets (coat of arms, crest, logo) are no longer bundled. Host them
yourself and pass URLs via props (`coatSrc`, `crestSrc`, `logoSrc`), or copy
them from `@govtech-bb/frontend/assets/*`.

## Typography: `Heading` and `Text` are CSS utilities now

`Heading`, `Text`, `textVariants` and `linkVariants` are gone. Use plain
elements with the `govbb-text-*` utility classes: `govbb-text-display`,
`govbb-text-h1` to `govbb-text-h4`, `govbb-text-body-lg`, `govbb-text-body`,
`govbb-text-caption`, `govbb-text-caption-sm`.

```tsx
// Before
<Heading as="h1" size="display">Services</Heading>
<Text size="body-lg">Find government services.</Text>

// After
<h1 className="govbb-text-display">Services</h1>
<p className="govbb-text-body-lg">Find government services.</p>
```

Headings pick up their size from base styles; add a class only to decouple
visual size from heading level.

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
`LinkButton`; the `external` prop is gone, set `target`/`rel` yourself.

```tsx
// Before
<Link href="/start" variant="primary">Start now</Link>
<Link href="https://example.org" external>Example</Link>

// After
<LinkButton href="/start">Start now</LinkButton>
<Link href="https://example.org" target="_blank" rel="noopener noreferrer">
  Example
</Link>
```

`noUnderline` and `noVisited` on `Link` are unchanged.

## Form fields: `description` renamed to `hint`, `TextArea` to `Textarea`

`Input`, `Select` and `Textarea` still compose a label, hint and error around
the control, but the hint prop is named `hint`. The `TextArea` casing is now
`Textarea`.

```tsx
// Before
<Input label="Email" description="We only use this to reply" error={err} />
<TextArea label="Details" description="Optional" />

// After
<Input label="Email" hint="We only use this to reply" error={err} />
<Textarea label="Details" hint="Optional" />
```

With none of `label`/`hint`/`error` set, each renders the bare control, so they
also work inside your own `FormGroup`/`Label` composition (those primitives are
exported too: `FormGroup`, `Label`, `Hint`, `ErrorMessage`, `Fieldset`).

## Checkbox and CheckboxGroup

`Checkbox` uses the native `onChange` instead of `onCheckedChange`:

```tsx
// Before
<Checkbox label="Remember me" onCheckedChange={(checked) => set(checked)} />

// After
<Checkbox label="Remember me" onChange={(e) => set(e.currentTarget.checked)} />
```

`CheckboxGroup` renames `label` to `legend` and `description` to `hint`, and
holds no state: each `Checkbox` child stays individually controlled (there is
no group `value`/`onValueChange`).

```tsx
// Before
<CheckboxGroup label="Contact methods" description="Pick all that apply">

// After
<CheckboxGroup legend="Contact methods" hint="Pick all that apply">
```

## RadioGroup

Same renames (`label` to `legend`, `description` to `hint`), and `name` is now
required; the group no longer auto-generates one. `value`/`onValueChange` work
as before. Per-option hints and conditional reveals are supported via the
`Radio` props `hint` and `conditional`.

```tsx
// Before
<RadioGroup label="Where do you live?" value={v} onValueChange={setV}>

// After
<RadioGroup legend="Where do you live?" name="residence" value={v} onValueChange={setV}>
```

## DateInput

The `{ value: { day, month, year }, onChange }` object API is replaced by
per-part passthrough props: `dayProps`, `monthProps`, `yearProps` each reach
their `<input>` directly, and `label`/`description` become `legend`/`hint`.

```tsx
// Before
<DateInput
  label="Start date"
  name="start-date"
  value={date}
  onChange={setDate}
/>

// After
<DateInput
  legend="Start date"
  dayProps={{
    id: 'start-date-day',
    value: date.day,
    onChange: (e) => setDate({ ...date, day: e.currentTarget.value }),
  }}
  monthProps={{ /* same shape */ }}
  yearProps={{ /* same shape */ }}
/>
```

Part ids are auto-generated unless you pass `id` per part. If an `ErrorSummary`
links to a specific part (for example `#start-date-day`), pass explicit ids as
above.

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

## Footer: children instead of a `links` array

`links`, `logoSrc` and `copyrightText` are replaced by `FooterLink` children,
`coatSrc` and `copy`:

```tsx
// Before
<Footer
  links={[{ label: 'Privacy', href: '/privacy' }]}
  logoSrc="/coat-of-arms.png"
  copyrightText="© 2026 Government of Barbados"
/>

// After
<Footer coatSrc="/coat-of-arms.png" copy="© 2026 Government of Barbados">
  <FooterLink href="/privacy">Privacy</FooterLink>
</Footer>
```

Because links are real children, framework link components (Next `Link` etc.)
can be used directly instead of a `linkComponent` prop.

## Header: children instead of `navItems`/`linkComponent`

The new `Header` renders a logo link plus arbitrary children. `navItems` and
`linkComponent` are gone; `homeLabel` maps to `logoAlt`. `logoSrc` is required
and consumer-hosted.

```tsx
// Before
<Header
  homeLabel="gov.bb"
  navItems={[{ label: 'Services', href: '/services' }]}
  linkComponent={NextLink}
/>

// After
<Header logoSrc="/gov-bb-logo.svg" logoAlt="gov.bb" homeHref="/">
  <nav aria-label="Menu">
    <NextLink className="govbb-link" href="/services">Services</NextLink>
  </nav>
</Header>
```

## OfficialBanner: `imageSrc` becomes `crestSrc`

`imageSrc` is renamed to `crestSrc` (required, consumer-hosted). `imageAlt` is
dropped (the crest is decorative; the adjacent text carries the meaning).
`showLearnMore` is replaced by an explicit `linkHref`/`linkLabel`; the banner
text itself is `children` (defaults to "Official government website").

```tsx
// Before
<OfficialBanner imageSrc="/crest.png" imageAlt="Barbados crest" showLearnMore />

// After
<OfficialBanner crestSrc="/crest.png" linkHref="/about" linkLabel="Learn more" />
```

## New in this package

Components with no alpha.17 equivalent, available immediately: `BackButton`,
`Breadcrumbs`, `FileUpload`, `List`, `NumberInput`, `ShowHide`, `SummaryList`,
`Table` (with `TableHeader`/`TableCell`), and the form primitives
(`FormGroup`, `Label`, `Hint`, `ErrorMessage`, `Fieldset`).

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
