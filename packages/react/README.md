# @govtech-bb/react

Thin React wrappers over the GovBB Design System CSS. The CSS is the single
source of truth for styling — these components only map props to the stable
`govbb-*` classes (via [cva](https://cva.style)) and add the small amount of
behaviour React consumers expect (refs, controlled inputs, callbacks).

## Install

```bash
pnpm add @govtech-bb/react @govtech-bb/frontend
```

`react >= 18` is a peer dependency. This package ships no CSS of its own —
import the stylesheet once at your app root:

```tsx
import '@govtech-bb/frontend/css';
```

The package ships compiled ESM + type declarations (`dist/`), so it works in
any bundler without extra config. Source stays in the tarball for source maps.

Existing `1.0.0-alpha.*` consumers must follow the breaking-change guide in
[MIGRATION.md](./MIGRATION.md); the rewrite is intended for a new major version.

## Usage

```tsx
import { Button, Checkbox, ErrorSummary, FormGroup, Hint, Input, Label } from '@govtech-bb/react';

<Button variant="secondary" onClick={save}>Save and continue</Button>

<FormGroup>
  <Label htmlFor="full-name">Full name</Label>
  <Hint id="fn-hint">As it appears on your ID</Hint>
  <Input id="full-name" aria-describedby="fn-hint" />
</FormGroup>

<Checkbox label="I agree to the terms of service" />
```

Every component forwards its ref — to the interactive control for composites
(`Checkbox`, `Radio`, `NumberInput`, `FileUpload` forward to their `<input>`),
to the root element otherwise. `ErrorSummary` is focusable
(`summaryRef.current?.focus()` on failed submit).

All native attributes pass through, and `className` merges after the
component's own classes.

## Components

BackButton · Breadcrumbs · Button / LinkButton · ButtonGroup · Checkbox ·
DateInput ·
ErrorMessage · ErrorSummary · Feedback · Fieldset · FileUpload ·
Footer / FooterLink · FormGroup · Header · Heading / Text · Hint ·
Input / Textarea · Label · Link · List · NumberInput · OfficialBanner ·
Payment · Radio · Search · Select · ServiceList · ShowHide · SkipLink ·
StatusBanner · SummaryList · Table

Each lives in `src/<name>/<name>.tsx` with its test alongside. `pnpm test`
runs the vitest + testing-library suite; `pnpm typecheck` runs tsc.
