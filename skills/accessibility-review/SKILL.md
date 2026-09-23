---
name: accessibility-review
description: >-
  Review pages, components or service journeys against WCAG 2.2 AA and GovBB
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
component, pattern and documentation Markdown pages. Read dated design decisions
when they bear on the task; research and notes are not automatically requirements.
The index's versions describe its documentation build. Live guidance is **not**
pinned to the consumer's installed release: verify contracts in its installed
CSS, types and runtime and report differences.

If the index is unavailable, use `/sitemap/` and linked Markdown pages. Offline,
use guidance in a local GovBB checkout (`apps/site/src/content/`) and the
consumer's installed sources. With packages alone, mark missing usage guidance;
with neither, review generic semantics without inventing GovBB guarantees.

## Review passes

Run only passes relevant to the requested review, and state any unavailable
checks. Read [component contracts](references/component-contracts.md) before
reviewing GovBB wiring, and [WCAG coverage](references/wcag-22-aa.md) for the
applicable criteria and manual checks.

1. **Automated:** run axe on the pages and states in scope. Include violations
   and unresolved `incomplete` results. Record failed scans as not tested.
2. **Contracts and semantics:** distinguish installed component guarantees
   from consumer duties. Check labels, grouped controls, accessible names,
   landmarks, page title/language, image alternatives and link purpose. Use
   `/documentation/form-implementation.md` for error associations, summary
   links, submission handling and preserved answers. React wrappers own their
   behaviour; enhanced HTML needs its documented attributes and initialisation.
   Test fallback behaviour before assigning severity to missing enhancement.
3. **Contrast:** compute from rendered colours, size and weight. The token
   helper resolves installed values, not service overrides or the full cascade.
   Read [contrast guidance](references/govbb-contrast.md) for thresholds,
   backgrounds and reproducible evidence.
4. **Keyboard and focus:** inspect focus order, reachability, visible focus,
   overlay dismissal and task completion. The focus helper reports heuristics,
   including centre-point occlusion; confirm the actual barrier before calling
   it a WCAG failure. AA SC 2.4.11 concerns a component being entirely obscured,
   so partial overlap alone does not establish that failure.
5. **Content and recovery:** check useful error instructions, information
   conveyed without colour alone, timeouts, preserved answers and accessible
   authentication. Tag usability judgements separately from conformance findings.
6. **Manual coverage:** record checks still needed for screen readers, voice
   control, zoom/text spacing, reflow and any states not reached. Do not claim
   that a browser script verifies assistive-technology announcement quality.

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
node "$govbb_skill_dir/scripts/axe-scan.mjs" http://localhost:4321/
node "$govbb_skill_dir/scripts/focus-order.mjs" http://localhost:4321/ --max-tabs 40
node "$govbb_skill_dir/scripts/contrast.mjs" govbb-color-interactive govbb-color-surface
node "$govbb_skill_dir/scripts/contrast.mjs" "#595959" "#ffffff" --size 16 --weight normal
```

All scripts need Node.js. Browser passes need Playwright plus its Chromium
browser; axe additionally needs `axe-core`. Helpers resolve these from the
consumer project/workspace. Token lookup uses the installed frontend package's
exported `tokens.css`; `--tokens-file` supplies an explicit file. Hex-only
contrast checks need no GovBB installation. `--tokens` checks palette pairings,
not every rendered component. Use `--help` for options.

Use existing project tooling or install prerequisites within the task's
permission boundaries. Missing dependencies, browser binaries, network access
or a running page must produce a clear **not tested** limitation, never a pass.

## Report

Start with scope/states, standard, evidence actually obtained, installed versions
when relevant, and what was not covered. Order findings by user impact: blocks
a task, degrades the experience, then minor. Preserve every confirmed finding;
compress wording rather than omitting evidence.

Each numbered finding includes:

- **Criterion or convention, method tag, owner:** `service` or `design system`.
- **Where and what:** file/line or URL/selector, with evidence quoted once.
- **Impact and fix:** the affected task and the smallest actionable correction.
  A corrected snippet can clarify a finding without editing the service.

Keep numbers stable during a re-review and mark `new`, `still present` or
`fixed`. Group repeated manifestations under their shared cause. Mention correct
behaviour only when it prevents a likely false finding. Finish with concrete
manual-test tasks; include a criterion-coverage table only when requested.

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
