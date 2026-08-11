# Skill evals

Test cases for the AI skills in [`skills/`](../skills). One directory per
skill, each holding an `evals.json` of prompts with assertions, plus any
fixtures those prompts need.

- [`design-system-compliance/`](./design-system-compliance) — three cases:
  converting an HTML prototype, scaffolding a React app that asks for three
  components the system deliberately does not have, and reviewing a page
  seeded with known violations.

## Running them

The `skill-creator` skill drives the runs — it spawns a with-skill and a
baseline agent per case, grades the assertions and opens a viewer. Ask it to
run the evals for a skill and point it at the `evals.json`; there is no runner
in this repository and there should not be one.

Paths inside `evals.json` are relative to the file itself, so `files` entries
read `fixtures/review-me.html`. A prompt that names a fixture uses a
repo-relative path instead, because that is what a user would type.

## The review fixture is deliberately broken

`design-system-compliance/fixtures/review-me.html` contains ten planted
violations, listed in its header comment — invented classes, an invented
token, missing module wiring, hardcoded values. It is the input to a review
case, not a sample of correct markup. Do not fix it, and do not copy from it;
changing it invalidates the assertions that count the violations found.

## Why they live here and not in the skill

`skills/` is the plugin root (`skills/.claude-plugin/plugin.json` declares
`"skills": "."`), so everything inside a skill's own directory is copied onto
a user's machine when they install it. Evals are development scaffolding, and
the review fixture is full of `govbb-` names the design system does not have —
shipping it would present invented classes to users as though they were real.
Keeping the evals outside `skills/` is the point of this directory. Please
don't move them back.
