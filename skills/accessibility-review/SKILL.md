---
name: accessibility-review
description: >
  Review a page, component, prototype or whole service against WCAG 2.2 level AA
  and the GovBB Design System's own accessibility contracts, keeping
  machine-verified findings strictly separate from human judgement. Use this
  whenever someone asks whether something is accessible, wants an accessibility
  or a11y review, audit, check or sign-off, mentions WCAG, screen readers,
  keyboard navigation, focus states, colour contrast, alt text or assistive
  technology, asks "will this pass an audit", or is preparing a Government of
  Barbados service to go live — even if they never name a standard. Also use it
  when reviewing a form's error handling or labels, and when the user invokes
  /govbb:accessibility-review.
metadata:
  title: Accessibility review
  audience: public
  status: experimental
  requires: ['node', 'playwright (for browser passes)']
---

# Accessibility review

Review an interface against WCAG 2.2 level AA and the accessibility contracts of
the GovBB Design System.

## The one discipline that makes this review worth reading

**Never report a finding without saying how you know it.** An accessibility
review that asserts "colour contrast passes" without computing a ratio, or
"works with a screen reader" without one having been run, is worse than no
review: it launders a guess into a compliance claim that a service team will
rely on and an auditor will later demolish.

So every finding carries a method tag:

| Tag                 | Means                                                                |
| ------------------- | -------------------------------------------------------------------- |
| `automated`         | A tool reported it. Name the tool and the rule ID.                   |
| `computed`          | You calculated it from real values (contrast ratios, token lookups). |
| `structural`        | Directly observable in the markup or CSS you read. Quote it.         |
| `judgement`         | Your reasoning about likely user impact. Say it's a judgement.       |
| `needs-manual-test` | Only a person with the actual assistive technology can settle it.    |

`needs-manual-test` is a real, respectable outcome. Screen reader announcement
quality, whether an error message actually makes sense to someone who is stuck,
voice control, and switch access cannot be verified from code. Listing them
honestly is more useful than quietly implying they passed.

**Do not produce a score or a percentage.** AA is a floor, not a grade. A "92%
accessible" service still locks people out, and a number invites treating the
remaining 8% as acceptable.

## Step 1 — Establish what you can actually test

Before reviewing anything, work out what evidence is available, because it
determines what you may claim.

Ask, or determine from the repo:

1. **Is there a running URL?** If yes, the browser passes (axe, focus order) are
   available. If not, you are limited to source-based passes — say so in the
   report rather than silently omitting the automated section.
2. **What are the pages or components in scope?** For a service, the whole task
   journey matters more than any single page: the start page, each question page,
   the check-answers page, the error states, and the confirmation. Errors and
   confirmations are where accessibility usually breaks, and they are the states
   people forget to include.
3. **Is it HTML/server-rendered or React?** This changes the contracts in
   Step 3: React wrappers wire some things automatically that HTML consumers must
   do by hand.

If you can start the service yourself, do. `pnpm dev`, `pnpm site:dev` or the
prototype's own dev script; then use the real URL. A review from a running page
is worth several from source.

## Step 2 — Automated pass (axe)

Run `scripts/axe-scan.mjs` over every page in scope:

```sh
node scripts/axe-scan.mjs http://localhost:4321/ http://localhost:4321/components/button/
```

It resolves `axe-core` from the project (including a pnpm store fallback, so it
usually needs no install), runs the WCAG 2.0/2.1/2.2 A and AA rule tags, and
prints a markdown summary plus optional JSON via `--out`.

Report violations with the rule ID and the failing selector. axe catches
perhaps a third of real barriers, so a clean axe run is a starting point and you
should say that explicitly — teams routinely read "0 violations" as "accessible".

If axe cannot run (no URL, no browser, install failure), say so plainly in the
report. Do not substitute your own guesses and present them in the automated
section.

## Step 3 — Component contracts pass

**This is the highest-yield pass for a GovBB service, so give it real
attention.** Most services use the components correctly-looking but
incorrectly-wired, and neither axe nor a casual read catches it.

The pass has two halves, and the split is what keeps the review useful:

- **What the component already guarantees** — never a finding. A review that
  tells a team to fix something the design system already handles teaches them
  the review is noise, and the real findings go unread with it.
- **What the consumer must still wire** — this is where the findings are.

`references/component-contracts.md` explains how to work out each half. Read it
before this pass.

The one thing to internalise: **do not review from a remembered list of
components or behaviours.** Which components exist, which need JavaScript wiring,
and what each guarantees are all facts about the design system as it is _today_,
and every one of them changes as the system grows. A review built on last
quarter's list quietly stops checking whatever was added since, and confidently
clears whatever was changed.

So derive the specifics from the repo and the published guidance each time:

1. **Which components need JavaScript wiring** — read the frontend package's
   progressive-enhancement runtime: its entry point holds a registry mapping each
   module attribute value to the class that upgrades it, and exports the init
   function that scans for them. That registry is the only authoritative list
   (currently `packages/frontend/index.js` — if it has moved, find the module the
   package's `main` export points at). Anything registered there needs both the
   attribute on the element and an init call that runs on the page; without them
   the component silently falls back to its unenhanced form, which usually
   degrades for keyboard and screen reader users first. React consumers get the
   behaviour through the wrappers instead and must not also call init.
2. **What a component guarantees** — read its stylesheet in the frontend
   package's components directory (currently under
   `packages/frontend/src/components/`) and its guidance page at
   `/components/<name>.md`. Shared behaviour — focus, base styles, tokens — lives
   in sibling files at the package's style root rather than per component, so
   check there before concluding a component omits something.
3. **What the consumer must wire** — the component's guidance page, plus
   `/documentation/form-implementation.md` for anything form-related. That page
   is the canonical contract for labels, error connection, error-summary
   behaviour and submission handling; check the service against what it
   currently says rather than against a summary of it.

Alongside those, the requirements that come from WCAG and HTML semantics rather
than from GovBB apply no matter how the design system changes, so they are worth
carrying in your head:

- A group of related controls needs a `fieldset` with a `legend`. Individually
  labelled radios with no legend leave someone with options but no question
  (SC 1.3.1, 3.3.2). This is the most common real defect in government forms.
- An error must be **programmatically** connected to its control —
  `aria-describedby` pointing at the message, `aria-invalid` on the control.
  Visible red text is not a connection (SC 1.3.1, 3.3.1).
- After a failed submission the person must be told what happened without having
  to hunt for it. Focus has to land somewhere that conveys the failure
  (SC 3.3.1); a submit that appears to do nothing is a blocker, not a polish
  item.
- Custom controls need name, role and value exposed (SC 4.1.2). Native elements
  give you this; anything hand-built does not.

## Step 4 — Structure and semantics pass

Read the markup and check what is directly observable. Quote the offending line
for each finding — `structural` findings are only credible with evidence.

- One `h1` per page; heading levels descend without skipping.
- Landmarks present: `header`, `nav`, `main`, `footer`. One `main`.
- `lang` on `<html>`, set to the actual language of the content.
- Page `<title>` unique and describing the page, not the service alone.
- Every control has an accessible name — a `<label for>`, a legend, or an
  `aria-label` where no visible label exists. Placeholder text is not a label,
  and this design system deliberately does not use placeholder text as labels
  (see the design log).
- Skip link present and first in tab order.
- Images: meaningful ones have useful `alt`; decorative ones have `alt=""`.
- Links describe their destination; no bare "click here" or "read more".
- Tables use `th` with `scope`; layout tables are a finding in themselves.
- Buttons are `<button>`, links are `<a href>`. A `div` with a click handler
  fails keyboard access and this is the single most common serious defect.

## Step 5 — Contrast pass (computed)

Never estimate a contrast ratio. Compute it.

```sh
# Prefer token names — resolved live, so you compare what is in effect
node scripts/contrast.mjs govbb-color-interactive govbb-color-surface
node scripts/contrast.mjs --tokens                        # the whole palette

# Hex for a service's own colours, with the measured size and weight
node scripts/contrast.mjs "#3b5b7a" "#f4f4f4" --size 18 --weight bold

# Non-text threshold for boundaries, focus indicators, meaningful graphics
node scripts/contrast.mjs govbb-color-focus govbb-color-surface --non-text
```

The script resolves `--govbb-*` token names through the design system's tokens,
following `var()` chains, so you compare the values actually in effect rather than
the ones you remember. `--tokens` audits the whole semantic palette at once, which
is the fastest way to see the current picture; there is no cached table of ratios
anywhere in this skill, on purpose.

`references/govbb-contrast.md` covers where contrast tends to fail in a
token-based system, and how to report a finding so someone else can reproduce it.

### Choosing the threshold — measure, do not infer

Which threshold applies is where reviewers go wrong, almost always in the lenient
direction. WCAG sets it by the **rendered** size and weight of the text:

| Text                                                                             | AA threshold |
| -------------------------------------------------------------------------------- | ------------ |
| ≥24px regular, or ≥18.66px bold                                                  | 3:1          |
| Anything smaller                                                                 | 4.5:1        |
| Non-text — control boundaries, focus indicators, meaningful graphics (SC 1.4.11) | 3:1          |

Those cutoffs are WCAG's 18pt and 14pt-bold expressed in CSS pixels, which is why
18.66 is not a round number. They are fixed by the standard and safe to rely on.

**What is not safe to rely on is any belief about what size a given piece of text
actually is.** Do not reason from a token name, a heading level, or a remembered
value:

- The type scale changes. A size that needs 4.5:1 today may cross into large-text
  territory tomorrow, or the reverse — and the reverse is the dangerous
  direction, because it silently makes a passing element fail.
- Tokens are declared in `rem`, so the rendered pixel size depends on the root
  font size, and on user zoom and browser font settings. The token value alone
  does not tell you what a person is looking at.
- Headings do not imply sizes. A heading token and a body token can be the same
  size, and services override sizes locally.

So get the real number and hand it to the script:

- **From a running page** — read it off the element:
  `getComputedStyle(el).fontSize` and `.fontWeight`. This is the only method that
  accounts for cascade, overrides and root size.
- **From source** — resolve the token in `tokens.css` and convert against the
  root font size, then treat the result as approximate.
- Pass what you found as `--size` and `--weight`. The script applies the correct
  threshold and names it in the output, so the judgement is in the tool rather
  than in your recollection.

Note that the axe pass already applies the right threshold per element
automatically, because it reads computed styles. Manual computation is for what
axe reports as `incomplete` — typically text over images, gradients or
transparency, where it cannot determine the backdrop. Those are exactly the cases
where a guess is most tempting and least defensible: composite the actual
backdrop, or mark it `needs-manual-test`.

## Step 6 — Keyboard and focus pass

With a running URL, use the script:

```sh
node scripts/focus-order.mjs http://localhost:4321/ --max-tabs 40
```

It tabs through the page and reports the focus order, flags elements that are
scrolled out of view, detects apparent traps, and checks whether each focused
element is **obscured by a sticky or overlapping element** — WCAG 2.2 SC 2.4.11
(Focus Not Obscured), a new AA criterion most reviews miss entirely.

Then reason about what the script cannot see:

- Does tab order follow reading order? A visually reordered layout with an
  unchanged DOM order is a real defect.
- Is every interactive element reachable, and is anything reachable that should
  not be (hidden menus, off-canvas panels, `tabindex` on non-interactive nodes)?
- Can a keyboard user complete the whole task, including dismissing anything
  that opens? An overlay that traps focus with no Escape is a blocker.
- Is the focus indicator visible on every control against its own background?
  Check against `references/govbb-contrast.md`.
- Does anything depend on hover or pointer position alone?

## Step 7 — Content and recovery pass (judgement)

Tag these `judgement` — they are reasoning about user impact, not measurements,
and they matter most for the people the other passes serve least.

- Error messages say what to do, not just what went wrong. "Invalid input"
  tells someone nothing; "Enter a date like 31 3 1980" lets them recover.
- Instructions do not depend on sensory characteristics ("the button on the
  right", "the green box").
- Timeouts warn and can be extended (SC 2.2.1); session expiry does not silently
  destroy entered answers.
- Nothing important is conveyed by colour alone (SC 1.4.1).
- Language is plain enough for the actual audience. Cross-check with the
  `bb:govtech-service-content` skill rather than duplicating its guidance.
- Accessible authentication (SC 3.3.8, new in 2.2): no cognitive test — puzzle,
  transcription, memory game — without an alternative.

## Report format

Order findings by **user impact**, not by criterion number — a team needs to
know what to fix first, and criterion order buries a blocker under a nitpick.
Name the criterion on each finding so the report is still traceable to the
standard.

### Length: compress each finding, never the list

A service team reads this to start fixing things. A report they have to mine is
one they skim, and a skimmed report loses the finding you most wanted them to
act on — so length is a correctness problem, not a style preference.

**What must never be cut to save space:** any confirmed finding, its method tag,
its evidence, the fix, the scope and not-covered lines, or the manual-test list.
If the report is long because the service genuinely has many problems, that is
the right length. Trim words per finding; never the number of findings.

**Budget by severity.** A blocker earns the full field set. Lower-severity items
earn one line each — the same fields, inline:

```markdown
## Minor

7. **Alpha banner is a live region** — `role="status"` on static content, so it
   announces on every page load. SC 4.1.3, `structural`, owner: service. Use a
   heading or a plain landmark instead.
```

**Where the bloat actually comes from**, in rough order:

- **Explaining the criterion** instead of naming it. "SC 2.4.7 Focus Visible
  (AA)" is complete; the reader can look it up and mostly already knows.
- **Narrating the tooling.** Which tool ran belongs in one line at the top. How
  it works, how it resolved a dependency, or what you tried first belongs
  nowhere.
- **An inventory in "Already handled correctly".** Its only job is stopping a
  team from "fixing" working code, so it needs the things a reviewer would
  plausibly have flagged — the near-misses — not everything that passes. Three
  or four items, one line each. Listing every correct decision reads as padding
  and buries the point.
- **Saying it twice.** If the selector is in **Where**, do not restate it in
  **What**. If the fix is obvious from the defect, one clause is enough.
- **Hedging and process notes.** No preamble, no "it's worth noting that", no
  recap of what you were asked to do, no describing your own method beyond the
  tag.

**Two tests before sending.** Could the owner start fixing within two minutes of
opening it? And is every sentence either a finding, its evidence, or its fix? If
a sentence is none of those three, delete it.

```markdown
# Accessibility review: <what was reviewed>

**Scope:** <pages/components and the states covered — include error and
confirmation states, or say they were not reached>
**Standard:** WCAG 2.2 level AA
**Evidence:** <running URL or source-only; each tool that ran and its headline
result, e.g. "axe 4.12: 0 violations, 1 incomplete (resolved by computation)">
**Not covered:** <what you could not test, and why>
**Findings:** <n> blocking · <n> degrading · <n> minor · <n> need manual testing

## Summary

<2–3 sentences: the shape of the problems and what to fix first. Not a score,
not a recap of the scope above.>

## Blocks a task

Findings that stop someone completing the service.

### 1 · <Short title>

**SC 1.3.1 Info and Relationships (A)** · `structural` · owner: service

- **Where:** `src/pages/apply.astro:42` — or selector + URL for a live page
- **What:** <the defect, evidence quoted once. For `computed`, give the command
  and the value it returned so the reader can reproduce it.>
- **Who it affects:** <the barrier, in a clause — not "users with disabilities">
- **Fix:** <the change, in one or two lines>

## Degrades the experience

<Same shape. Drop **Who it affects** where the barrier is self-evident.>

## Minor

<One line each: number, bold title, the defect, (criterion, method, owner), the
fix.>

## Already handled correctly

<Three or four lines, max. Only the near-misses — things a reviewer would
plausibly have flagged. This exists to stop teams "fixing" working code, not to
inventory everything that passes.>

## Needs manual testing

<Numbered list, one line each: the check, and the AT or condition needed. A task
list, not a disclaimer.>
```

Three fields carry most of the format's weight:

**Number every finding.** It gives people a handle — "is 4 fixed yet?" in a PR
comment, a stand-up, or an issue title. Number straight through the severity
bands in the order they appear. When re-reviewing the same service, **keep the
numbers from the previous report** for findings that are still present and add
new ones at the end; renumbering silently invalidates every reference anyone
made.

**State the owner: `service` or `design system`.** Whoever can actually change
the code. A service team cannot fix a core token or a shared component, so a
finding aimed at the wrong owner sits open forever and teaches them to ignore
the next report. This is also what Step 8 splits on when filing issues — decide
it once here rather than re-deriving it later.

**Criterion, method and owner go on one line**, directly under the title, so the
reader can triage a finding without reading it. Prose belongs in the fields
below.

For a re-review, add `status: new | still present | fixed` to that same line, and
list fixed items under a short `## Fixed since last review` heading. Repeat
reviews are the normal case for a service heading to go live, and a report that
cannot express "this one is still here" makes the second review look like an
unrelated document.

Add a **Criterion coverage** table only when someone has asked for audit
traceability. It is long, it is the least-read part of any review, and the
`Not covered` line at the top already tells a service team what they still owe.

## Step 8 — Offer to file the findings as issues

A review that lands in a chat window gets read once. Once the report is
delivered, **ask whether to open issues for the findings** — something like:

> Would you like me to open issues for these findings? I can file them in this
> repo or in the service's own repo, and label them to match what the repo
> already uses.

Ask rather than assume. Filing issues is outward-facing and hard to undo quietly:
a dozen unwanted issues is somebody's afternoon. Wait for a yes, and for an answer
on **which repo**, before creating anything.

If they say yes:

1. **Split by who can fix it** — group by the `owner` field each finding already
   carries, because `service` and `design system` belong in different repos. A
   service team cannot fix a core token, and an issue asking them to will sit open
   forever. Confirm the target repo for each group rather than putting everything
   in one.
2. **Read the repo's labels before choosing any** — `gh label list`. Use the
   labels that exist; the repo may already have an accessibility label, a severity
   scheme, or a component-scoped convention worth matching. Do not invent a
   taxonomy, and do not assume one from another repo. If nothing suitable exists,
   propose the labels you would create and let the user decide before you create
   them.
3. **Search for duplicates first** — `gh issue list --search "..."`, including
   closed issues. This matters most for design-system findings, which recur in
   every review of every service: a known open question should gain a comment on
   its existing issue, not a fifth duplicate.
4. **One issue per fix, not one per review and not one per line.** Group findings
   that a single change resolves; split findings that need separate work. An
   omnibus "accessibility review" issue cannot be closed incrementally, so nobody
   closes it.
5. **Carry the evidence across.** Each issue keeps the criterion, the method tag,
   the location, who it affects, and the suggested fix — and for anything
   `computed`, the command and the value it returned, so the next person can
   reproduce it instead of taking it on trust. An issue reading "contrast too low"
   is the same assertion this skill exists to avoid.
6. **Put the finding's number in the issue** so the report and the issues stay
   cross-referenceable, and record the issue URLs back against the findings. On a
   re-review, that is what lets you mark one `fixed` instead of filing it again.
7. **Do not file `needs-manual-test` items as defects.** They are unverified, and
   filing them as bugs manufactures a backlog of things nobody can confirm or
   close. Offer a single issue for the manual-testing pass instead, listing them
   as its checklist.

Show the titles, labels and target repo for confirmation before creating, then
report back the issue numbers and URLs.

## Boundaries

- **This is not an audit or a certification.** It is a review that finds
  problems early and cheaply. A formal audit involves disabled people using the
  service. Say this if anyone asks whether the service "passes".
- **Conformance, not usability.** If the finding is that a journey is confusing
  rather than inaccessible, that belongs to `design-critique`. Where they
  overlap — a screen reader user lost in a form — report the conformance failure
  here and leave the experience narrative to that skill.
- **Do not rewrite the service.** Report findings with specific fixes. Apply
  fixes only when asked, and then one at a time so each can be reviewed.
- **Do not weaken a finding because it is inconvenient.** If a core component
  has a problem, say so and route it to the design system rather than advising a
  service team to work around it.

## References

Read these as needed rather than upfront:

- `references/wcag-22-aa.md` — the AA criteria organised for review, with what
  each one actually means for a government form. Includes the WCAG 2.2 additions
  that older checklists omit.
- `references/component-contracts.md` — how to work out what the design system
  guarantees versus what the consumer must wire, then the consumer's duties
  organised by kind of control rather than by component name. Read in Step 3.
- `references/govbb-contrast.md` — where contrast fails in a token-based system,
  and how to report a finding reproducibly. Holds no values, by design.

## Scripts

All are plain Node ESM with no build step. Run with `--help` for options.

- `scripts/axe-scan.mjs` — axe-core over one or more URLs via Playwright.
- `scripts/contrast.mjs` — contrast ratios from hex values or `--govbb-*` token
  names, with the correct threshold for a given text size and weight.
- `scripts/focus-order.mjs` — tab order, focus visibility, trap and
  focus-obscured detection.
