# 4. We do not benchmark design-system skills against a no-skill baseline

**Date:** 2026-08-12
**Status:** Accepted

## Context

`design-system-compliance` shipped with an eval harness, following
[docs/plans/ai-skills.md](../plans/ai-skills.md) §9: three cases in an
`evals.json`, a 500-line mechanical grader, and a comparison run by
`skill-creator` that spawns two agents per case — one given the skill, one not
— and scores both against the same assertions. The delta between them was
meant to be the evidence for promoting a skill from `experimental` to
`supported`.

It never produced one. Over two iterations it reported a delta of zero, and
that number turned out to mean two entirely different things.

**The first zero was a lie.** The outputs differed enormously: the baseline
built working `Tabs`, `Switch` and `ConfirmDialog` components — the three
interfaces the design system deliberately omits, and the exact failure the case
exists to catch — while the skill run recorded them as gaps and built none.
34 distinct `govbb-` classes against 175. The harness scored both 12/12. The
trap assertion tested four literal class-name spellings (`govbb-tabs`,
`govbb-modal`, …) which the baseline had never typed, because it used its own
class names. It passed while doing the thing.

The review case was no better: its fixture listed all ten planted violations,
with the correct answer for each, in a comment at the top of the file under
review. The baseline scored 13/13 by reading the first twenty lines of its own
input.

Both were repaired — detection by ARIA contract and component identity rather
than by spelling, and the answer key moved out of the fixture.

**The second zero was true.** On the repaired harness both cases came back
12/12 against 12/12 and 13/13 against 13/13, and this time the outputs agreed
with the scores. The baseline built no tabs, no modal and no switch, routing
all three correctly by citing `patterns/forms.md` ("do not hide required
questions in collapsed sections"), `patterns/check-answers.md` and
`components/checkbox.md`. On the review case it extracted all 158 real class
selectors from `packages/frontend/src/` and found every planted violation
unaided.

## Decision

We do not build with-skill/without-skill eval harnesses for the skills in
`skills/`. The harness is removed rather than maintained.

**The comparison cannot discriminate, by construction.** Both arms are the same
model reading the same documentation. A skill eval separates them only when the
skill supplies something the model cannot derive on its own — and these skills
mostly instruct Claude to _look things up in the design system_, which Claude
does anyway once the docs are in front of it. Restricting the baseline's access
to manufacture a delta would measure the handicap, not the skill.

This is not a claim that the skills are worthless. Where the runs did differ —
30 against 8 distinct `govbb-` classes in shipped code, and the skill run
declining to name Status banner as the substitute for the invented
`govbb-alert`, because that component's guidance rules out routine notices —
no assertion measured it, and the grader marked both arms correct for opposite
reasons. What the skill changes is depth and honesty of routing, which is not
what a pass/fail assertion sees.

**Evidence for promotion comes from use.** Plan §8 already gates
`experimental` → `supported` on a named owner running the skill on real work in
its first fortnight, and that is what found everything that mattered in the
first week: `@govtech-bb/react` shipping no `'use client'` directives, Date
input's HTML and React wrappers posting two different server contracts, and
npm `latest` sitting five releases behind `alpha` on both packages. None of it
came from a score.

## Consequences

The `evals/` directory is gone, including the review fixture. The fixture was
kept for one commit as a manual spot-check and then removed too, for the same
reason as the rest: today's baseline found all ten of its planted violations
without the skill, so a pass proves only that Claude can read a stylesheet. Its
answer key had also already drifted — it named Status banner as the fix for
`govbb-alert`, which is wrong — and a known-answer test with wrong answers is
worse than none. Everything it checked is taught in
`skills/design-system-compliance/references/anti-patterns.md`, which names the
same categories and ships where it is used.

`skill-creator` remains useful for scaffolding a skill and for benchmarking
whether its description triggers correctly, which matters with four adjacent
skills. It is the comparative grading we are not using.

**Two rules survive for any instrument we do build later**, each learned from a
check in this harness that passed while examining the wrong thing — six were
found in total, and not one failed loudly:

- **An instrument that nothing tests is measuring nothing.** If a script
  decides whether the work is good, something must decide whether the script is
  right, and it must be able to fail.
- **Never put the answer key in the artefact under test.** A fixture listing
  its own planted defects measures reading, not detection.

The others are worth naming, because they are the same mistake in different
clothes: a layout reproducer run against an unstyled page; a focus walk
counting a fully transparent shadow as a focus ring; a grader comparing two
empty sets and reporting a pass; an immutability check hashing a hardcoded path
that existed on one machine.

If a future skill does encode something the model cannot derive — a policy, a
threshold, an internal convention with no public documentation — a benchmark
may become meaningful again. Revisit this then, and read the failure list above
before trusting any number it produces.
