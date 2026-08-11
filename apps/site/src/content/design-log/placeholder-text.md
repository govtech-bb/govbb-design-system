---
title: Why we don't use placeholder text
date: 2026-07-24
kind: decision
author: GovBB Design System team
summary: Placeholder text is not a substitute for a label or hint. The label and hint should explain the answer on their own.
---

We have decided the design system and the services built on it will **not** use
placeholder text in input fields to tell people what to enter.

## The decision

The visible [label](/components/label/) and, where it is needed,
[hint text](/styles/form-fields/#hint-text-and-placeholders) should explain
sufficiently what answer is expected and how to enter it. If a field still needs
placeholder text to make sense, that is a sign the label or hint is doing too
little, and the fix is to improve them, not to add a placeholder.

## Why placeholder text fails

- It **disappears as soon as someone starts typing**, so any instructions it
  held are gone at the exact moment they are needed, and gone entirely for
  anyone who returns to check their answer.
- It **looks like a prefilled answer**, so people skip the field or try to
  delete text that was never really there.
- It is **commonly rendered with weak contrast**, so it fails
  [WCAG 2.2 AA](https://www.w3.org/TR/WCAG22/) and is hard to read.
- Used **instead of a label**, it leaves the field with no accessible name, so
  screen readers cannot announce what the field is for.

## What to do instead

- Give every field a clear, visible label that states the question or expected
  answer.
- When the label alone cannot explain a format or give an example, put that in
  persistent [hint text](/styles/form-fields/#hint-text-and-placeholders) and
  connect it with `aria-describedby` — for example "As it appears on your ID".
- Never move essential instructions into the `placeholder` attribute.

See the [Form fields foundation](/styles/form-fields/) and the
[Input component](/components/input/) for the markup and the wider rules on
labels and hints.

## Why record this

Recording decisions like this, with the reasoning and the date, means we do not
have to relitigate them later, and new contributors can understand _why_ the
system is the way it is.
