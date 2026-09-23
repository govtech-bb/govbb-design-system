# Component accessibility contracts

How to work out, for any component in front of you, which half of the contract a
problem belongs to:

- **The design system's half** — what the component guarantees. Not a finding
  against the service. If it is genuinely broken, it is a finding against the
  design system, reported to that owner. Create an issue only when authorized.
- **The consumer's half** — what the service must wire up itself. Verify this separately from the component itself.

## Derive guarantees from the installed release

Fetch the GovBB `/llms.txt` index, then the relevant component Markdown and
`/documentation/form-implementation.md`. Match that guidance to the consumer's
resolved package versions; the live site is not versioned to each installation.
If offline, use local guidance where available and name any limits.

Inspect these sources before assigning a finding:

1. **Installed frontend runtime:** follow the package's entry export to its
   enhancement registry. It determines the available module names and how
   initialisation works; do not keep a remembered list.
2. **Installed CSS and tokens:** inspect component rules plus shared base,
   focus and utility rules. A service may already receive forced-colors or
   reduced-motion support from these files. Check the rendered cascade before
   attributing a failure to the core component.
3. **Installed React wrapper types/source:** check what props and generated IDs
   it supplies. React wrappers own behaviour; handwritten enhanced HTML needs
   the documented initialisation, scoped away from those wrappers.
4. **Relevant published guidance:** check intended usage and consumer duties.
   Record mismatches with installed code, distinguishing a version difference
   from a documentation defect. WCAG requirements take precedence over a
   conflicting recommendation; report the conflict with evidence.

The owning team matters: a defect in shared component code or a published
example belongs to the design system. Service overrides or incorrect wiring
belong to the service. Missing enhancement with a working native fallback is
not automatically a task blocker; severity follows the observed barrier.

## Deriving the consumer's half

Use these checks by control type. Where a particular technique or GovBB
convention is named, distinguish it from WCAG's outcome requirement; do not
report a convention mismatch as a criterion failure without the actual barrier.

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
- Radio buttons in one choice group share a `name`; group labels come from
  semantics such as a `fieldset` and `legend`, not the name attribute alone.
- Check the relevant pattern before preselecting an answer. This is a service
  content/data-quality convention, not automatically a WCAG failure.

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

- Identify each detected error in text (SC 3.3.1). GovBB's failed-submission
  pattern uses an error summary and moves focus to it; verify that technique
  when the service uses it. [SC 3.3.1](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html)
  does not universally require moving focus.
- When an error summary is used, each link reaches the control that caused it.
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
- Closed/inactive content must leave the focus order and accessibility tree.
  Use the component's documented hiding behaviour. Intentionally visually
  hidden labels are different: they should remain available to assistive
  technology.
- No keyboard trap: focus can always leave, and anything that opens can be
  dismissed (SC 2.1.2).

### Navigation and page structure

- Provide a way to [bypass repeated blocks (SC 2.4.1)](https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html). GovBB page templates use
  a skip link as the first focusable element; check its target exists and can
  receive focus. A page without repeated blocks is not automatically a WCAG
  failure because it has no skip link.
- Use meaningful landmarks for the structure that exists: `<main>` for main
  content, and `header`, `nav`, `footer` where those regions are present. Name
  multiple navigation landmarks so they are distinguishable. Do not demand
  extra regions solely to satisfy a checklist.
- The current page marked in any navigation that includes it
  (`aria-current="page"`).
- Link purpose must be clear from its text or programmatically determined
  context (SC 2.4.4). Follow GovBB's summary-list guidance for distinct "Change"
  links, including visually hidden context where the example supplies it.
  [W3C's explanation](https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html)
  distinguishes this from requiring every link to stand alone.
- Navigation in the same order on every page, and help in the same relative
  place wherever it appears (SC 3.2.3, 3.2.6).

### High-stakes steps — payment, final submission, anything irreversible

- Reversible, checked, or confirmed before it commits (SC 3.3.4).
- Errors recoverable without re-entering everything (SC 3.3.7).
- Timeouts warned and extendable (SC 2.2.1), and session expiry that does not
  silently destroy entered answers.
- No cognitive test in authentication without an alternative, and paste must work
  in password and code fields (SC 3.3.8).
