# Judging contrast in GovBB

Compute values for the installed release and the rendered page. Cached palette
ratios or live documentation alone do not establish the consumer's contrast.

## Run from the consumer project

Resolve `govbb_skill_dir` to the absolute directory of the installed
`accessibility-review` skill, keeping the working directory at the consumer:

```sh
node "$govbb_skill_dir/scripts/contrast.mjs" --tokens
node "$govbb_skill_dir/scripts/contrast.mjs" govbb-color-interactive govbb-color-surface
node "$govbb_skill_dir/scripts/contrast.mjs" govbb-color-focus govbb-color-surface --non-text
node "$govbb_skill_dir/scripts/contrast.mjs" "#595959" "#ffffff" --size 16 --weight normal
```

Token lookup uses the consumer's exported `@govtech-bb/frontend/tokens.css`.
Use `--tokens-file` for an explicit file, including a local GovBB source checkout.
That establishes token values, not service overrides or the entire CSS cascade.
Use computed colours for the actual element and backdrop when checking a page.

## Choose the threshold from rendered text

`contrast.mjs` holds the contrast ratios and large-text sizes and prints the
threshold it applied. It is the only copy of these numbers in this skill. Check
them against the contrast criteria in the WCAG checklist and the glossary
definitions they use, such as what counts as large text: if they differ, the
script is out of date, so report the result as unconfirmed rather than trust
it.

Pass the actual `--size` and `--weight`, or `--non-text`. Measure the rendered
size and weight; a token name or heading level proves neither. With no size, the
helper applies the stricter normal-text threshold. Inspect what it reports; do
not round a failing contrast ratio up to a pass. Before reporting a particular
visual boundary as required, check where the checklist's criteria apply to
boundaries and graphics, and their exceptions.

## Check the real pairing

Check text on its actual background, including error tints and local overrides.
The same colour may pass on one surface and fail on another. For focus rings,
inspect the complete indicator, control and surrounding page; a single token
pair is not enough to decide whether a multi-colour indicator meets the
requirement. W3C's Understanding documents for the target's version explain
adjacent colours and component states. Only criteria in the checklist are
failures.

Read which tokens a control's border and focus styles actually use. A palette
pairing is evidence only for that pair; it does not prove every control passes.
Route a confirmed shared-token/component defect to the design system, and a
service override to the service. External issue creation requires authorization.

For text over images, gradients or transparency, determine the actual backdrop
and composite it before computing. The helper rejects alpha-channel colours
because the backdrop is unknown. If it cannot be established, mark the case
`needs-manual-test`; an axe `incomplete` result is not a pass.

Read the exceptions in the checklist's contrast criteria before reporting a
failure. Separate a
usability concern from a claimed contrast failure when an exception applies.

## Reproducible findings

Record the source of the colours (rendered styles or named package/version),
actual values, command, returned ratio and applicable threshold. For text,
include rendered size and weight; for a non-text finding, identify the required
visual information and adjacent background. If a helper result appears wrong,
check the inputs and implementation against the standard rather than treating
the tool as unquestionable authority.
