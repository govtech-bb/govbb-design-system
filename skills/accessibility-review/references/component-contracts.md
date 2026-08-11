# Component accessibility contracts

How to work out, for any component in front of you, which half of the contract a
problem belongs to:

- **The design system's half** — what the component guarantees. Not a finding
  against the service. If it is genuinely broken, it is a finding against the
  design system, filed as an issue there.
- **The consumer's half** — what the service must wire up itself. This is where
  nearly all real findings are.

## Why this file does not list the components

An earlier version of this file enumerated every component, which JS modules
existed, and what each one guaranteed. That was wrong in a way worth
understanding, because the same temptation will recur.

Those are all facts about the design system **as it was on the day the file was
written**. Components get added, tokens get renamed, a component gains or loses a
JS module. When that happens an enumerated list does not throw an error — it
quietly starts giving wrong answers, in the most dangerous direction: a review
built on it stops checking whatever was added since, and clears whatever was
changed. A reviewer trusting a fixed list of "the components that need wiring"
will not notice
the fourth.

So this file carries **method and durable requirements**. Anything about the
design system's current state gets read from the system itself, every time.

## Deriving the design system's half

Three sources, in order of authority. Paths shift as the packages evolve, so each
is described by what it is — if a location below is empty, find the equivalent
rather than assuming the thing no longer exists.

1. **The progressive-enhancement runtime's registry** — the frontend package's
   entry point maps each module attribute value to the class that upgrades it, and
   exports the init function that scans for them. The only authoritative answer to
   "which components need JavaScript wiring". Read it; do not recall it. Currently
   `packages/frontend/index.js`; otherwise follow the package's `main` export.
2. **The component's stylesheet** — what it actually guarantees about focus,
   borders, hit area, forced-colors handling and disabled state. Currently one
   directory per component under `packages/frontend/src/components/`. Shared
   behaviour (focus rings, base styles, tokens) lives in sibling files at the
   package's style root rather than per component, so read those too before
   concluding a component omits something.
3. **The published guidance**, `/components/<name>.md` on the docs site. Every
   page has a raw-markdown twin at that `.md` URL, so it can be read directly.
   Prefer this over the repo where both cover the same ground: it is what service
   teams are working from, and it is versioned with the release they installed.

For form behaviour specifically, `/documentation/form-implementation.md` is the
canonical contract — labels, error connection, error-summary behaviour,
validation flow, submission state. Check the service against **what that page
currently says**, not against a summary of it. If the service and that page
disagree, the page wins; if the page and WCAG disagree, WCAG wins and that is a
finding against the design system.

Two habits that keep this pass honest:

- **Read the component's CSS before claiming it lacks something.** Design systems
  routinely handle forced-colors modes, focus rings and reduced motion in shared
  files. Raising one of those as a service finding is the fastest way to lose a
  team's attention.
- **Check both consumer targets.** A component may be wired correctly in the
  HTML/server-rendered idiom and incorrectly in React, or vice versa. React
  wrappers typically carry their own behaviour and wire generated IDs
  automatically, so the checks that matter there are about props passed, not
  attributes present. Confirm which idiom the service uses first — the guidance
  page and the wrapper source say what each provides.

## Deriving the consumer's half

The rest of this file is organised by **kind of control**, not by component name.
A text field is a text field whatever the design system calls it this year, and
the duties below come from WCAG and from HTML and ARIA semantics — so they hold
regardless of how the design system changes.

For each kind: what the service must do, and the criterion it hangs on.

### Any control that collects a value

- An accessible name, from a real `<label for>`, a `<legend>`, or `aria-label`
  where no visible label exists (SC 3.3.2, 4.1.2). **Placeholder text is not a
  label** — it disappears on entry, is often low-contrast, and is not reliably
  announced.
- A `name` attribute, or the value never reaches a normal submission.
- `autocomplete` where a token exists for the data — name, email, tel, address,
  postal code, birthday (SC 1.3.5). Cheap, and routinely missed.
- A `type` matching the data, so touch keyboards are useful.
- Enough hit area: 24×24px minimum, or spacing that keeps a 24px circle on each
  target from overlapping its neighbour (SC 2.5.8). Inline links in prose are
  exempt.

### A group of related controls

- A `<fieldset>` with a `<legend>` around the group (SC 1.3.1, 3.3.2). This is
  the most common real defect in government forms: individually labelled radios
  with no legend leave someone with a list of options and no idea what the
  question was.
- Controls in one group share a `name` — that is what makes them one group to
  the browser and to assistive technology.
- No pre-selected option where the answer matters. It biases the response and
  hides that no choice was made.

### An error on a control

- Connected **programmatically**, not just visually: `aria-describedby` on the
  control pointing at the message's `id`, and `aria-invalid` on the control
  (SC 1.3.1, 3.3.1). Red text alone is not a connection.
- Announced if it appears after the initial render — a live region, or focus
  moved somewhere that conveys it (SC 4.1.3).
- Worded so someone can recover: what to do, not what went wrong (SC 3.3.3).
  "Enter an email address in the correct format, like name@example.com" over
  "Invalid email".
- Not signalled by colour alone (SC 1.4.1).

### A failed form submission

The highest-yield check in a review of any form-based service, and the one most
often broken. Read the current requirements in
`/documentation/form-implementation.md`, then verify against the running service:

- The person is told the submission failed **without having to hunt for it**.
  Focus must land somewhere that conveys the failure (SC 3.3.1). A submit that
  appears to do nothing is a blocker.
- Every error is reachable from that summary, and each link reaches the control
  that caused it.
- Entered values are preserved. Losing part-completed answers is a serious harm
  in a government service, not an inconvenience.
- The summary is not present before anything has failed.

### A component that needs JavaScript to reach its final form

- The wiring the design system expects — for the HTML idiom that means the
  `data-govbb-module` attribute on the element **and** an init call that runs on
  every page; for React it means using the wrapper rather than doing both.
- Check the **unenhanced** state as well. A component that degrades to a native
  control is usually acceptable and sometimes deliberate; a component that
  degrades to something unreachable is a blocker. Read the module's source to
  see which it is rather than assuming.
- Severity follows the actual barrier: missing wiring where the fallback is a
  working native control is a defect, not a blocker. Say which you found.

### Anything hand-built rather than native

- Name, role and value exposed, and state kept in sync — `aria-expanded`,
  `aria-current`, `aria-invalid` (SC 4.1.2). Native elements give this for free;
  custom widgets are where it breaks.
- Operable by keyboard alone, with a visible focus indicator (SC 2.1.1, 2.4.7).
  A `<div>` with a click handler is the single most common serious defect there
  is.
- Content that is visually hidden must be genuinely hidden — `hidden` or
  `display: none`, not just clipped — or it stays in the tab order and is
  announced.
- No keyboard trap: focus can always leave, and anything that opens can be
  dismissed (SC 2.1.2).

### Navigation and page structure

- A skip link as the **first** focusable element, whose target exists and can
  receive focus. A skip link pointing at a missing ID is worse than none
  (SC 2.4.1).
- Real landmarks — one `<main>`, plus `header`, `nav`, `footer` — and a `<nav>`
  carrying an accessible name where there is more than one.
- The current page marked in any navigation that includes it
  (`aria-current="page"`).
- Link text that describes its destination out of context (SC 2.4.4). A column
  of identical "Change" links on a check-answers page is the classic failure;
  each needs visually hidden text naming what it changes.
- Navigation in the same order on every page, and help in the same relative
  place wherever it appears (SC 3.2.3, 3.2.6).

### High-stakes steps — payment, final submission, anything irreversible

- Reversible, checked, or confirmed before it commits (SC 3.3.4).
- Errors recoverable without re-entering everything (SC 3.3.7).
- Timeouts warned and extendable (SC 2.2.1), and session expiry that does not
  silently destroy entered answers.
- No cognitive test in authentication without an alternative, and paste must work
  in password and code fields (SC 3.3.8).
