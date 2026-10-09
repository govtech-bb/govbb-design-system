---
title: Text case
description: Use sentence case for all interface text, and keep capitals for the words that need them.
order: 6
lede: Sentence case everywhere, with capitals only where the words need them.
---

## Use sentence case

Write interface text in sentence case: capitalise the first word and any
proper names. Keep other capitals only where
[the words need them](#keep-capitals-where-the-words-need-them). This applies
to:

- headings, captions and eyebrows
- labels, legends and hint text
- table headers and summary list keys
- tags and badges
- buttons and links

Write _"Date of birth"_, not _"Date Of Birth"_, and _"Save and continue"_, not
_"Save And Continue"_.

Capital letters remove the shape of words, so text in capitals is harder to
recognise at a glance. Small or low-contrast text, such as eyebrows, badges
and table headers, is the hardest to read in capitals, and is also where
capitals are most often used.

## Do not transform text to capitals

Do not set text in capitals with CSS (`text-transform: uppercase`), a utility
class, or by changing the string in code. Write the text in sentence case and
show it as written.

Do not add letter-spacing to sentence-case text. Wide tracking is a
correction for capitals, so it goes when they do. The slight negative tracking
on large headings (`--govbb-letter-spacing-heading`) is part of the
[type scale](/styles/typography/) and stays.

## Keep capitals where the words need them

Sentence case does not mean lowercase. Keep capitals for:

- proper names, such as _"Saint Michael"_ or _"Barbados Revenue Authority"_
- acronyms and initials, such as _"PDF"_ or _"NIS"_
- codes and identifiers that are stored in capitals, such as a SWIFT/BIC code
  or a reference number
