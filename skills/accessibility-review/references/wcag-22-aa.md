# Testing WCAG 2.2 A and AA criteria in a government service

Not a restatement of the specification — a working checklist of **how to test**
each criterion in a form-based government service. The conformance target is
the one the accessibility page states. Use this checklist for the criteria it
covers, and the W3C specification for any criteria the target adds.
Keep GovBB conventions separate from criterion failures.

The `Method` column is the best evidence normally available. If you cannot obtain
it, the finding is `needs-manual-test`, not a pass.

Each criterion links to its W3C Understanding page. The authority on what
passes and what fails is the success criterion's own text, quoted at the top of
that page and in the [WCAG 2.2 specification](https://www.w3.org/TR/WCAG22/);
the rest of the page and its techniques explain it but are not requirements.
Read the criterion before reporting a failure. `Notes` add only
what is specific to GovBB, form services or this skill's tools. If the W3C pages
are unreachable, report a suspected failure as not checked against the
specification.

## Contents

- [1. Perceivable](#1-perceivable)
- [2. Operable](#2-operable)
- [3. Understandable](#3-understandable)
- [4. Robust](#4-robust)
- [GovBB conventions, not criterion failures](#govbb-conventions-not-criterion-failures)
- [Criteria axe cannot help with](#criteria-axe-cannot-help-with)

WCAG 2.2 added six criteria at A and AA, marked **new in 2.2** below. Older
checklists omit them, so include them when reviewing a service that was
previously checked against 2.1.

SC 4.1.1 Parsing was **removed** in WCAG 2.2. Do not report duplicate IDs as a
4.1.1 failure; report them under 4.1.2 where they break an accessible name, or as
a plain defect.

## 1. Perceivable

| Criterion                                  | Level | Method                      | Notes                                                                                                      |
| ------------------------------------------ | ----- | --------------------------- | ---------------------------------------------------------------------------------------------------------- |
| [1.1.1 Non-text Content][1.1.1]            | A     | axe partially; `structural` |                                                                                                            |
| [1.2.x Time-based Media][1.2]              | A/AA  | `structural`                | Rare in a form service.                                                                                    |
| [1.3.1 Info and Relationships][1.3.1]      | A     | axe partially; `structural` | Check the actual programmatic relationships. See `component-contracts.md` for grouped controls and errors. |
| [1.3.2 Meaningful Sequence][1.3.2]         | A     | `structural`                |                                                                                                            |
| [1.3.3 Sensory Characteristics][1.3.3]     | A     | `judgement`                 |                                                                                                            |
| [1.3.4 Orientation][1.3.4]                 | AA    | `structural`                |                                                                                                            |
| [1.3.5 Identify Input Purpose][1.3.5]      | AA    | `structural`                | Cheap to fix and routinely missed on government forms.                                                     |
| [1.4.1 Use of Colour][1.4.1]               | A     | `judgement`                 | Links without an underline break a GovBB convention and may also fail this criterion; check both.          |
| [1.4.2 Audio Control][1.4.2]               | A     | `structural`                |                                                                                                            |
| [1.4.3 Contrast (Minimum)][1.4.3]          | AA    | `computed`                  | Measure the rendered text size before choosing a threshold; see `govbb-contrast.md`.                       |
| [1.4.4 Resize Text][1.4.4]                 | AA    | `needs-manual-test`         | Fixed pixel heights on text containers are the usual cause.                                                |
| [1.4.5 Images of Text][1.4.5]              | AA    | `structural`                |                                                                                                            |
| [1.4.10 Reflow][1.4.10]                    | AA    | browser check at 320px      |                                                                                                            |
| [1.4.11 Non-text Contrast][1.4.11]         | AA    | `computed`                  | See `govbb-contrast.md`.                                                                                   |
| [1.4.12 Text Spacing][1.4.12]              | AA    | `needs-manual-test`         | Fixed-height text boxes are the usual cause.                                                               |
| [1.4.13 Content on Hover or Focus][1.4.13] | AA    | `structural` + manual       |                                                                                                            |

## 2. Operable

| Criterion                                                      | Level | Method                                    | Notes                                                                                                                                         |
| -------------------------------------------------------------- | ----- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| [2.1.1 Keyboard][2.1.1]                                        | A     | `focus-order.mjs` + `structural`          | Inspect actual behaviour, not just the markup.                                                                                                |
| [2.1.2 No Keyboard Trap][2.1.2]                                | A     | `focus-order.mjs` detects same-node-twice |                                                                                                                                               |
| [2.1.4 Character Key Shortcuts][2.1.4]                         | A     | `structural`                              |                                                                                                                                               |
| [2.2.1 Timing Adjustable][2.2.1]                               | A     | `structural`                              | Keeping answers when a session times out is a recommendation, not part of this criterion; see below.                                          |
| [2.2.2 Pause, Stop, Hide][2.2.2]                               | A     | `structural`                              |                                                                                                                                               |
| [2.3.1 Three Flashes or Below Threshold][2.3.1]                | A     | `structural`                              |                                                                                                                                               |
| [2.4.1 Bypass Blocks][2.4.1]                                   | A     | axe partially; `structural`               |                                                                                                                                               |
| [2.4.2 Page Titled][2.4.2]                                     | A     | `structural`                              | The "Error:" prefix is a GovBB convention; see below.                                                                                         |
| [2.4.3 Focus Order][2.4.3]                                     | A     | `focus-order.mjs` + `judgement`           | Positive `tabindex` is the usual cause.                                                                                                       |
| [2.4.4 Link Purpose (In Context)][2.4.4]                       | A     | `structural`                              | Check repeated "Change" links against the summary-list guidance; see `component-contracts.md`.                                                |
| [2.4.5 Multiple Ways][2.4.5]                                   | AA    | `structural`                              |                                                                                                                                               |
| [2.4.6 Headings and Labels][2.4.6]                             | AA    | `structural`                              | GovBB heading conventions are not part of this criterion; see below.                                                                          |
| [2.4.7 Focus Visible][2.4.7]                                   | AA    | focus helper + manual confirmation        |                                                                                                                                               |
| **[2.4.11 Focus Not Obscured (Minimum)][2.4.11]** (new in 2.2) | AA    | focus helper + manual confirmation        | The helper's occlusion check is a heuristic; confirm the actual barrier before reporting.                                                     |
| [2.5.1 Pointer Gestures][2.5.1]                                | A     | `structural`                              |                                                                                                                                               |
| [2.5.2 Pointer Cancellation][2.5.2]                            | A     | `structural`                              |                                                                                                                                               |
| [2.5.3 Label in Name][2.5.3]                                   | A     | axe partially                             | Common failure: `aria-label="Submit application"` on a button reading "Continue" — voice control users say what they see and nothing happens. |
| [2.5.4 Motion Actuation][2.5.4]                                | A     | `structural`                              |                                                                                                                                               |
| **[2.5.7 Dragging Movements][2.5.7]** (new in 2.2)             | AA    | `structural`                              |                                                                                                                                               |
| **[2.5.8 Target Size (Minimum)][2.5.8]** (new in 2.2)          | AA    | `computed` from CSS                       | Measure the rendered size. Design-system controls are usually generous; bespoke icon and close buttons usually are not.                       |

## 3. Understandable

| Criterion                                                           | Level | Method                          | Notes                                                                                                       |
| ------------------------------------------------------------------- | ----- | ------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| [3.1.1 Language of Page][3.1.1]                                     | A     | axe                             |                                                                                                             |
| [3.1.2 Language of Parts][3.1.2]                                    | AA    | `structural`                    |                                                                                                             |
| [3.2.1 On Focus][3.2.1]                                             | A     | `structural`                    |                                                                                                             |
| [3.2.2 On Input][3.2.2]                                             | A     | `structural`                    | An auto-advancing radio group is the usual trap in a form service.                                          |
| [3.2.3 Consistent Navigation][3.2.3]                                | AA    | `structural`                    |                                                                                                             |
| [3.2.4 Consistent Identification][3.2.4]                            | AA    | `structural`                    |                                                                                                             |
| **[3.2.6 Consistent Help][3.2.6]** (new in 2.2)                     | A     | `structural` across pages       |                                                                                                             |
| [3.3.1 Error Identification][3.3.1]                                 | A     | axe partially; `structural`     | See the error contracts in `component-contracts.md`.                                                        |
| [3.3.2 Labels or Instructions][3.3.2]                               | A     | axe partially                   | A placeholder on its own is not a label. Avoiding placeholders altogether is a GovBB convention; see below. |
| [3.3.3 Error Suggestion][3.3.3]                                     | AA    | `judgement`                     |                                                                                                             |
| [3.3.4 Error Prevention (Legal, Financial, Data)][3.3.4]            | AA    | `structural`                    | A check-answers page is the usual way a form service meets this.                                            |
| **[3.3.7 Redundant Entry][3.3.7]** (new in 2.2)                     | A     | `structural` across the journey | A check-answers page re-displaying answers is not redundant entry.                                          |
| **[3.3.8 Accessible Authentication (Minimum)][3.3.8]** (new in 2.2) | AA    | `structural`                    |                                                                                                             |

## 4. Robust

| Criterion                        | Level | Method                      | Notes                                                                                                                    |
| -------------------------------- | ----- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| [4.1.2 Name, Role, Value][4.1.2] | A     | axe partially; `structural` | Custom widgets usually fail here; native elements rarely do. Check that they expose state such as expanded and selected. |
| [4.1.3 Status Messages][4.1.3]   | AA    | `structural`                | Over-use is its own problem: a `role="alert"` on every page load trains people to ignore it.                             |

## GovBB conventions, not criterion failures

Recommend these, but report them as GovBB guidance rather than WCAG failures.
Check the linked page for what it currently says.

- Prefix the page title with "Error:" when a page shows validation errors —
  [Error summary](https://design-system.service.alpha.gov.bb/components/error-summary.md).
- Underline links in body content —
  [Link](https://design-system.service.alpha.gov.bb/components/link.md).
- Use a skip link on every page that repeats navigation or other content before
  the main task —
  [Skip link](https://design-system.service.alpha.gov.bb/components/skip-link.md).
- Connect hints and error messages to their field with `aria-describedby`, and
  set `aria-invalid` on a field in error —
  [Form implementation](https://design-system.service.alpha.gov.bb/documentation/form-implementation.md).
- On a question page, make the question the `h1`. Other heading conventions are
  guidance too, not 2.4.6 failures —
  [Service heading](https://design-system.service.alpha.gov.bb/components/service-heading.md).
- Do not use placeholder text —
  [Why we don't use placeholder text](https://design-system.service.alpha.gov.bb/design-log/placeholder-text.md).

Keeping part-completed answers when a session times out is not a WCAG AA
requirement, and no GovBB page states it. Recommend it, but report it as neither
a WCAG failure nor a GovBB convention.

## Criteria axe cannot help with

Keep this list in view when writing the **Needs manual testing** section. A
review must state whether relevant checks were completed or remain untested,
regardless of a clean axe run.

- **1.4.4 / 1.4.12** — zoom to 200%, and increased text spacing.
- **1.4.10** — reflow at 320px.
- **2.2.1** — time limits, such as a session timeout.
- **2.4.3** — whether tab order matches _reading_ order (a machine can see the
  order, not whether it is right).
- **2.5.3** — visible label vs accessible name, for voice control.
- **3.3.3** — whether an error message actually helps someone recover.
- **3.3.7 / 3.2.6** — journey-level consistency across pages.
- **All of 1.2** — captions and transcripts.
- **Screen reader announcement quality** — not a criterion in itself, but the
  thing most likely to be broken while every criterion above appears satisfied.
  Only a person using the AT can settle it.

[1.1.1]: https://www.w3.org/WAI/WCAG22/Understanding/non-text-content
[1.2]: https://www.w3.org/WAI/WCAG22/Understanding/time-based-media
[1.3.1]: https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships
[1.3.2]: https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence
[1.3.3]: https://www.w3.org/WAI/WCAG22/Understanding/sensory-characteristics
[1.3.4]: https://www.w3.org/WAI/WCAG22/Understanding/orientation
[1.3.5]: https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose
[1.4.1]: https://www.w3.org/WAI/WCAG22/Understanding/use-of-color
[1.4.2]: https://www.w3.org/WAI/WCAG22/Understanding/audio-control
[1.4.3]: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum
[1.4.4]: https://www.w3.org/WAI/WCAG22/Understanding/resize-text
[1.4.5]: https://www.w3.org/WAI/WCAG22/Understanding/images-of-text
[1.4.10]: https://www.w3.org/WAI/WCAG22/Understanding/reflow
[1.4.11]: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast
[1.4.12]: https://www.w3.org/WAI/WCAG22/Understanding/text-spacing
[1.4.13]: https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus
[2.1.1]: https://www.w3.org/WAI/WCAG22/Understanding/keyboard
[2.1.2]: https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap
[2.1.4]: https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts
[2.2.1]: https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable
[2.2.2]: https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide
[2.3.1]: https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold
[2.4.1]: https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks
[2.4.2]: https://www.w3.org/WAI/WCAG22/Understanding/page-titled
[2.4.3]: https://www.w3.org/WAI/WCAG22/Understanding/focus-order
[2.4.4]: https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context
[2.4.5]: https://www.w3.org/WAI/WCAG22/Understanding/multiple-ways
[2.4.6]: https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels
[2.4.7]: https://www.w3.org/WAI/WCAG22/Understanding/focus-visible
[2.4.11]: https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum
[2.5.1]: https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures
[2.5.2]: https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation
[2.5.3]: https://www.w3.org/WAI/WCAG22/Understanding/label-in-name
[2.5.4]: https://www.w3.org/WAI/WCAG22/Understanding/motion-actuation
[2.5.7]: https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements
[2.5.8]: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum
[3.1.1]: https://www.w3.org/WAI/WCAG22/Understanding/language-of-page
[3.1.2]: https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts
[3.2.1]: https://www.w3.org/WAI/WCAG22/Understanding/on-focus
[3.2.2]: https://www.w3.org/WAI/WCAG22/Understanding/on-input
[3.2.3]: https://www.w3.org/WAI/WCAG22/Understanding/consistent-navigation
[3.2.4]: https://www.w3.org/WAI/WCAG22/Understanding/consistent-identification
[3.2.6]: https://www.w3.org/WAI/WCAG22/Understanding/consistent-help
[3.3.1]: https://www.w3.org/WAI/WCAG22/Understanding/error-identification
[3.3.2]: https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions
[3.3.3]: https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion
[3.3.4]: https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data
[3.3.7]: https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry
[3.3.8]: https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum
[4.1.2]: https://www.w3.org/WAI/WCAG22/Understanding/name-role-value
[4.1.3]: https://www.w3.org/WAI/WCAG22/Understanding/status-messages
