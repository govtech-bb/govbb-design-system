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

`contrast.mjs` holds the ratios and the large-text sizes, taken from SC 1.4.3,
SC 1.4.11 and the definition of large-scale text in WCAG 2. The script is the
only copy of these numbers in this skill: if the target's version changes
them, change the script. It prints the threshold it applied.

Pass the actual `--size` and `--weight`, or `--non-text`. Measure the rendered
size and weight; a token name or heading level proves neither. With no size, the
helper applies the stricter normal-text threshold. Read SC 1.4.11's
applicability and exceptions before reporting a particular visual boundary as
required. Inspect what it reports;
do not round a failing contrast ratio up to a pass.

## Check the real pairing

Check text on its actual background, including error tints and local overrides.
The same colour may pass on one surface and fail on another. For focus rings,
inspect the complete indicator, control and surrounding page; a single token
pair is not enough to decide whether a multi-colour indicator meets the
requirement. W3C's Understanding document for SC 1.4.11, in the target's
version, explains adjacent colours and component states. Do not report a
criterion above the target's level, such as an enhanced focus requirement, as
a failure.

Read which tokens a control's border and focus styles actually use. A palette
pairing is evidence only for that pair; it does not prove every control passes.
Route a confirmed shared-token/component defect to the design system, and a
service override to the service. External issue creation requires authorization.

For text over images, gradients or transparency, determine the actual backdrop
and composite it before computing. The helper rejects alpha-channel colours
because the backdrop is unknown. If it cannot be established, mark the case
`needs-manual-test`; an axe `incomplete` result is not a pass.

Read the exceptions in SC 1.4.3 Contrast (Minimum) and SC 1.4.11 Non-text
Contrast at the target's version before reporting a failure. Separate a
usability concern from a claimed contrast failure when an exception applies.

## Reproducible findings

Record the source of the colours (rendered styles or named package/version),
actual values, command, returned ratio and applicable threshold. For text,
include rendered size and weight; for a non-text finding, identify the required
visual information and adjacent background. If a helper result appears wrong,
check the inputs and implementation against the standard rather than treating
the tool as unquestionable authority.
