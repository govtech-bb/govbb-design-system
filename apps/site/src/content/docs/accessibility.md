---
title: Accessibility
description: The accessibility conformance target for Government of Barbados services built with this design system, and what each requirement means in practice.
lede: Services built with this design system conform to WCAG 2.2 level AA.
---

Services built with the GovBB Design System conform to
[WCAG 2.2](https://www.w3.org/TR/WCAG22/) level **AA**. That target is stated in
[the standards](/documentation/using-the-design-system/#standards) every official
service follows; this page says what it means criterion by criterion, so a team
can check their work against something specific rather than against a level
number.

## What this page is, and is not

This is **the conformance target for services built with this design system.**
It is a commitment GovTech makes about the work it produces and supports.

It is **not** national policy. There is no wider Government of Barbados
accessibility policy at the time of writing, which is why this page exists — but
that absence does not make a design system's documentation into government
policy. If a government-wide standard is written later it should supersede or
absorb this page, and this page is deliberately written so it can be absorbed
without contradiction.

Two things are out of scope here, because they are policy instruments rather
than technical requirements: **accessibility statements** and **procurement
obligations.** Both need authority this page does not claim.

## Why AA, and why 2.2

**AA is the level nearly every government digital standard settles on.** A is
too low to make a service usable by the people it excludes; AAA contains
criteria that are unreachable for some kinds of content and is normally applied
selectively rather than as a blanket target.

**2.2 rather than 2.1** because it is the current recommendation, and its six
additions are all directly relevant to transactional government services —
authentication, dragging, target sizes, help placement, re-entering information,
and focus being obscured by sticky page furniture. A team working from a 2.1
checklist will miss all six, and they are among the easiest to fail.

## What the design system gives you, and what it does not

Using the design system gets you a long way, and it does not get you all the
way. Roughly:

**The design system's half.** Colour combinations that meet contrast
requirements, a visible keyboard focus indicator, hit areas on interactive
controls, sensible heading and text sizing, components whose markup carries the
semantics they need, and forced-colors handling.

**Your service's half.** Everything about _your_ content and _your_ journey:
labels associated with their controls, errors connected to the fields they
describe and worded so someone can recover, heading structure that reflects the
page, link text that means something out of context, alternative text, the order
things receive focus, and whether the task can be completed at all without a
mouse or without JavaScript.

A page built entirely from design-system components can still fail most of the
criteria below. Conformance is a property of the service, not of the parts it is
assembled from.

## Requirements

Grouped as WCAG groups them. Level A criteria are included because AA
conformance requires meeting A as well.

### Perceivable

| Criterion                        | Level | What it means for a service                                                                                                                                                                                                                                                      |
| -------------------------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1.1 Non-text Content           | A     | Meaningful images have alternative text that conveys what they convey; decorative ones have empty `alt` so they are skipped. Icon-only buttons have an accessible name. Charts have a text equivalent.                                                                           |
| 1.2.1–1.2.5 Time-based Media     | A/AA  | Video has captions; audio has a transcript. Rare in a transactional service, but an explainer video needs them.                                                                                                                                                                  |
| 1.3.1 Info and Relationships     | A     | Structure that is obvious visually is also in the markup: headings are heading elements, grouped controls sit in a `fieldset` with a `legend`, table headers are `th` with a scope, and an error is programmatically tied to its field. The most-cited criterion in real audits. |
| 1.3.2 Meaningful Sequence        | A     | The order content appears in the markup matches the order it should be read in. Reordering visually with CSS while leaving the markup order alone breaks this.                                                                                                                   |
| 1.3.3 Sensory Characteristics    | A     | Instructions do not depend on shape, colour, size or position alone — not "the green button on the right".                                                                                                                                                                       |
| 1.3.4 Orientation                | AA    | Works in portrait and landscape. Do not lock orientation.                                                                                                                                                                                                                        |
| 1.3.5 Identify Input Purpose     | AA    | Fields collecting known personal information carry the matching `autocomplete` value, so a browser or assistive tool can fill them. Cheap, and routinely missed.                                                                                                                 |
| 1.4.1 Use of Colour              | A     | Colour is never the only way something is communicated. A red border on an invalid field needs accompanying text.                                                                                                                                                                |
| 1.4.2 Audio Control              | A     | Nothing plays automatically for more than three seconds without a way to stop it.                                                                                                                                                                                                |
| 1.4.3 Contrast (Minimum)         | AA    | Text meets 4.5:1 against its background, or 3:1 if it is large — meaning at least 24px, or 18.66px when bold. Body text is normally below that threshold and needs the higher ratio.                                                                                             |
| 1.4.4 Resize Text                | AA    | Usable at 200% zoom with nothing lost or cut off. Fixed heights on text containers are the usual cause of failure.                                                                                                                                                               |
| 1.4.5 Images of Text             | AA    | Text is real text, not baked into an image. Logos are exempt.                                                                                                                                                                                                                    |
| 1.4.10 Reflow                    | AA    | No horizontal scrolling at a width equivalent to 320px. Wide tables and fixed-width containers are the usual cause.                                                                                                                                                              |
| 1.4.11 Non-text Contrast         | AA    | Boundaries of interactive controls, focus indicators and meaningful graphics meet 3:1. Frequently skipped entirely, because it is easy to read as a text-only requirement.                                                                                                       |
| 1.4.12 Text Spacing              | AA    | Nothing is lost when line height, letter spacing and word spacing are increased. Fixed-height text boxes break this.                                                                                                                                                             |
| 1.4.13 Content on Hover or Focus | AA    | Tooltips and popovers can be dismissed without moving the pointer, stay visible while hovered, and persist until dismissed.                                                                                                                                                      |

### Operable

| Criterion                               | Level | What it means for a service                                                                                                                                                                                           |
| --------------------------------------- | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2.1.1 Keyboard                          | A     | Everything can be operated by keyboard. A `div` with a click handler is the most common serious failure of this criterion.                                                                                            |
| 2.1.2 No Keyboard Trap                  | A     | Focus can always move out of a component. Anything that opens can be closed.                                                                                                                                          |
| 2.1.4 Character Key Shortcuts           | A     | Single-character shortcuts can be turned off or remapped.                                                                                                                                                             |
| 2.2.1 Timing Adjustable                 | A     | A session timeout warns before it expires and can be extended. Services that discard part-completed answers on timeout fail this, and the harm is real rather than technical.                                         |
| 2.2.2 Pause, Stop, Hide                 | A     | Anything moving or auto-updating for more than five seconds can be paused.                                                                                                                                            |
| 2.3.1 Three Flashes or Below            | A     | Nothing flashes more than three times a second.                                                                                                                                                                       |
| 2.4.1 Bypass Blocks                     | A     | A way to skip repeated content — a skip link, plus real landmark regions.                                                                                                                                             |
| 2.4.2 Page Titled                       | A     | Every page has a unique title describing that page, not just the service. On an error state, say so in the title.                                                                                                     |
| 2.4.3 Focus Order                       | A     | Focus moves in an order that matches the reading order. A positive `tabindex` almost always breaks this.                                                                                                              |
| 2.4.4 Link Purpose (In Context)         | A     | Link text describes where it goes. A column of identical "Change" links on a check-answers page is the classic failure — each needs text naming what it changes.                                                      |
| 2.4.5 Multiple Ways                     | AA    | More than one route to each page: navigation plus search, or a sitemap.                                                                                                                                               |
| 2.4.6 Headings and Labels               | AA    | Headings and labels describe what follows them. One `h1`, and no skipped levels.                                                                                                                                      |
| 2.4.7 Focus Visible                     | AA    | Every focusable element shows a visible focus indicator. Removing an outline without replacing it fails this.                                                                                                         |
| **2.4.11 Focus Not Obscured (Minimum)** | AA    | _New in 2.2._ A focused element is not entirely hidden behind sticky page furniture — a header, a cookie banner, a floating help widget.                                                                              |
| 2.5.1 Pointer Gestures                  | A     | No path-based or multi-finger gesture without a single-pointer alternative.                                                                                                                                           |
| 2.5.2 Pointer Cancellation              | A     | Actions complete on release, so a mis-press can be aborted.                                                                                                                                                           |
| 2.5.3 Label in Name                     | A     | A control's accessible name contains its visible text. A button reading "Continue" with an `aria-label` of "Submit application" fails: someone using voice control says what they see, and nothing happens.           |
| 2.5.4 Motion Actuation                  | A     | Nothing requires shaking or tilting a device.                                                                                                                                                                         |
| **2.5.7 Dragging Movements**            | AA    | _New in 2.2._ Anything draggable has a non-drag alternative — reorderable lists, sliders, signature fields, map panning.                                                                                              |
| **2.5.8 Target Size (Minimum)**         | AA    | _New in 2.2._ Targets are at least 24×24px, or spaced so a 24px circle centred on each does not overlap its neighbour. Inline links in prose are exempt. Bespoke icon and close buttons are where this usually fails. |

### Understandable

| Criterion                                       | Level | What it means for a service                                                                                                                                               |
| ----------------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3.1.1 Language of Page                          | A     | The page declares its language.                                                                                                                                           |
| 3.1.2 Language of Parts                         | AA    | Passages in another language declare it.                                                                                                                                  |
| 3.2.1 On Focus                                  | A     | Moving focus to something never changes context by itself.                                                                                                                |
| 3.2.2 On Input                                  | A     | Changing a value never submits or navigates unless the person was told it would. A radio group that advances the page on selection fails this.                            |
| 3.2.3 Consistent Navigation                     | AA    | Navigation appears in the same order on every page.                                                                                                                       |
| 3.2.4 Consistent Identification                 | AA    | The same function is named the same way throughout.                                                                                                                       |
| **3.2.6 Consistent Help**                       | A     | _New in 2.2._ If help — contact details, a phone number, a chat — appears on more than one page, it appears in the same relative place each time.                         |
| 3.3.1 Error Identification                      | A     | Errors are described in text and programmatically associated with the field.                                                                                              |
| 3.3.2 Labels or Instructions                    | A     | Every control has a label. Placeholder text is not a label: it disappears on entry and is not reliably announced.                                                         |
| 3.3.3 Error Suggestion                          | AA    | An error says how to fix it, not only that something is wrong. "Enter a date like 31 3 1980" over "Invalid input".                                                        |
| 3.3.4 Error Prevention (Legal, Financial, Data) | AA    | Submissions that are legal, financial or irreversible can be reviewed, corrected or undone. This is what a check-answers page is for.                                     |
| **3.3.7 Redundant Entry**                       | A     | _New in 2.2._ Information already given in a process is not asked for again unless it is essential. Re-displaying answers is fine; making someone retype them is not.     |
| **3.3.8 Accessible Authentication (Minimum)**   | AA    | _New in 2.2._ Signing in does not require remembering, transcribing or solving a puzzle without an alternative. Pasting into password and one-time-code fields must work. |

### Robust

| Criterion               | Level | What it means for a service                                                                                                                                                                      |
| ----------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 4.1.2 Name, Role, Value | A     | Every control exposes what it is, what it does, and its current state. Native HTML elements do this already; anything hand-built has to do it deliberately.                                      |
| 4.1.3 Status Messages   | AA    | Something changing without a page load is announced without stealing focus. Over-using this is its own failure: a message that announces on every page load trains people to ignore all of them. |

SC 4.1.1 Parsing was **removed** in WCAG 2.2. Duplicate IDs are still worth
fixing — they break accessible names — but they are no longer a 4.1.1 failure.

## Checking conformance

**Automated tools find roughly a third of these.** They are excellent at the
mechanical criteria — missing labels, missing alternative text, an undeclared
language, most contrast — and blind to the ones that need judgement: whether an
error message actually helps, whether focus order matches reading order, whether
a link makes sense out of context.

So a clean automated run is a starting point, not a pass. Reading "0 violations"
as "accessible" is the most common mistake in this area.

These need a person, and cannot be delegated to a tool at all:

- Zoom to 200%, and increased text spacing.
- Reflow at 320px.
- Completing the whole task using only a keyboard.
- Completing the whole task with a screen reader, and hearing whether what is
  announced makes sense.
- Session timeout warning and extension.
- Whether an error message lets someone recover.

**Test the error states and the confirmation, not only the happy path.** Those
are where accessibility most often breaks and the states most often left out of
a review.

Include people with access needs in your testing where you can. Conformance with
this page is the floor, not evidence that a service is usable.

## Automated checking used here

The design system publishes an
[accessibility review skill](/ai-skills/accessibility-review/) that checks a page
or service against the criteria on this page, keeping tool-verified findings
separate from judgement. It cites this page rather than carrying its own copy of
the target, so there is one statement of what conformance means.
