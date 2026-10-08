---
name: design-system-compliance
description: >-
  Build, convert or review Government of Barbados interfaces using the GovBB
  Design System (@govtech-bb/frontend and @govtech-bb/react). Use for requested
  GovBB UI work or design-system compliance reviews, not unrelated work in a
  repository that happens to depend on these packages.
metadata:
  title: Design system compliance
  audience: public
  status: experimental
  requires:
    [
      'GovBB documentation or local source',
      'Node.js for helpers',
      'Playwright and Chromium for browser checks',
    ]
---

# GovBB Design System compliance

Use published components, patterns and tokens, preserving the user's framework,
service behaviour and requested scope. A review reports findings; it does not
imply permission to migrate the application or rewrite unrelated pages.

## Establish the target and sources

1. Inspect the application's rendering stack, dependency manifest and lockfile.
   Record the installed GovBB versions. React rendering uses `@govtech-bb/react`
   wrappers; other renderers use `@govtech-bb/frontend` HTML. Tailwind or CSS
   modules do not determine that choice.
2. Fetch `https://design-system.service.alpha.gov.bb/llms.txt`, then only the
   linked Markdown pages relevant to the task. Read
   [looking things up](references/looking-things-up.md) for version checks,
   design decisions and offline fallback. The index's package versions identify
   its documentation build, not the versions installed in the consumer.
3. Verify every API, `govbb-` class and `--govbb-` token against the installed
   package before using it. Live documentation supplies guidance but may describe
   a newer release. Record differences; do not silently upgrade dependencies or
   copy unsupported props. For a new install, check the current adoption guide
   and npm dist-tags, use the project's package manager, and inspect the resolved
   version. Never assume what `latest` or `alpha` currently means.

The documentation site is a guide, not a reference service to copy pixel for
pixel. Check its relevant patterns, templates and dated decisions, and derive
service spacing from the consumer's installed CSS.

## Build or convert within scope

For a conversion, inventory distinct behaviours on the affected surface and map
those to a component, pattern/template, or genuine gap. Match behaviour rather
than names, and read a candidate's usage guidance before choosing it. For a new
page, begin with its template. Read the
[conversion checklist](references/conversion-checklist.md) for either workflow.

Work from page scaffold and landmarks to form controls, content, then bespoke
parts. Copy the documented HTML or React example and verify it against the
installed package. Preserve label associations, hint/error IDs, error-summary
links, form values and submission behaviour. Do not drop an interaction just
because no component fits; compose supported parts or report the gap.

Use semantic tokens and inspect existing margins before adding spacing. Scope
service CSS to service-owned classes. Preserve supported Tailwind integration:
check whether the installed frontend package exports `./tailwind`, and use its
published theme guidance or token-based arbitrary values. Removing Tailwind,
changing routing or replacing the rendering framework requires that work to be
part of the user's request.

Preserve progressive enhancement and test the no-JavaScript experience. If an
existing architecture limits it, report the actual impact and a possible remedy;
do not turn an interface task into an unsolicited framework migration. For
new service architecture, prefer rendering meaningful HTML on the server.

## Wire behaviour for the rendering target

Import `@govtech-bb/frontend/css` once at the application root. For HTML
components that need enhancement, copy the documented `data-govbb-module` and
initialise after their DOM exists:

```js
import { initAll } from '@govtech-bb/frontend';
initAll();
```

Read the installed runtime and component guidance to determine which components
need it. React wrappers own their behaviour: do not initialise them again with
`initAll()`. Hand-written enhanced HTML inside React may need initialisation
scoped to its containing subtree, using the application's lifecycle and the
installed package's cleanup contract. Verify actual interactions, including
mobile navigation and any dynamically inserted controls.

## Verify the result

Run the consumer project's relevant checks and inspect the affected pages at
360px and 1280px. Follow the task journey in the browser, including errors,
Back/Change links and confirmation; repeat meaningful steps without JavaScript.
Check keyboard use and form associations. Read
[anti-patterns](references/anti-patterns.md) when investigating a mismatch.

Helpers are optional instruments, not a replacement for interaction checks.
Run them from the **consumer project directory**, including the relevant
workspace package when dependencies live there. Resolve this installed skill's
absolute directory and invoke scripts from it; do not change into the skill:

```sh
# Set this to the actual installed skill directory.
govbb_skill_dir=/absolute/path/to/design-system-compliance
node "$govbb_skill_dir/scripts/audit-classes.mjs" ./src
node "$govbb_skill_dir/scripts/layout-check.mjs" http://localhost:4321/
node "$govbb_skill_dir/scripts/module-check.mjs" http://localhost:4321/
node "$govbb_skill_dir/scripts/pe-check.mjs" http://localhost:4321/
```

| Helper              | Evidence and limits                                                                                                              |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `audit-classes.mjs` | Resolves names against consumer CSS; `--css` supplies an explicit stylesheet. Existing names alone do not prove selectors match. |
| `layout-check.mjs`  | Checks landmarks, skip-link target and overflow; does not replace visual review.                                                 |
| `module-check.mjs`  | Checks declared modules were processed. Missing `data-govbb-module` attributes require source/interaction checks.                |
| `pe-check.mjs`      | Compares pages with JavaScript on/off; does not prove a whole form journey works.                                                |

All helpers need Node.js; browser helpers also need Playwright and its Chromium
browser available to the consumer project. Use the project's existing tooling
or install the missing prerequisites within the task's permission boundaries.
An unavailable dependency, browser or page is **not tested**, never a pass.
Each helper supports `--help`.

## Report

State the target, installed versions and sources used. Summarise changes or
review findings, checks actually run and what was not tested. List real gaps
and deliberate deviations with the affected element, reason and suggested owner
(service or design system). Report version mismatches separately from unsupported
components; an older consumer is not proof that a published component is invented.
Do not invent gaps to fill a report or create external issues without authorization.

## Installation

The website's skill Markdown page previews this entrypoint; it does not install
references or helpers. Install the complete, independent skill with:

```sh
npx skills add govtech-bb/govbb-design-system --skill design-system-compliance
```
