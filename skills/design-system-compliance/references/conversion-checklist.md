# Conversion checklist

Use for a scoped conversion or a new page. Discover candidate components,
patterns and templates through `/llms.txt`; verify their APIs against the
consumer's installed release before copying examples.

## Map behaviours before names

List each distinct UI behaviour on the affected surface and classify it as a
component, a pattern/template, or a gap. Patterns may supply question wording,
validation and recovery that a class swap would miss.

- Search the index descriptions for what the control does. A "dropdown" may be
  a form select or navigation; distinguish those before choosing a component.
- Read candidate Markdown pages, including their "when not to use" guidance.
  When two candidates seem plausible, read both before deciding.
- Check whether the behaviour is part of a larger component before calling it
  missing. A label in the prototype need not match the component's name.
- Read relevant design decisions and consider composition or a separate page
  where the existing interaction does not fit. Preserve the task and discuss
  substantial journey changes rather than silently dropping functionality.

A genuine gap belongs in the report with a suggested owner. Service-owned
composition should use service-owned class names, not invented `govbb-` APIs.

## Page shape and spacing

Read the relevant template and `/styles/layout.md`. For that page type, prefer
the template's documented shape; report a disagreement rather than silently
claiming the two sources match. Verify the scaffold against installed CSS.

Work in this order: page frame and landmarks, form groups/controls, content,
then bespoke parts. Preserve the skip link and its focusable main target,
heading hierarchy and documented page furniture.

Read `/styles/spacing.md` and the installed styles before adding margins:

1. Do base headings and paragraphs already carry margins?
2. Which component roots space themselves from neighbours? Inner-element
   spacing does not establish the root's rhythm.
3. What padding and gaps do the frame and grid already provide?

Keep existing responsive frame spacing. Add only missing rhythm on your own
classes using semantic spacing tokens; avoid blanket `* + *` margins. For
spacing between scale steps, follow the guidance and choose an appropriate
existing step. Report a recurring mismatch that the scale cannot express.
Render at narrow and wide widths to check the result.

## Preserve supported styling integration

Use real components for their semantics and behaviour. Component-internal
spacing should come from the component, so remove conflicting utilities on the
converted element. This does not require removing Tailwind from the project.

For service-owned layout and styling, keep the existing framework. Check the
installed package's `./tailwind` export and its guidance when using the theme;
token-based arbitrary values are also supported. Prefer semantic tokens to
hard-coded colours or an unrelated scale. Do not migrate a React page to HTML
because it uses Tailwind, or add React merely to consume GovBB.

## Form conversion details

Before replacing a field, check whether a pattern covers that type of data.
Preserve its validation, meaningful example text, autocomplete/input mode,
submission name, label association and entered values. Copy the documented
field structure, including hint/error IDs and `aria-describedby`; when invalid,
keep `aria-invalid` and an error-summary link that reaches the field.

A useful verification is to submit invalid data and then correct it. Seeing a
red message is insufficient: the error must be reachable, announced as
appropriate, and connected to the control. Check the React wrapper's actual
props rather than manually duplicating wiring it already supplies.

## What the name audit cannot prove

Resolve CSS from the consumer's installed package, or pass `--css` explicitly.
Rebuild only when intentionally auditing a local source package with stale
build output. Do not compare an older service against an unrelated checkout's
latest stylesheet.

An existing class does not prove a selector matches: some modifiers require a
base class or particular nesting. Copy documented structure and inspect the
rendered element. Conversely, canonical markup may include a hook with no CSS
rule. Investigate version differences and the hook's purpose before treating an
unresolved name as an invented API. Report genuine inconsistencies.

## Per-target checks

### HTML and server-rendered markup

- Import `@govtech-bb/frontend/css` once.
- Preserve documented module attributes and initialise their containing DOM
  after it exists. Check dynamically inserted content if used.
- Resolve assets through the package's exported assets and pass their resulting
  URLs in the attributes the component expects.
- Exercise actual behaviour and the unenhanced fallback.

### React

- Import frontend CSS once at the app root and wrappers from `@govtech-bb/react`.
- Check props against the installed wrapper types/source.
- Do not run `initAll()` over React wrappers.
- For enhanced hand-written HTML where no wrapper exists, scope initialisation
  to that subtree and follow the package's lifecycle/cleanup contract.

### Both

- Match templates, components and tokens to the resolved package version.
- Preserve form labels, hints, errors, values and task completion.
- Check keyboard use, responsive rendering and no-JavaScript behaviour.
- Record concrete gaps, deliberate deviations and checks not completed.
