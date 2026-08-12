# Skill evals

Test cases for the AI skills in [`skills/`](../skills). One directory per
skill, each holding an `evals.json` of prompts with assertions, plus any
fixtures those prompts need.

- [`design-system-compliance/`](./design-system-compliance) — three cases:
  converting an HTML prototype, scaffolding a React app that asks for three
  components the system deliberately does not have, and reviewing a page
  seeded with known violations.

## Running them

**Run `pnpm test:evals` before you start an iteration.** It takes seconds and
tests the grader, which is the thing most likely to be quietly wrong — see
[Grading the grader](#grading-the-grader). This is not in CI on purpose: the
grader has one consumer, a human running an iteration, and that is the only
moment its correctness matters.

The `skill-creator` skill drives the runs — it spawns a with-skill and a
baseline agent per case, grades the assertions and opens a viewer. Ask it to
run the evals for a skill and point it at the `evals.json`; there is no runner
in this repository and there should not be one.

Paths inside `evals.json` are relative to the file itself, so `files` entries
read `fixtures/review-me.html`. A prompt that names a fixture uses a
repo-relative path instead, because that is what a user would type.

## Grading

`design-system-compliance/grade.mjs` decides the mechanical assertions; the
judgement ones are left for the viewer. It needs three things, and says so
rather than guessing when one is missing:

```sh
pnpm --filter @govtech-bb/frontend build      # dist/govbb.css — see below
node evals/design-system-compliance/grade.mjs <iteration-dir> \
  --pension-dir /path/to/pension-calculator
```

- **The built stylesheet.** Every name-resolution assertion is decided against
  `packages/frontend/dist/govbb.css`, and `dist/` is gitignored. A missing build
  would not weaken those assertions, it would invert them — marking every real
  class invented — so the grader exits rather than grade against nothing.
- **The conversion prototype**, via `--pension-dir` or `PENSION_DIR`. It lives
  outside this repository so its path cannot be derived. Absent, the
  "left unmodified" assertion reports that it could not be checked; it used to
  compare two empty sets and pass.
- **`/tmp/live.css`**, optionally — the deployed stylesheet (override the path
  with `LIVE_CSS`). Without it, classes that exist only on the deployed site
  score as invented, so runs with and without it are not comparable. The grader
  warns when it is absent, and **exits** when the file is present but is not a
  stylesheet: fetching it from the obvious URL returns the homepage HTML, which
  defines no rules and would silently grade every site-only class as invented.

Baselines (`fixture-hash-before.txt`, `pension-hash-before.txt`) are recorded in
the iteration directory before the runs. Write them as `hash  path` per line:
paths are what let the grader distinguish a rename from an untouched file.

## The review fixture is deliberately broken

`design-system-compliance/fixtures/review-me.html` contains ten planted
violations — invented classes, an invented token, missing module wiring,
hardcoded values. It is the input to a review case, not a sample of correct
markup. Do not fix it, and do not copy from it; changing it invalidates the
assertions that count the violations found.

**What is planted is recorded in the `PLANTED` table in `grade.mjs`, and
nowhere near the fixture.** It used to be listed in the fixture's own header
comment, complete with the real answer for each one — so a reviewer scored full
marks by reading the top of the file it had been asked to examine, and the
baseline did exactly that. Never put the answer key in the artefact under test.

## Grading the grader

`design-system-compliance/grade.test.mjs` tests the grader itself:

```sh
node evals/design-system-compliance/grade.test.mjs
```

This is not ceremony. Six checks in this harness were found passing while
examining the wrong thing — a layout reproducer run against an unstyled page, a
focus walk counting a transparent shadow, a comparison of two empty sets, a
trap assertion matching strings nobody typed, and a fixture handing over its
answers. None failed loudly; the evals they fed reported a confident zero
delta between the skill and the baseline while the outputs differed enormously.

Each test replays one of those failures and asserts the grader now separates
the two configurations. **Add a case here whenever you add an assertion**: an
assertion nothing exercises is a claim about the skill that nothing checks.

## Why they live here and not in the skill

`skills/` is the plugin root (`skills/.claude-plugin/plugin.json` declares
`"skills": ["./"]`), so everything inside a skill's own directory is copied onto
a user's machine when they install it. Evals are development scaffolding, and
the review fixture is full of `govbb-` names the design system does not have —
shipping it would present invented classes to users as though they were real.
Keeping the evals outside `skills/` is the point of this directory. Please
don't move them back.
