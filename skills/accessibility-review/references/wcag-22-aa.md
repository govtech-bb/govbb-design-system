# WCAG 2.2 level AA, organised for reviewing a government service

Not a restatement of the specification — a working checklist that says, for each
criterion, **what it means for a form-based government service** and **how you
can tell**. Level A and AA only; AAA is noted where GovBB tokens happen to reach
it, but is not the target.

The `Method` column is the best evidence normally available. If you cannot obtain
it, the finding is `needs-manual-test`, not a pass.

## Contents

- [The WCAG 2.2 additions](#the-wcag-22-additions) — start here; older checklists omit these
- [1. Perceivable](#1-perceivable)
- [2. Operable](#2-operable)
- [3. Understandable](#3-understandable)
- [4. Robust](#4-robust)
- [Criteria axe cannot help with](#criteria-axe-cannot-help-with)

## The WCAG 2.2 additions

WCAG 2.2 (October 2023) added six criteria at A and AA. Most checklists and most
reviewers still work from 2.1, so **these are where unreported failures cluster**.
Check them deliberately.

| Criterion                                     | Level | What it means here                                                                                                                                                                                                                                                                | Method                          |
| --------------------------------------------- | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| **2.4.11 Focus Not Obscured (Minimum)**       | AA    | When something receives focus, it must not be entirely hidden behind a sticky header, cookie banner or floating help widget.                                                                                                                                                      | `focus-order.mjs` checks this   |
| **2.5.7 Dragging Movements**                  | AA    | Anything draggable needs a non-drag alternative — reorderable lists, sliders, signature pads, map panning.                                                                                                                                                                        | `structural`                    |
| **2.5.8 Target Size (Minimum)**               | AA    | Targets at least 24×24px, or spaced so a 24px circle centred on each does not overlap a neighbour. Inline links in text are exempt. Measure the rendered size rather than assuming — design-system controls are usually generous, bespoke icon and close buttons usually are not. | `computed` from CSS             |
| **3.2.6 Consistent Help**                     | A     | If help (contact details, chat, phone number) appears on multiple pages, it must be in the same relative place each time.                                                                                                                                                         | `structural` across pages       |
| **3.3.7 Redundant Entry**                     | A     | Do not ask for the same information twice in one process unless it is essential. A check-answers page re-displaying answers is fine; re-typing them is not.                                                                                                                       | `structural` across the journey |
| **3.3.8 Accessible Authentication (Minimum)** | AA    | No cognitive function test in authentication without an alternative — no puzzle, no memory game, no transcription. Copy-paste into password fields must work, and email/OTP flows must not block paste.                                                                           | `structural`                    |

SC 4.1.1 Parsing was **removed** in WCAG 2.2. Do not report duplicate IDs as a
4.1.1 failure; report them under 4.1.2 where they break an accessible name, or as
a plain defect.

## 1. Perceivable

| Criterion                        | Level | What it means here                                                                                                                                                                                                              | Method                      |
| -------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| 1.1.1 Non-text Content           | A     | Meaningful images have useful `alt`; decorative ones have `alt=""`. Icon-only buttons have an accessible name. Charts need a text equivalent.                                                                                   | axe partially; `structural` |
| 1.2.x Time-based Media           | A/AA  | Captions for video, transcript for audio. Rare in a form service; if there is an explainer video, it needs captions.                                                                                                            | `structural`                |
| 1.3.1 Info and Relationships     | A     | Structure conveyed visually is in the markup: headings are headings, groups are `fieldset`/`legend`, tables use `th`/`scope`, errors are connected with `aria-describedby`. **The most-cited criterion in real audits.**        | axe partially; `structural` |
| 1.3.2 Meaningful Sequence        | A     | DOM order matches reading order. CSS reordering (flex `order`, grid placement) that desyncs them is a failure.                                                                                                                  | `structural`                |
| 1.3.3 Sensory Characteristics    | A     | No "click the green button on the right".                                                                                                                                                                                       | `judgement`                 |
| 1.3.4 Orientation                | AA    | Works in portrait and landscape; no forced orientation.                                                                                                                                                                         | `structural`                |
| 1.3.5 Identify Input Purpose     | AA    | `autocomplete` on fields collecting known personal data — name, email, tel, address, postal code, bday. Cheap to fix and routinely missed.                                                                                      | `structural`                |
| 1.4.1 Use of Colour              | A     | Colour is never the only signal. Errors need text or an icon, not just a red border. Links in body text need underlines or another non-colour cue.                                                                              | `judgement`                 |
| 1.4.2 Audio Control              | A     | Nothing auto-plays for more than 3s without a control.                                                                                                                                                                          | `structural`                |
| 1.4.3 Contrast (Minimum)         | AA    | 4.5:1 normal text, 3:1 large text — and large text means ≥24px regular or ≥18.66px bold, which body copy generally is not. Check the rendered size against the type scale before choosing a threshold. See `govbb-contrast.md`. | `computed`                  |
| 1.4.4 Resize Text                | AA    | Usable at 200% zoom with no loss of content or function. Fixed pixel heights on text containers are the usual cause.                                                                                                            | `needs-manual-test`         |
| 1.4.5 Images of Text             | AA    | No text baked into images except logos.                                                                                                                                                                                         | `structural`                |
| 1.4.10 Reflow                    | AA    | No horizontal scrolling at 320px width (equivalent to 400% zoom at 1280px). Wide tables and fixed-width containers are the usual cause.                                                                                         | browser check at 320px      |
| 1.4.11 Non-text Contrast         | AA    | 3:1 for control boundaries, focus indicators and meaningful graphics. **Frequently skipped entirely.** See the focus-ring open question in `govbb-contrast.md`.                                                                 | `computed`                  |
| 1.4.12 Text Spacing              | AA    | No content lost when line height, letter and word spacing are increased. Fixed-height text boxes break this.                                                                                                                    | `needs-manual-test`         |
| 1.4.13 Content on Hover or Focus | AA    | Tooltips and popovers must be dismissible without moving the pointer, hoverable, and persistent until dismissed.                                                                                                                | `structural` + manual       |

## 2. Operable

| Criterion                       | Level | What it means here                                                                                                                                                                                   | Method                                    |
| ------------------------------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| 2.1.1 Keyboard                  | A     | Everything operable by keyboard. A `<div onclick>` fails this — the single most common serious defect.                                                                                               | `focus-order.mjs` + `structural`          |
| 2.1.2 No Keyboard Trap          | A     | Focus can always move out. Modals must be escapable.                                                                                                                                                 | `focus-order.mjs` detects same-node-twice |
| 2.1.4 Character Key Shortcuts   | A     | Single-character shortcuts can be turned off or remapped.                                                                                                                                            | `structural`                              |
| 2.2.1 Timing Adjustable         | A     | Session timeouts warn and can be extended. **Government services with a session timeout usually fail this**, and losing part-completed answers is a serious harm.                                    | `structural`                              |
| 2.2.2 Pause, Stop, Hide         | A     | Anything moving or auto-updating for more than 5s can be paused.                                                                                                                                     | `structural`                              |
| 2.3.1 Three Flashes             | A     | Nothing flashes more than three times a second.                                                                                                                                                      | `structural`                              |
| 2.4.1 Bypass Blocks             | A     | A skip link, and real landmarks.                                                                                                                                                                     | axe partially; `structural`               |
| 2.4.2 Page Titled               | A     | Unique `<title>` describing the page, not just the service. On an error state, GOV.UK convention prefixes "Error: ".                                                                                 | `structural`                              |
| 2.4.3 Focus Order               | A     | Tab order follows reading order. Positive `tabindex` almost always breaks this.                                                                                                                      | `focus-order.mjs` + `judgement`           |
| 2.4.4 Link Purpose (In Context) | A     | Link text describes the destination. No bare "click here", and no fifteen identical "Change" links (see Summary list in `component-contracts.md`).                                                   | `structural`                              |
| 2.4.5 Multiple Ways             | AA    | More than one route to each page — navigation plus search or a sitemap.                                                                                                                              | `structural`                              |
| 2.4.6 Headings and Labels       | AA    | Headings and labels describe their content. One `h1`; no skipped levels.                                                                                                                             | `structural`                              |
| 2.4.7 Focus Visible             | AA    | A visible focus indicator on every focusable element.                                                                                                                                                | `focus-order.mjs`                         |
| **2.4.11 Focus Not Obscured**   | AA    | New in 2.2 — see above.                                                                                                                                                                              | `focus-order.mjs`                         |
| 2.5.1 Pointer Gestures          | A     | No path-based or multipoint gesture without a single-pointer alternative.                                                                                                                            | `structural`                              |
| 2.5.2 Pointer Cancellation      | A     | Actions fire on up-event, so a mis-press can be aborted.                                                                                                                                             | `structural`                              |
| 2.5.3 Label in Name             | A     | A control's accessible name contains its visible text. Common failure: `aria-label="Submit application"` on a button reading "Continue" — voice control users say what they see and nothing happens. | axe partially                             |
| 2.5.4 Motion Actuation          | A     | Nothing requires device motion.                                                                                                                                                                      | `structural`                              |
| **2.5.7 Dragging Movements**    | AA    | New in 2.2 — see above.                                                                                                                                                                              | `structural`                              |
| **2.5.8 Target Size (Minimum)** | AA    | New in 2.2 — see above.                                                                                                                                                                              | `computed`                                |

## 3. Understandable

| Criterion                                       | Level | What it means here                                                                                                                     | Method                      |
| ----------------------------------------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| 3.1.1 Language of Page                          | A     | `lang` on `<html>`, matching the content.                                                                                              | axe                         |
| 3.1.2 Language of Parts                         | AA    | `lang` on passages in another language.                                                                                                | `structural`                |
| 3.2.1 On Focus                                  | A     | Focus alone never changes context.                                                                                                     | `structural`                |
| 3.2.2 On Input                                  | A     | Changing a value never auto-submits or navigates unless warned. An auto-advancing radio group fails this.                              | `structural`                |
| 3.2.3 Consistent Navigation                     | AA    | Navigation in the same order on every page.                                                                                            | `structural`                |
| 3.2.4 Consistent Identification                 | AA    | The same function is named the same way throughout.                                                                                    | `structural`                |
| **3.2.6 Consistent Help**                       | A     | New in 2.2 — see above.                                                                                                                | `structural`                |
| 3.3.1 Error Identification                      | A     | Errors described in text and programmatically linked. See the Error summary contract.                                                  | axe partially; `structural` |
| 3.3.2 Labels or Instructions                    | A     | Every control labelled. **Placeholder text is not a label**, and GovBB deliberately avoids it.                                         | axe partially               |
| 3.3.3 Error Suggestion                          | AA    | Errors say how to fix it, not just that something is wrong.                                                                            | `judgement`                 |
| 3.3.4 Error Prevention (Legal, Financial, Data) | AA    | Submissions that are legal, financial or irreversible are reversible, checked, or confirmed. This is what a check-answers page is for. | `structural`                |
| **3.3.7 Redundant Entry**                       | A     | New in 2.2 — see above.                                                                                                                | `structural`                |
| **3.3.8 Accessible Authentication**             | AA    | New in 2.2 — see above.                                                                                                                | `structural`                |

## 4. Robust

| Criterion               | Level | What it means here                                                                                                                                                                                     | Method                      |
| ----------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------- |
| 4.1.2 Name, Role, Value | A     | Every control has an accessible name, correct role, and state exposed (`aria-expanded`, `aria-invalid`, `aria-current`). Custom widgets fail here; native elements rarely do.                          | axe partially; `structural` |
| 4.1.3 Status Messages   | AA    | Status changes announced without moving focus — `role="status"` for polite, `role="alert"` for assertive. Over-use is its own problem: a `role="alert"` on every page load trains people to ignore it. | `structural`                |

SC 4.1.1 Parsing was removed in WCAG 2.2 — see the note above.

## Criteria axe cannot help with

Keep this list in view when writing the **Needs manual testing** section. A
review that omits these is not an AA review, however clean the axe run was.

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
