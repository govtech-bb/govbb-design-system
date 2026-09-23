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

- Normal text needs 4.5:1; large text needs 3:1.
- Large means at least 24 CSS px regular or 14pt bold (approximately 18.67 CSS
  px). Measure actual size/weight; a token name or heading level proves neither.
- Relevant control boundaries, meaningful graphics and authored focus
  indicators need 3:1 under SC 1.4.11. Read its applicability and exceptions
  before reporting a particular visual boundary as required.

Pass the actual `--size` and `--weight`, or `--non-text`. With no size, the
helper applies the stricter normal-text threshold. Inspect what it reports;
do not round a failing contrast ratio up to a pass.

## Check the real pairing

Check text on its actual background, including error tints and local overrides.
The same colour may pass on one surface and fail on another. For focus rings,
inspect the complete indicator, control and surrounding page; a single token
pair is not enough to decide whether a multi-colour indicator meets the
requirement. Use [W3C's non-text contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
for adjacent colours and the relevant component state. Do not silently apply
AAA Focus Appearance requirements as AA failures.

Read which tokens a control's border and focus styles actually use. A palette
pairing is evidence only for that pair; it does not prove every control passes.
Route a confirmed shared-token/component defect to the design system, and a
service override to the service. External issue creation requires authorization.

For text over images, gradients or transparency, determine the actual backdrop
and composite it before computing. The helper rejects alpha-channel colours
because the backdrop is unknown. If it cannot be established, mark the case
`needs-manual-test`; an axe `incomplete` result is not a pass.

Inactive controls, purely decorative graphics and logo text have relevant
contrast exemptions. Separate a usability concern from a claimed contrast
failure when an exemption applies.

## Reproducible findings

Record the source of the colours (rendered styles or named package/version),
actual values, command, returned ratio and applicable threshold. For text,
include rendered size and weight; for a non-text finding, identify the required
visual information and adjacent background. If a helper result appears wrong,
check the inputs and implementation against the standard rather than treating
the tool as unquestionable authority.
