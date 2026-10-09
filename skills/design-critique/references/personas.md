# The six personas

Each persona is a **constraint**, not a personality. This is the single decision
that makes the method produce usable findings, so it is worth being explicit
about why.

A persona written as a character — "Doreen, 68, doesn't trust computers" —
invites you to imagine what Doreen would feel, and imagination is not evidence.
You end up writing findings that sound like research and are actually fiction,
which is worse than writing nothing because a meeting will treat them as real.

A persona written as a constraint — 360px viewport, JavaScript disabled, network
dropped — puts the service under a condition that either breaks it or does not.
The finding is then reproducible: anyone can run the same step and see the same
screenshot.

The cost of this choice is real and worth stating: constraints cannot model
comprehension, trust, motivation or prior knowledge. Those questions route to
`needs-real-users`. That is the honest boundary of a headless browser.

---

## first-time-older-user

**Constraint:** 1280×800 with the root font size at 1.5× (24px base).

**Standing in for:** someone unfamiliar with the journey, reading at a larger
text size, with low tolerance for jargon and for steps that cannot be undone.

**What it can show.** Text scaling is where a service's layout assumptions come
apart: fixed-height containers clip, two columns collide, a button leaves the
viewport, a fixed header eats a third of the screen. All of it is visible in the
screenshot and none of it is in the JSON — so look at the images.

**What it cannot show.** Anything about age. This is a text-scale and
unfamiliarity proxy, and writing "older users will struggle" from it is exactly
the fiction the constraint framing exists to prevent. Say "at 1.5× text, the
Continue button is below the fold".

**Watch for:** content that reflows into an order that no longer reads
top-to-bottom; hint text that scrolls away from the field it explains;
irreversible actions with no confirmation step.

---

## confident-repeat-user

**Constraint:** 1440×900, journey run at full speed with no dwell time.

**Standing in for:** someone who has done this before, wants to skip the
explanation, and will give up if the service makes them re-read it.

**What it can show.** How many steps and pages stand between arriving and the
thing the user came for. Whether the service demands information it already has.
Whether a repeat user can get straight to the task or is routed through
onboarding every time.

**What it cannot show.** Abandonment. You can count steps; you cannot know
which step someone quits at. That needs analytics or research.

**Watch for:** a landing page that must be read before a "Start" link appears;
mandatory interstitials; the same information asked twice across pages.

---

## small-screen-mobile-user

**Constraint:** 360×640, `isMobile`, touch enabled.

**Standing in for:** the most common way a Barbadian will meet a government
service — a mid-range phone.

**What it can show.** Reflow, horizontal scrolling, tap targets too small or too
close together, content pushed below the fold, tables that do not fit.

**What it cannot show.** On-screen keyboard occlusion — there is no soft
keyboard in a headless browser, so you cannot claim "the keyboard covers the
input". If a field sits low in the viewport, say that it sits low and flag it
as worth checking on a real device.

**Watch for:** the primary action off-screen at the bottom; a horizontal scroll
bar; anything that assumes hover.

---

## js-blocked-user

**Constraint:** `javaScriptEnabled: false`.

**Standing in for:** the progressive-enhancement contract the design system
depends on. Components that upgrade via `data-govbb-module` and `initAll()`
degrade to plain HTML when the script never runs.

**What it can show.** Whether the journey is completable at all without
JavaScript. This is the sharpest test in the set, because the answer is binary
and the failure is total: a form that only submits via a click handler is dead.

**What it cannot show.** Slow connections. Nothing here is throttled. "Works
with JS blocked" and "works on 2G" are different claims and only the first is
supported.

**Watch for:** buttons that do nothing; navigation that never opens; validation
that never fires so the user submits blind; content injected at runtime that
simply is not there.

---

## offline-user

**Constraint:** loads the service, then the network drops before the journey
continues.

**Standing in for:** an interrupted session — a dropped connection mid-form,
which on a phone is ordinary rather than exceptional.

**What it can show.** What the user is left looking at. A browser error page
means the service said nothing of its own. Whether anything the user typed
survives, or whether they restart from the beginning.

**What it cannot show.** Recovery behaviour over time, or whether a retry
succeeds later.

**Watch for:** `chrome-error://` in the observations — that is the browser's
page, not the service's; data loss on the way back; no indication anything went
wrong until the user presses submit.

---

## screen-reader-user

**Constraint:** the accessibility tree is captured at every step via
`ariaSnapshot()`.

**Standing in for:** non-visual traversal of the journey.

**What it can show.** Whether a control is in the tree at all, and whether it
has a name and a role. An unlabelled input, a button whose name is its icon, an
error message absent from the tree entirely — all visible here, all fatal, all
cheap to find.

**What it cannot show — and this one gets overclaimed constantly.** The tree is
not a screen reader. It cannot tell you what order things are announced in,
whether a live region fires, how verbose a label is, or whether the experience
makes sense. Those need a person using real assistive technology, and findings
about them route to `needs-real-users` or to `accessibility-review`'s
`needs-manual-test`.

**Watch for:** a control with no accessible name; a form field whose hint is not
associated with it; an error summary that is not in the tree after a failed
submission; heading levels that skip.

---

## Reading overlap

Six blind personas hitting the same defect is the strongest signal this method
produces, because they share no session and no context — the only thing they
have in common is the service. Promote anything three or more of them hit.

Overlap between the screen reader persona and `accessibility-review` is expected
and fine. Name the experience here, and leave the conformance verdict to that
skill rather than issuing two that might disagree.
