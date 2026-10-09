---
name: design-critique
description: >
  Critique a running Government of Barbados service or prototype by walking its
  journey under six different user constraints — enlarged text, small screen,
  no JavaScript, a dropped connection, speed, and the accessibility tree — then
  report where each one got stuck, with evidence. Use this whenever someone asks
  what is wrong with a design, wants a design or UX critique, review, walkthrough
  or "fresh eyes" on a prototype, asks whether a journey is confusing, hard to
  follow or too long, wonders how a real user would cope with it, wants to know
  what to fix before user research, or asks you to try a service as a particular
  kind of person — even if they never say the word "critique". Also use it when
  someone asks whether a page works on mobile or without JavaScript, and when the
  user invokes /govbb:design-critique. For conformance questions — WCAG, contrast
  ratios, audit readiness — use accessibility-review instead.
metadata:
  title: Design critique
  audience: public
  status: experimental
  requires: ['node', 'playwright', 'a running instance of the service']
---

# Design critique

Walk a service's journey under six constraints and report where it breaks down.

## The one discipline that makes this critique worth reading

**Never report an experience you did not have.** This skill produces
model-simulated findings from a headless browser. It is a cheap filter for
problems that are obvious once someone actually tries the thing — not user
research, and it must never be presented as if Barbadians had used the service.

Two overclaims are easy to make here and both are wrong:

| Tempting to write                 | What was actually tested                                                                                                                                                                                 |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "Works fine on a slow connection" | Nothing throttles bandwidth. The personas test JavaScript blocked and network dropped — not slow.                                                                                                        |
| "Works with a screen reader"      | `ariaSnapshot()` returns the accessibility _tree_. It shows whether a name, role or state is exposed at all. Announcement order, live regions and verbosity need a real screen reader and a real person. |

So every finding cites the persona that hit it, the step number where it
happened, and the screenshot. A finding you cannot point at is a guess, and a
guess in a critique report gets repeated in a meeting as though it were
evidence.

**Findings route to `needs-real-users` when they are about preference, comprehension
or trust.** Whether someone understands "contributory service" or trusts a
service with their National ID is not observable from here. Saying so is more
useful than inventing a verdict.

## Step 1 — Get it running, or stop

Critique needs a URL. Ask for one, or start the service yourself if the repo
makes that obvious (`pnpm dev`, `npm start`, a static server over the folder).

**If it cannot be run, stop and say so.** Reading source and describing the
experience someone would have is not critique — it is speculation dressed as
observation, and it is wrong often enough to be dangerous. Offer the alternative
instead: `design-system-compliance` reviews the code, and
`accessibility-review` covers conformance.

Confirm the URL responds before going further.

## Step 2 — Write down the task, then the journey

A critique with no task is a tour. Ask what the user is trying to _do_: "renew a
business licence", "find out what pension I would get". One sentence, in the
user's words, not the service's.

Then express the journey as steps the script can replay. Keep it to the
happy path first — the shortest route to the thing the user came for:

```json
[
  { "do": "look", "note": "landing page" },
  { "do": "click", "role": "link", "name": "Start now" },
  { "do": "fill", "label": "National ID number", "value": "123456-7890" },
  { "do": "click", "role": "button", "name": "Continue" },
  { "do": "look", "note": "check answers" }
]
```

Prefer `role` + `name` over CSS selectors. That is how an assistive technology
finds a control, so a step you cannot express that way has already told you
something: the control has no accessible name.

## Step 3 — Run the personas

```sh
node scripts/persona-run.mjs <url> --journey journey.json --task "<the task>" --out critique-run
```

Six personas run in parallel, each in an isolated browser context so nothing one
does leaks into another's session. Run `--list-personas` to see what each one
tests and — equally important — what it cannot conclude.

They are **constraints, not personalities**. A caricature ("impatient Bob")
produces caricatured findings; a viewport, a JavaScript policy and a network
state produce reproducible ones. Read `references/personas.md` for what each
constraint is standing in for and how to write its findings honestly.

The script writes per-persona screenshots, an accessibility tree for the screen
reader persona, console errors, and the step where each persona stopped.

**A persona that stops is the most valuable output you will get.** Do not
smooth it over. "The offline persona reached a browser error page at step 2" is
a finding; "the service mostly works" is not.

## Step 4 — Read the evidence, one persona at a time

Open each persona's `observations.json` and its screenshots. Resist synthesising
early — the point of running six blind personas is that they disagree, and
overlap between them is signal about severity rather than noise to be collapsed.

For each persona ask:

- Where did it stop, and what did the user see at that moment?
- What was on screen that the task needed, and what was missing or below the fold?
- Did the page tell the user what had gone wrong, or did the browser?
- For the screen reader persona: is every control in the tree with a name and a
  role? Is the error message in the tree at all?

Look at the screenshots. The enlarged-text and 360px personas fail _visually_ —
overlapping text, a button pushed off-screen, a form that reflows into a column
nobody designed — and none of that is in the JSON.

## Step 5 — Check the findings against the system's own decisions

Before writing up, resolve what the design system already says about the thing
you are about to criticise. Fetch the relevant guidance live rather than
recalling it — the `.md` twin of any page on the design system site is
machine-readable, and the design log records decisions that are binding.

This matters in both directions:

- A journey that spreads one question per page is following
  `/design-log/short-pages/`, not padding. Criticising it would put a team in
  conflict with a settled decision.
- A service that invented its own component to avoid a long journey has a
  design-system problem, not a service problem, and it routes differently.

## Step 6 — Synthesise

Now collapse the six into one report.

1. **Deduplicate.** The same defect will surface differently per persona. State
   it once, and list which personas hit it.
2. **Promote anything three or more personas hit.** Independent constraints
   converging on one thing is the strongest signal this method produces.
3. **Split by owner.** A problem with a design system component routes to a
   design log entry or a component issue. A problem with this service's content,
   journey or wiring routes to the team. Do not hand a service team a fix they
   cannot make.
4. **Separate what needs real users** from what you observed.

## Report format

Lead with what stopped someone. Keep each finding short — the value is in the
evidence, not the prose around it.

```markdown
# Design critique: <service> — <the task>

Model-simulated walkthrough, not user research. Six personas ran the journey in
a headless browser on <date>. Findings are a filter for obvious problems before
research with real users, not a substitute for it.

**Not tested:** connection speed (no throttling), screen reader announcement
order, on-screen keyboard occlusion.

## Summary

<Two or three sentences: did anyone complete the task, and what stopped those who didn't.>

## Stopped someone

### 1 · <Short title>

**Hit by:** offline-user, js-blocked-user · **Step 3** · `critique-run/offline-user/step-3.png`
**What happened:** <what the persona saw>
**Why it matters:** <consequence for the user's task>
**Owner:** service | design system
**Suggested fix:** <smallest change that would have let them through>

## Made the task harder

## Worth a look

## Needs real users

<Comprehension, trust and preference questions this method cannot settle.>

## What the system already decides

<Anything that looked wrong but is a binding design-log decision, so nobody "fixes" it.>
```

## Boundaries

- **Not user research, and never cited as it.** Say so at the top of every
  report. This is a pre-research filter for problems obvious enough that a
  headless browser trips over them.
- **Usability, not conformance.** If the finding is that something fails WCAG,
  that is `accessibility-review`'s call. The screen reader persona here will
  surface things that are also conformance failures — name the experience and
  defer the verdict, rather than issuing two contradictory ones.
- **Critique the journey, not the code.** If the underlying problem is invented
  classes or a lookalike component, that is `design-system-compliance`.
- **Do not fix the service.** Suggest the smallest change in the finding.
  Editing the team's files is a separate job, done only when asked.
- **Do not invent severity.** "Three personas hit it" is evidence. "Users will
  abandon" is a claim about people you did not observe.

## References

- `references/personas.md` — what each of the six constraints stands in for,
  what it can and cannot show, and the failure modes to watch for in its output.

## Scripts

- `scripts/persona-run.mjs` — runs the journey once per persona in parallel
  isolated contexts, capturing screenshots, accessibility trees, console errors
  and the step each persona stopped at. `--help` for options,
  `--list-personas` for the six and their limits.
