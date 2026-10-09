# Testing WCAG 2.2 A and AA criteria in a government service

Not a restatement of the specification — a working checklist that says, for each
criterion, **what it means for a form-based government service** and **how you
can tell**. The conformance target is the one the accessibility page states. Use
this checklist for the criteria it covers, and the W3C specification for any
criteria the target adds. This checklist gives common techniques, not every
exception or permitted implementation; verify a claimed failure against the
[WCAG 2.2 specification](https://www.w3.org/TR/WCAG22/).
Keep GovBB conventions separate from criterion failures.

The `Method` column is the best evidence normally available. If you cannot obtain
it, the finding is `needs-manual-test`, not a pass.

The `Common failures` column describes what usually goes wrong, not the
criterion. Most criteria pass in several ways and have exceptions the column
leaves out, so a match is only a possible failure until you have read the
criterion's text, linked from its name. If the W3C pages are unreachable,
report it as a possible failure that was not checked against the specification.
Thresholds in the column are copied exactly and can be measured against.

## Contents

- [The WCAG 2.2 additions](#the-wcag-22-additions) — start here; older checklists omit these
- [1. Perceivable](#1-perceivable)
- [2. Operable](#2-operable)
- [3. Understandable](#3-understandable)
- [4. Robust](#4-robust)
- [GovBB conventions, not criterion failures](#govbb-conventions-not-criterion-failures)
- [Criteria axe cannot help with](#criteria-axe-cannot-help-with)

## The WCAG 2.2 additions

WCAG 2.2 added six criteria at A and AA. Include them when reviewing a service
that was previously checked against 2.1.

| Criterion                                              | Level | Common failures                                                                                                                                                                                                                                                                                               | Method                          |
| ------------------------------------------------------ | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| **[2.4.11 Focus Not Obscured (Minimum)][2.4.11]**      | AA    | A focused element is entirely hidden behind a sticky header, cookie banner or floating help widget. Partly hidden does not fail this criterion.                                                                                                                                                               | focus helper + confirmation     |
| **[2.5.7 Dragging Movements][2.5.7]**                  | AA    | Something that only works by dragging, with no single-pointer alternative: reorderable lists, sliders, signature pads, map panning.                                                                                                                                                                           | `structural`                    |
| **[2.5.8 Target Size (Minimum)][2.5.8]**               | AA    | A target smaller than 24×24 CSS px where a 24px circle centred on it overlaps another target or another small target's circle. Inline links in text are exempt. Measure the rendered size rather than assuming — design-system controls are usually generous, bespoke icon and close buttons usually are not. | `computed` from CSS             |
| **[3.2.6 Consistent Help][3.2.6]**                     | A     | Contact details, a contact form, chat or a help page appears on several pages, but in a different order relative to the rest of the page.                                                                                                                                                                     | `structural` across pages       |
| **[3.3.7 Redundant Entry][3.3.7]**                     | A     | A later step in the same process asks people to type something again, without filling it in or offering it to select. A check-answers page re-displaying answers is fine.                                                                                                                                     | `structural` across the journey |
| **[3.3.8 Accessible Authentication (Minimum)][3.3.8]** | AA    | Signing in needs something remembered or transcribed with no alternative and no help: paste blocked in a password field, password managers prevented from filling it, or a one-time code that cannot be pasted. Recognising objects or the user's own content is allowed at this level.                       | `structural`                    |

SC 4.1.1 Parsing was **removed** in WCAG 2.2. Do not report duplicate IDs as a
4.1.1 failure; report them under 4.1.2 where they break an accessible name, or as
a plain defect.

## 1. Perceivable

| Criterion                                  | Level | Common failures                                                                                                                                                                                                                                                       | Method                      |
| ------------------------------------------ | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| [1.1.1 Non-text Content][1.1.1]            | A     | A meaningful image without useful `alt`, a decorative one without `alt=""`, an icon-only button with no accessible name, a chart with no text equivalent.                                                                                                             | axe partially; `structural` |
| [1.2.x Time-based Media][1.2]              | A/AA  | Prerecorded video without captions, or without audio description where the picture carries information the soundtrack does not. Audio without a transcript. Rare in a form service.                                                                                   | `structural`                |
| [1.3.1 Info and Relationships][1.3.1]      | A     | Structure shown visually but missing from the markup: headings that are not headings, grouped controls without `fieldset`/`legend`, tables without `th`/`scope`, hints and errors not connected with `aria-describedby`. Check the actual programmatic relationships. | axe partially; `structural` |
| [1.3.2 Meaningful Sequence][1.3.2]         | A     | DOM order, or CSS reordering (flex `order`, grid placement), puts content in an order that changes its meaning, such as a hint read after the field it explains. Reordering that does not change meaning passes.                                                      | `structural`                |
| [1.3.3 Sensory Characteristics][1.3.3]     | A     | Instructions that rely only on shape, colour, size, position or sound: "click the green button on the right".                                                                                                                                                         | `judgement`                 |
| [1.3.4 Orientation][1.3.4]                 | AA    | The page is locked to portrait or landscape when the orientation is not essential.                                                                                                                                                                                    | `structural`                |
| [1.3.5 Identify Input Purpose][1.3.5]      | AA    | Fields asking for the user's own details (name, email, tel, address, postal code, bday) without the matching `autocomplete` value. Cheap to fix and routinely missed.                                                                                                 | `structural`                |
| [1.4.1 Use of Colour][1.4.1]               | A     | Colour is the only signal: an error shown only by a red border, or links in body text told apart only by a colour with less than 3:1 contrast against the surrounding text.                                                                                           | `judgement`                 |
| [1.4.2 Audio Control][1.4.2]               | A     | Audio that plays automatically for more than 3 seconds with no way to pause or stop it, or to set its volume separately from the system volume.                                                                                                                       | `structural`                |
| [1.4.3 Contrast (Minimum)][1.4.3]          | AA    | Text below 4.5:1, or large text below 3:1. Large text means ≥24px regular or 14pt bold (about 18.67px). Check the rendered size against the type scale before choosing a threshold. See `govbb-contrast.md`.                                                          | `computed`                  |
| [1.4.4 Resize Text][1.4.4]                 | AA    | Content or function lost when text is resized to 200%. Fixed pixel heights on text containers are the usual cause.                                                                                                                                                    | `needs-manual-test`         |
| [1.4.5 Images of Text][1.4.5]              | AA    | Text baked into an image where real text would do. Logos are exempt.                                                                                                                                                                                                  | `structural`                |
| [1.4.10 Reflow][1.4.10]                    | AA    | Scrolling in two dimensions at 320 CSS px wide (or 256 CSS px tall, for content that scrolls horizontally). Content that needs a two-dimensional layout, such as some data tables, is exempt.                                                                         | browser check at 320px      |
| [1.4.11 Non-text Contrast][1.4.11]         | AA    | Control boundaries, focus indicators or meaningful graphics below 3:1 against adjacent colours. Check which boundaries are needed to identify the control; see `govbb-contrast.md`.                                                                                   | `computed`                  |
| [1.4.12 Text Spacing][1.4.12]              | AA    | Content is clipped, overlaps or disappears when line height is set to 1.5×, spacing after paragraphs to 2×, letter spacing to 0.12× and word spacing to 0.16× the font size, all together. Fixed-height text boxes are the usual cause.                               | `needs-manual-test`         |
| [1.4.13 Content on Hover or Focus][1.4.13] | AA    | A tooltip or popover that cannot be dismissed without moving the pointer or focus, disappears when the pointer moves onto it, or disappears on a timer while still hovered or focused. Closing when hover or focus moves away is allowed.                             | `structural` + manual       |

## 2. Operable

| Criterion                                       | Level | Common failures                                                                                                                                                                                                                                                                                         | Method                                    |
| ----------------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| [2.1.1 Keyboard][2.1.1]                         | A     | Something that works by mouse but not by keyboard, such as a click handler on a `div` with no key handling. Inspect actual behaviour.                                                                                                                                                                   | `focus-order.mjs` + `structural`          |
| [2.1.2 No Keyboard Trap][2.1.2]                 | A     | Focus can move into a component, such as a modal or embedded widget, but not back out with the keyboard.                                                                                                                                                                                                | `focus-order.mjs` detects same-node-twice |
| [2.1.4 Character Key Shortcuts][2.1.4]          | A     | A single-character shortcut (a letter, number, punctuation or symbol key on its own) that cannot be turned off or remapped and works even when its component does not have focus.                                                                                                                       | `structural`                              |
| [2.2.1 Timing Adjustable][2.2.1]                | A     | A session timeout or other time limit that cannot be turned off, adjusted to at least 10× the default, or extended. Extending means a warning before it expires, at least 20 seconds to extend with a simple action, and at least 10 extensions. Check the real-time, essential and 20-hour exceptions. | `structural`                              |
| [2.2.2 Pause, Stop, Hide][2.2.2]                | A     | Moving, blinking or scrolling content that starts automatically, lasts more than 5 seconds and sits alongside other content, with no way to pause, stop or hide it. Auto-updating content with no way to pause, stop, hide or slow it.                                                                  | `structural`                              |
| [2.3.1 Three Flashes or Below Threshold][2.3.1] | A     | Something flashes more than three times in any one second, unless the flashes stay below the general and red flash thresholds.                                                                                                                                                                          | `structural`                              |
| [2.4.1 Bypass Blocks][2.4.1]                    | A     | No way to skip blocks repeated on every page, such as the header and navigation: no skip link, no landmarks and no headings to jump between.                                                                                                                                                            | axe partially; `structural`               |
| [2.4.2 Page Titled][2.4.2]                      | A     | A missing `<title>`, or one that does not describe the page, such as naming only the service.                                                                                                                                                                                                           | `structural`                              |
| [2.4.3 Focus Order][2.4.3]                      | A     | Tab order that does not follow reading order where that affects meaning or operation. Positive `tabindex` almost always causes this.                                                                                                                                                                    | `focus-order.mjs` + `judgement`           |
| [2.4.4 Link Purpose (In Context)][2.4.4]        | A     | Link text whose purpose is not clear from the link and its programmatically determined context. Check repeated "Change" links against the summary-list guidance; see `component-contracts.md`.                                                                                                          | `structural`                              |
| [2.4.5 Multiple Ways][2.4.5]                    | AA    | Only one way to find a page in a set, for a page that is not a step in, or the result of, a process.                                                                                                                                                                                                    | `structural`                              |
| [2.4.6 Headings and Labels][2.4.6]              | AA    | Headings or labels that do not describe their topic or purpose.                                                                                                                                                                                                                                         | `structural`                              |
| [2.4.7 Focus Visible][2.4.7]                    | AA    | A control that can be reached by keyboard but shows no visible focus indicator, often because of `outline: none` with no replacement.                                                                                                                                                                   | focus helper + manual confirmation        |
| **[2.4.11 Focus Not Obscured][2.4.11]**         | AA    | New in 2.2 — see above.                                                                                                                                                                                                                                                                                 | focus helper + manual confirmation        |
| [2.5.1 Pointer Gestures][2.5.1]                 | A     | A path-based or multipoint gesture (swipe, pinch, two-finger tap) with no single-pointer alternative.                                                                                                                                                                                                   | `structural`                              |
| [2.5.2 Pointer Cancellation][2.5.2]             | A     | An action that completes on the down-event (`mousedown`, `pointerdown`, `touchstart`) with no way to abort or undo it. Completing on the up-event, as `click` does, passes.                                                                                                                             | `structural`                              |
| [2.5.3 Label in Name][2.5.3]                    | A     | A control's accessible name does not contain its visible text. Common failure: `aria-label="Submit application"` on a button reading "Continue" — voice control users say what they see and nothing happens.                                                                                            | axe partially                             |
| [2.5.4 Motion Actuation][2.5.4]                 | A     | Something triggered by shaking or tilting the device, with no ordinary control that does the same or no way to turn the motion response off.                                                                                                                                                            | `structural`                              |
| **[2.5.7 Dragging Movements][2.5.7]**           | AA    | New in 2.2 — see above.                                                                                                                                                                                                                                                                                 | `structural`                              |
| **[2.5.8 Target Size (Minimum)][2.5.8]**        | AA    | New in 2.2 — see above.                                                                                                                                                                                                                                                                                 | `computed`                                |

## 3. Understandable

| Criterion                                                | Level | Common failures                                                                                                                                                                                                                                                         | Method                      |
| -------------------------------------------------------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| [3.1.1 Language of Page][3.1.1]                          | A     | `lang` on `<html>` missing, or not matching the content's main language.                                                                                                                                                                                                | axe                         |
| [3.1.2 Language of Parts][3.1.2]                         | AA    | A passage in another language without its own `lang`. Proper names and technical terms are exempt.                                                                                                                                                                      | `structural`                |
| [3.2.1 On Focus][3.2.1]                                  | A     | Focusing a control changes context: it submits, opens a window or moves focus elsewhere.                                                                                                                                                                                | `structural`                |
| [3.2.2 On Input][3.2.2]                                  | A     | Changing a value changes context, such as auto-submitting, navigating or auto-advancing from a radio group, without telling the user beforehand.                                                                                                                        | `structural`                |
| [3.2.3 Consistent Navigation][3.2.3]                     | AA    | Navigation repeated across a set of pages appears in a different relative order on different pages, without the user changing it.                                                                                                                                       | `structural`                |
| [3.2.4 Consistent Identification][3.2.4]                 | AA    | The same function labelled differently on different pages: "Continue" on one, "Next" on another.                                                                                                                                                                        | `structural`                |
| **[3.2.6 Consistent Help][3.2.6]**                       | A     | New in 2.2 — see above.                                                                                                                                                                                                                                                 | `structural`                |
| [3.3.1 Error Identification][3.3.1]                      | A     | An automatically detected error that is not identified and described in text: only a red border, or a general message that does not say which field. See the Error summary contract.                                                                                    | axe partially; `structural` |
| [3.3.2 Labels or Instructions][3.3.2]                    | A     | A control with no label or instructions where input is needed. Placeholder text disappears once someone types, so it is not a reliable label.                                                                                                                           | axe partially               |
| [3.3.3 Error Suggestion][3.3.3]                          | AA    | An error message that says something is wrong but not how to fix it, when a fix is known and saying it would not compromise security.                                                                                                                                   | `judgement`                 |
| [3.3.4 Error Prevention (Legal, Financial, Data)][3.3.4] | AA    | A submission that makes a legal commitment or financial transaction, changes or deletes the user's stored data, or submits test answers, and cannot be reversed, checked and corrected, or reviewed and confirmed first. A check-answers page is the confirmation step. | `structural`                |
| **[3.3.7 Redundant Entry][3.3.7]**                       | A     | New in 2.2 — see above.                                                                                                                                                                                                                                                 | `structural`                |
| **[3.3.8 Accessible Authentication][3.3.8]**             | AA    | New in 2.2 — see above.                                                                                                                                                                                                                                                 | `structural`                |

## 4. Robust

| Criterion                        | Level | Common failures                                                                                                                                                                                                                                  | Method                      |
| -------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------- |
| [4.1.2 Name, Role, Value][4.1.2] | A     | A control with no accessible name, the wrong role, or a state that is not exposed (expanded, checked, selected). Custom widgets fail here; native elements rarely do.                                                                            | axe partially; `structural` |
| [4.1.3 Status Messages][4.1.3]   | AA    | A status message, such as a result count or "Saved", that is not announced without moving focus: no `role="status"`, `role="alert"` or live region. Over-use is its own problem: a `role="alert"` on every page load trains people to ignore it. | `structural`                |

SC 4.1.1 Parsing was removed in WCAG 2.2 — see the note above.

## GovBB conventions, not criterion failures

Recommend these, but report them as GovBB guidance rather than WCAG failures.
Check the linked page for what it currently says.

- Keep part-completed answers when a session times out. This is
  [2.2.5 Re-authenticating][2.2.5] (AAA), not part of 2.2.1.
- Prefix the page title with "Error:" when a page shows validation errors —
  [Error summary](https://design-system.service.alpha.gov.bb/components/error-summary.md).
- Underline links in body content —
  [Link](https://design-system.service.alpha.gov.bb/components/link.md).
- Start each page with a skip link —
  [Skip link](https://design-system.service.alpha.gov.bb/components/skip-link.md).
- Do not use placeholder text —
  [Why we don't use placeholder text](https://design-system.service.alpha.gov.bb/design-log/placeholder-text.md).

## Criteria axe cannot help with

Keep this list in view when writing the **Needs manual testing** section. A
review must state whether relevant checks were completed or remain untested,
regardless of a clean axe run.

- **1.4.4 / 1.4.12** — zoom to 200%, and increased text spacing.
- **1.4.10** — reflow at 320px.
- **2.2.1** — session timeout warning and extension.
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
[2.2.5]: https://www.w3.org/WAI/WCAG22/Understanding/re-authenticating
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
