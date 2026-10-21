---
name: accessibility-review
description: >-
  Review pages, components or service journeys against the WCAG conformance
  target on the GovBB Design System's accessibility page and GovBB
  accessibility contracts, separating verified findings from judgement and
  manual testing. Use when an accessibility review is requested or a specific
  accessibility defect needs investigation, not for unrelated UI or repository
  work.
metadata:
  title: Accessibility review
  audience: public
  status: experimental
  requires:
    [
      'Node.js for helpers',
      'Playwright and Chromium for browser checks',
      'axe-core for axe checks',
      'GovBB package or explicit tokens file for token checks',
    ]
---

# Accessibility review

Review the requested surface and states. Keep the user's framework and task
scope; a review does not authorize rewriting the service or publishing issues.
This skill installs independently and requires no other GovBB skill.

## Evidence rules

Every finding states how it is known:

| Tag                 | Evidence                                                                           |
| ------------------- | ---------------------------------------------------------------------------------- |
| `automated`         | Tool name/version, rule ID and affected selector.                                  |
| `computed`          | Actual input values, command, result and applicable threshold.                     |
| `structural`        | Quoted markup/CSS with its file location or live selector.                         |
| `judgement`         | Reasoning about likely user impact, identified as judgement.                       |
| `needs-manual-test` | A check still requiring the actual interaction, condition or assistive technology. |

Never infer a passing contrast ratio, screen-reader experience or whole-service
conformance from source alone. A clean automated scan is limited evidence, not
certification. Do not give accessibility scores or percentages. Distinguish
GovBB conventions and usability observations from confirmed WCAG failures.

## Establish scope and sources

Identify the pages/components, states and available evidence from the request
and repository. For a journey review include errors, check answers and
confirmation where available; for a single-component task do not expand to an
unrequested service audit. Start the existing development server when practical,
or state that the review is source-only.

For GovBB interfaces, inspect the rendering stack and resolved package versions.
Fetch `https://design-system.service.alpha.gov.bb/llms.txt`, then only relevant
component, pattern and documentation Markdown pages. Always fetch
`https://design-system.service.alpha.gov.bb/documentation/accessibility.md`: it
states the conformance target services are held to. Read dated design decisions
when they bear on the task; research and notes are not automatically requirements.
The index's versions describe its documentation build. Live guidance is **not**
pinned to the consumer's installed release: verify contracts in its installed
CSS, types and runtime and report differences.

If the index is unavailable, use `/sitemap/` and linked Markdown pages. Offline,
use guidance in a local GovBB checkout (`apps/site/src/content/`, where
`docs/accessibility.md` is the accessibility page) and the consumer's installed
sources. With packages alone, mark missing usage guidance; with neither, review
generic semantics without inventing GovBB guarantees. With no copy of the
accessibility page there is no target: ask the user for the WCAG version and
level. If they cannot say, build the checklist with `--version latest --level
AA`, state in the report that both the version and the level were assumed, and
mark conformance findings as unconfirmed against the target.

## Build the WCAG checklist from the standard

This skill names no WCAG criteria, so it cannot drift from the standard. At the
start of every review, build the checklist from the W3C specification for the
version and level the accessibility page names, writing it outside the
consumer's repository (see [Run the installed helpers](#run-the-installed-helpers)
for `govbb_skill_dir`):

```sh
node "$govbb_skill_dir/scripts/wcag-checklist.mjs" --version <version> --level <level> --out <scratch>/wcag-checklist.md
```

The helper quotes every success criterion at that level and the levels below
it, word for word with its exceptions and notes, leaves out criteria the
specification marks obsolete or removed, and adds the glossary definitions the
criteria use. It prints a count per level, and refuses drafts, a saved copy of
a different version than asked for, and anything it could not parse completely.
Read the file it writes; do not summarise it.

Judge every conformance finding against a criterion's text and glossary terms
in that checklist, and cite it as the checklist does. Understanding documents
and techniques explain the criteria but are not requirements. Never add a
criterion from memory: if a problem matches nothing in the checklist, report it
as a plain defect or a GovBB convention.

If the helper cannot fetch the specification, pass `--file` with a saved copy
when the user has one, keeping `--version` so the copy is checked. Exit status
3 is a usage or write error: fix the command and run it again. Exit status 1
or 2 means there is no checklist: say so in the report with the helper's
message, review GovBB contracts and conventions, and describe any likely WCAG
problem as unconfirmed without citing a criterion.

## Review passes

Run only passes relevant to the requested review, and state any unavailable
checks. Read [component contracts](references/component-contracts.md) before
reviewing GovBB wiring: it covers the consumer's duties by kind of control, and
the GovBB conventions to report separately from criterion failures. It names
what to check, not what WCAG requires; the checklist decides that.

1. **Automated:** run axe on the pages and states in scope, for the version
   and level the checklist was built for. Include violations and unresolved
   `incomplete` results. Record failed scans as not tested, and carry any
   criteria the installed axe has no rules for into the manual checks.
2. **Contracts and semantics:** distinguish installed component guarantees
   from consumer duties. Check labels, grouped controls, accessible names,
   landmarks, page title/language, image alternatives and link purpose. Use
   `/documentation/form-implementation.md` for error associations, summary
   links, submission handling and preserved answers. React wrappers own their
   behaviour; enhanced HTML needs its documented attributes and initialisation.
   Test fallback behaviour before assigning severity to missing enhancement.
3. **Contrast:** compute from rendered colours, size and weight. The token
   helper resolves installed values, not service overrides or the full cascade.
   The contrast helper holds and prints the thresholds. Read
   [contrast guidance](references/govbb-contrast.md) for backgrounds,
   exceptions and reproducible evidence.
4. **Keyboard and focus:** inspect focus order, reachability, visible focus,
   overlay dismissal and task completion. The focus helper reports heuristics,
   including centre-point occlusion; confirm the actual barrier before calling
   it a WCAG failure, and find the checklist criterion that covers it, if
   any.
5. **Content and recovery:** check error messages, time limits, preserved
   answers and sign-in against the checklist and the contracts. Tag usability
   judgements separately from conformance findings.
6. **Checklist coverage:** go through every criterion in the checklist,
   whatever axe reported. Mark each one checked, not applicable to the surface
   reviewed, or still needing a manual test, and carry the untested ones into
   the manual-test tasks.
7. **Assistive technology:** record what still needs a person using a screen
   reader or voice control, and any states not reached. Do not claim that a
   browser script verifies assistive-technology announcement quality.

For repeated defects, find a shared layout, component or published example
before producing several copies of the same finding. Report one root cause
with its affected locations and the owner able to fix it.

## Run the installed helpers

Keep the working directory at the **consumer project**, using the relevant
workspace package when needed. Resolve this installed skill's absolute directory
and call its scripts there; do not change into the skill directory:

```sh
# Set this to the actual installed skill directory.
govbb_skill_dir=/absolute/path/to/accessibility-review
node "$govbb_skill_dir/scripts/axe-scan.mjs" http://localhost:4321/ --version <version> --level <level>
node "$govbb_skill_dir/scripts/focus-order.mjs" http://localhost:4321/ --max-tabs 40
node "$govbb_skill_dir/scripts/contrast.mjs" govbb-color-interactive govbb-color-surface
node "$govbb_skill_dir/scripts/contrast.mjs" "#595959" "#ffffff" --size 16 --weight normal
```

All scripts need Node.js; the checklist helper also needs network access or
`--file`. Browser passes need Playwright plus its Chromium
browser; axe additionally needs `axe-core`. Helpers resolve these from the
consumer project/workspace. Token lookup uses the installed frontend package's
exported `tokens.css`; `--tokens-file` supplies an explicit file. Hex-only
contrast checks need no GovBB installation. `--tokens` checks palette pairings,
not every rendered component. Use `--help` for options.

Use existing project tooling or install prerequisites within the task's
permission boundaries. Missing dependencies, browser binaries, network access
or a running page must produce a clear **not tested** limitation, never a pass.

## Report

Start with scope/states, the conformance target quoted from the accessibility
page and whether the live or a local copy was read (or that neither was
available), the specification the checklist was built from, evidence actually obtained, installed versions when relevant, and
what was not covered. Order findings by user impact: blocks a task, degrades the
experience, then minor. Preserve every confirmed finding; compress wording
rather than omitting evidence.

Each numbered finding includes:

- **Criterion or convention, method tag, owner:** `service` or `design system`.
- **Where and what:** file/line or URL/selector, with evidence quoted once.
- **Impact and fix:** the affected task and the smallest actionable correction.
  A corrected snippet can clarify a finding without editing the service.

Keep numbers stable during a re-review and mark `new`, `still present` or
`fixed`. Group repeated manifestations under their shared cause. Mention correct
behaviour only when it prevents a likely false finding. Finish with concrete
manual-test tasks; include the full criterion-coverage list only when
requested.

Usability observations can appear separately when relevant, without depending
on another skill. Fix service files only when fixes are part of the user's task.
A review is not a formal certification; do not weaken a verified system defect
or ask a service team to conceal it with local overrides.

If issue creation is requested, use the authorized repositories, inspect labels,
search existing issues and group by root-cause fix. Carry method/evidence and
finding numbers into each issue. Request missing authorization only once;
do not file unverified manual-test tasks as confirmed defects.

## Installation

The website's skill Markdown page previews this entrypoint. To install its
references and helpers as well:

```sh
npx skills add govtech-bb/govbb-design-system --skill accessibility-review
```
