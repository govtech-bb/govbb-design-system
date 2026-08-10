# Conversion checklist

Hand-written companion to the live site. Use it during Step 2 (inventory) and
Step 3 (convert).

## Contents

- [Translating names](#translating-names)
- [When something looks missing](#when-something-looks-missing)
- [Worked example](#worked-example)
- [Per-target checklist](#per-target-checklist)

## Translating names

Design systems name the same behaviour differently, which makes the prototype's
vocabulary the wrong thing to search for. Work out what an element _does_, find
the candidate on the site, then read its page to confirm. The site holds the
answer; what follows is only the method for getting there.

Fetch `/components/` once. Every entry has a one-line description of what the
component is for, and the entries are grouped — form elements, navigation,
content and so on — so you can narrow to a group before reading descriptions.
Then:

- **Search for the behaviour, not the label.** For an accordion, look for wording
  about revealing content on demand; for a definition list, wording about
  key/value pairs. "Expander", "read more" and "disclosure" appear nowhere on the
  site, but the behaviour they share does, and one GovBB component often absorbs
  all three prototype names.
- **Split a generic word before you search.** "Dropdown" is a form control in one
  prototype and a navigation menu in another. Decide which you have first, or you
  will match the wrong entry and carry the mistake into the markup.
- **Distrust a name that matches too neatly.** Status banner sounds like the home
  for any alert or flash message; its page says it is for where a page sits in
  its lifecycle, and sends form validation to Error summary instead. A familiar
  name is a reason to open the page, not to skip it.
- **Look inside components, not only at them.** Some behaviour is part of a
  larger component rather than a component of its own — hint text and inline
  error messages belong to Form group, for instance. If a behaviour has no entry
  of its own, read the pages of the components it would sit inside before
  deciding it is absent.

When two components both look plausible, fetch both `.md` pages and read the
"when not to use" guidance on each: it is written to separate exactly these
pairs, and usually names the rival component outright. If it still does not
decide it, use the closer one and say in the report which alternative you
rejected and why — a named choice can be reviewed, a silent one cannot.
Concluding that nothing fits is only safe once you have searched by behaviour and
come up empty; an inventory done by name is what makes the novel bucket look
large.

## When something looks missing

Government services follow one thing per page, and that single decision removes
the need for a whole family of interface furniture: overlays that interrupt a
task, tab strips and carousels that hide most of their content, hover-only text
that touch and keyboard users never reach. So when a prototype uses something
you cannot find, the first question is not "how do I build it" but "does the page
still need it once the task is one thing per page". Often it does not, and the
absence is a deliberate design decision rather than a gap.

Confirm the absence before acting on it: search `/components/` by behaviour as
above, and check `/sitemap/` for a pattern or template too, since a multi-step
journey or a whole task is more often solved there than assembled from
components. The system gains components over time, so a belief that something
does not exist ages badly — and a hand-rolled lookalike sitting beside a real
component is worse than either mistake alone.

If it genuinely is not there, one of three things is true, and it is worth saying
which:

- **The behaviour becomes its own page.** Anything that interrupts a task — a
  confirmation overlay, a step buried in a wizard — reads better as a page with a
  heading, a URL and a back link, and it survives a small screen.
- **It composes from what exists.** Typography, links, lists and the spacing and
  colour tokens cover most of what prototypes reach for a bespoke component for.
  Composition from published parts stays inside the system; a new `govbb-` class
  does not.
- **It is a real gap.** Some things are genuine components with real
  accessibility requirements rather than a styling job, and the honest answer is
  to record them for the design system team.

Either way, say so in the report. "The system has no modal, so this step became
its own page" is a useful sentence. Quietly inventing `govbb-modal` is not.

## Worked example

A Tailwind prototype field:

```html
<div class="mb-4">
  <label class="block text-sm font-bold text-gray-800 mb-1" for="nid">
    National ID number
  </label>
  <p class="text-xs text-gray-500 mb-2">For example, 123456-7890</p>
  <input
    id="nid"
    class="w-full border-2 border-gray-400 px-3 py-2 rounded"
    style="font-size: 20px"
  />
</div>
```

Converted to the HTML target:

```html
<div class="govbb-form-group">
  <label class="govbb-label" for="nid">National ID number</label>
  <span class="govbb-hint" id="nid-hint">For example, 123456-7890</span>
  <input
    class="govbb-input"
    id="nid"
    name="nid"
    type="text"
    aria-describedby="nid-hint"
  />
</div>
```

This matches the canonical markup on the
[Input page](https://design-system.service.alpha.gov.bb/components/input/)
element for element. When a component's guidance page shows the markup, copy
its shape rather than approximating it — the `<span>` for hints and the
attribute set are what the CSS and the accessibility review both assume.

What actually happened, beyond the class swap:

- The literal `20px` disappeared. `.govbb-input` already carries
  `--govbb-font-size-body`, so re-declaring it would fight the system.
- The hint gained an `id` and the input an `aria-describedby`. The prototype
  showed the hint; it did not associate it. Conversion is the moment to fix
  that, because you are already editing both lines.
- The spacing utilities (`mb-4`, `mb-1`) went away rather than becoming token
  equivalents. `.govbb-form-group` owns that rhythm — replacing one spacing
  system with another inside a component that already handles it is how pages
  end up double-spaced.

Note that **every Tailwind class is gone**, not translated. That is the target
state: the page-level layout moves to `govbb-width-container` and the
`govbb-grid-*` columns, type moves to the `govbb-text-*` utilities, and
component-internal spacing is already handled by the component. A converted
prototype should be liftable into alpha without someone first having to unpick a
second styling system.

If a genuinely bespoke layout remains, write plain CSS against `--govbb-*`
tokens rather than reaching back for utility classes.

## Per-target checklist

### HTML / server-rendered

- [ ] `@govtech-bb/frontend` installed; `@govtech-bb/frontend/css` imported once
- [ ] Every class read from the component's page on the site
- [ ] `data-govbb-module` present wherever the component's page shows it — the
      behavioural components carry it in their canonical markup, so copying the
      markup rather than retyping it gets this right
- [ ] `initAll()` called once, after the document exists
- [ ] Image and font assets resolved from `@govtech-bb/frontend/assets/*` and
      passed in as URLs; the page-furniture pages show which attribute or prop
      each one expects
- [ ] No `initAll()` over React components (there should be none here)

### React

- [ ] `@govtech-bb/frontend` and `@govtech-bb/react` installed
- [ ] `@govtech-bb/frontend/css` imported once at the app root, not per component
- [ ] Components imported from `@govtech-bb/react`
- [ ] No `initAll()` anywhere — the wrappers carry their own behaviour
- [ ] Where no wrapper exists, hand-written `govbb-` markup is fine; just do not
      also use a wrapper for the same element

### Both

- [ ] Page furniture present — everything in the page-furniture group on
      `/components/`, plus the Skip link
- [ ] Every form control keeps its label association, hint and error wiring
- [ ] Literal colours, spacing and font sizes replaced with `--govbb-*` tokens,
      preferring semantic names over the primitive ramp
- [ ] Works with JavaScript disabled, or degrades honestly
- [ ] Gap list written, with each gap routed
