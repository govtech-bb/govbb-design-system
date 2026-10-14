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

- A label that meets SC 3.3.2 Labels or Instructions and an accessible name
  that meets SC 4.1.2 Name, Role, Value. GovBB gets both from a real
  `<label for>` or a `<legend>`. An `aria-label` gives a name but nothing
  visible, so check it against 3.3.2 separately. A placeholder used as the only
  label disappears on entry and is often low-contrast; check it against 3.3.2
  and SC 1.4.3 Contrast (Minimum).
- Where the visible label and the accessible name differ, check SC 2.5.3 Label
  in Name. `aria-label="Submit application"` on a button reading "Continue" is
  the usual failure: a voice control user says what they see and nothing
  happens.
- A `name` attribute, or the value never reaches a normal submission.
- `autocomplete` on fields about the user that match a purpose in SC 1.3.5
  Identify Input Purpose's list of input purposes. Cheap, and routinely missed.
  Check a field against that list before reporting it missing.
- A `type` matching the data, so touch keyboards are useful.
- Enough hit area for SC 2.5.8 Target Size (Minimum), measured at the rendered
  size. Check the criterion's spacing option and exceptions before reporting a
  small target.

### A group of related controls

- The group and its question exposed for SC 1.3.1 Info and Relationships and
  3.3.2. GovBB's technique is a `<fieldset>` with a `<legend>`; another
  technique that exposes the same relationship is a convention mismatch, not a
  failure. A missing group question is the most common real defect in
  government forms: individually labelled radios with no legend leave someone
  with a list of options and no idea what the question was.
- Choosing an option does not move the user on unannounced. An auto-advancing
  radio group is the usual SC 3.2.2 On Input problem in a form service; read
  the criterion's exception before reporting one.
- Radio buttons in one choice group share a `name`; group labels come from
  semantics such as a `fieldset` and `legend`, not the name attribute alone.
- Check the relevant pattern before preselecting an answer. This is a service
  content/data-quality convention, not automatically a WCAG failure.

### An error on a control

- An error message that meets SC 3.3.1 Error Identification, connected
  **programmatically** to its control for SC 1.3.1 Info and Relationships. A
  message linked to its field only by position is the usual 1.3.1 gap. GovBB's
  wiring for the connection is a convention; see below.
- An error that appears after the initial render reaches screen reader users,
  through a live region (check SC 4.1.3 Status Messages) or by moving focus to
  it. A `role="alert"` on every page load trains people to ignore it.
- A message that meets SC 3.3.3 Error Suggestion; read its exceptions before
  reporting one. "Enter an email address in the correct format, like
  name@example.com" over "Invalid email".
- An error state shown by more than colour, for SC 1.4.1 Use of Color.

### A failed form submission

The highest-yield check in a review of any form-based service, and the one most
often broken. Read the current requirements in
`/documentation/form-implementation.md`, then verify against the running service:

- Errors that meet SC 3.3.1 Error Identification. GovBB's failed-submission
  pattern uses an error summary and moves focus to it; verify that technique
  when the service uses it, but read 3.3.1's text before reporting a missing
  focus move as a failure of it.
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

- Name, role and value that meet SC 4.1.2 Name, Role, Value, with state such as
  `aria-expanded` and `aria-current` kept in sync. Native elements give this
  for free; custom widgets are where it breaks.
- Operable by keyboard, with visible focus (SC 2.1.1 Keyboard, SC 2.4.7 Focus
  Visible). A `<div>` with a click handler is the single most common serious
  defect there is.
- Focus order that meets SC 2.4.3 Focus Order. Positive `tabindex` is the usual
  cause of a wrong order.
- Closed/inactive content must leave the focus order and accessibility tree.
  Use the component's documented hiding behaviour. Intentionally visually
  hidden labels are different: they should remain available to assistive
  technology.
- No keyboard trap (SC 2.1.2 No Keyboard Trap). Check too that anything that
  opens can be closed from the keyboard.

### Navigation and page structure

- A way to bypass repeated blocks that meets SC 2.4.1 Bypass Blocks. GovBB page
  templates use a skip link as the first focusable element; check its target
  exists and can receive focus. A missing skip link is a GovBB convention; see
  below.
- Use meaningful landmarks for the structure that exists: `<main>` for main
  content, and `header`, `nav`, `footer` where those regions are present. Name
  multiple navigation landmarks so they are distinguishable. Do not demand
  extra regions solely to satisfy a checklist.
- The current page marked in any navigation that includes it
  (`aria-current="page"`).
- Link purpose that meets SC 2.4.4 Link Purpose (In Context); read how the
  criterion treats a link's context before reporting a link that is unclear on
  its own. Follow GovBB's summary-list guidance for distinct "Change" links,
  including visually hidden context where the example supplies it.
- Navigation and help repeated across pages that meet SC 3.2.3 Consistent
  Navigation and SC 3.2.6 Consistent Help. Compare pages across the journey;
  one page cannot show either.

### High-stakes steps

- Submissions that meet SC 3.3.4 Error Prevention (Legal, Financial, Data)
  where it applies: read its scope, not this heading, to decide which steps it
  covers. A check-answers page is the usual way a form service meets it. Read
  SC 3.3.7 Redundant Entry before reporting the answers it re-displays as
  redundant entry.
- Time limits that meet SC 2.2.1 Timing Adjustable. What a service tells
  people about their answers when a session expires is a GovBB convention; see
  below.
- Authentication that meets SC 3.3.8 Accessible Authentication (Minimum).
  Check that paste works in password and code fields; blocking paste is a
  common way it fails.

## GovBB conventions, not criterion failures

Recommend these, but report them as GovBB guidance rather than WCAG failures
unless the actual barrier also fails a criterion. Check the linked page for what
it currently says.

- Prefix the page title with "Error:" when a page shows validation errors —
  [Error summary](https://design-system.service.alpha.gov.bb/components/error-summary.md).
- Underline links in body content —
  [Link](https://design-system.service.alpha.gov.bb/components/link.md). A link
  told apart from text by colour alone may also fail SC 1.4.1 Use of Color;
  check both.
- Use a skip link on every page that repeats navigation or other content before
  the main task —
  [Skip link](https://design-system.service.alpha.gov.bb/components/skip-link.md).
- Connect hints and error messages to their field with `aria-describedby`, and
  set `aria-invalid` on a field in error —
  [Form implementation](https://design-system.service.alpha.gov.bb/documentation/form-implementation.md).
  Another technique that exposes the same relationship is a convention
  mismatch, not a failure.
- On a question page, make the question the `h1` —
  [Service heading](https://design-system.service.alpha.gov.bb/components/service-heading.md).
- Do not use placeholder text —
  [Why we don't use placeholder text](https://design-system.service.alpha.gov.bb/design-log/placeholder-text.md).
- When a session expires, follow the session-expiry template, including what it
  says about answers that were or were not kept —
  [Session expiry](https://design-system.service.alpha.gov.bb/templates/session-expiry.md).
