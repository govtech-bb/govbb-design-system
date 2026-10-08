---
title: Accessibility
description: The accessibility standard Government of Barbados services built with this design system must meet, and how to check against it.
lede: Services built with this design system must conform to WCAG 2.2 level AA.
---

Services built with the GovBB Design System must conform to
[WCAG 2.2](https://www.w3.org/TR/WCAG22/) level **AA**. The criteria, and what
each one requires, are in the W3C specification. Check your work against
[How to Meet WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/), the W3C's
quick reference, with its filter set to levels A and AA.

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

**2.2 rather than 2.1** because it is the current recommendation. Its new
criteria at A and AA cover authentication, dragging, target sizes, help
placement, re-entering information, and focus hidden behind sticky page
furniture, all of which matter in transactional government services. A team
working from a 2.1 checklist will miss them. See
[What's new in WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/).

## What the design system gives you, and what it does not

Using the design system gets you a long way, and it does not get you all the
way. Roughly:

**The design system's half.** Hit areas on interactive controls, sensible
heading and text sizing, and components whose markup carries the semantics they
need. Focus indicator contrast and Windows High Contrast rendering are not yet
reliable across every component, so check both in your service.

**Your service's half.** Everything about _your_ content and _your_ journey:
labels associated with their controls, errors connected to the fields they
describe and worded so someone can recover, heading structure that reflects the
page, link text whose purpose is clear, alternative text, the order
things receive focus, and whether the task can be completed at all without a
mouse or without JavaScript.

A page built entirely from design-system components can still fail many WCAG
criteria. Conformance is a property of the service, not of the parts it is
assembled from.

## Checking conformance

**Automated tools find a minority of WCAG failures.** They are excellent at the
mechanical criteria — missing labels, missing alternative text, an undeclared
language, most contrast — and blind to the ones that need judgement: whether an
error message actually helps, whether focus order matches reading order, whether
a link makes sense out of context.

So a clean automated run is a starting point, not a pass. Reading "0 violations"
as "accessible" is the most common mistake in this area.

These need a person to confirm, even where a tool can help with part of the check:

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
WCAG 2.2 AA is the floor, not evidence that a service is usable.

## Automated checking used here

The design system publishes an
[accessibility review skill](/ai-skills/accessibility-review/) that checks a page
or service against this standard, keeping tool-verified findings separate from
judgement. It takes the target from this page.
