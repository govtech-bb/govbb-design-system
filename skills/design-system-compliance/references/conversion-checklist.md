# Conversion checklist

Hand-written companion to the live site. Use it during
Step 2 (inventory) and Step 3 (convert).

## Contents

- [Translating names](#translating-names)
- [What the system deliberately does not have](#what-the-system-deliberately-does-not-have)
- [Worked example](#worked-example)
- [Per-target checklist](#per-target-checklist)

## Translating names

Design systems name the same behaviour differently. Match on what a thing
_does_, not what the prototype calls it. Confirm every row against
the site before using it — this table exists to stop you concluding
"no component exists" too early, not to replace the site.

| The prototype calls it                                    | GovBB component                    |
| --------------------------------------------------------- | ---------------------------------- |
| Alert, notification, callout, flash message, inline toast | **Status banner**                  |
| Accordion, details, disclosure, expander, "read more"     | **Show/hide**                      |
| Definition list, key–value pairs, review/answers list     | **Summary list**                   |
| Data table, grid                                          | **Table**                          |
| Validation summary, error banner at the top of a form     | **Error summary**                  |
| Inline field error, validation message                    | **Error message** (see Form group) |
| Helper text, description under a field                    | **Hint** (see Form group)          |
| Text field, textarea, email or phone input                | **Input**                          |
| Numeric stepper, quantity spinner                         | **Number input**                   |
| Dropdown used as a form control, simple combobox          | **Select**                         |
| Segmented control, "pick one" option list                 | **Radio**                          |
| Multi-select boxes, opt-in list                           | **Checkbox**                       |
| Date picker, date-of-birth fields                         | **Date input**                     |
| File picker, drag-and-drop upload, attachment field       | **File upload**                    |
| Related controls sharing one question                     | **Fieldset**                       |
| Search bar                                                | **Search**                         |
| Breadcrumb trail                                          | **Breadcrumbs**                    |
| Back link, "previous" link                                | **Back button**                    |
| Skip nav, "jump to content"                               | **Skip link**                      |
| Site header, masthead, top nav                            | **Header**                         |
| Site footer                                               | **Footer**                         |
| Government identity strip, "an official site" bar         | **Official banner**                |
| Service directory, list of links with descriptions        | **Service list**                   |
| Order summary, cost breakdown, fees table                 | **Payment**                        |
| "Was this page useful?" widget                            | **Feedback**                       |
| Anchor, hyperlink                                         | **Link**                           |
| Bulleted or numbered list                                 | **List**                           |
| Any call to action, primary/secondary/danger              | **Button**                         |

## What the system deliberately does not have

No component exists for these. That is usually a **design decision, not a
gap** — government services follow one-thing-per-page, which removes the need
for most of them. Treating them as missing features and building lookalikes is
how a service drifts away from the system.

| Not in the system            | What to do instead                                                                                                                           |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Modal, dialog, lightbox      | Give it its own page. Interrupting a task in an overlay is hostile on small screens and to screen readers.                                   |
| Tabs                         | Separate pages, or sections with headings.                                                                                                   |
| Carousel                     | Show the content. Carousels hide most of it.                                                                                                 |
| Tooltip, popover             | **Hint** text for form fields; **Show/hide** for longer asides. Hover-only content is unreachable by touch and keyboard.                     |
| Card                         | Compose from typography, **Link** and spacing tokens. For a list of services, use **Service list**.                                          |
| Progress bar, step indicator | Check `/templates/` — the multiple-questions-page and single-question-page templates cover journey structure.                                |
| Pagination                   | Not covered. Record it as a gap.                                                                                                             |
| Toggle switch                | **Checkbox**. A switch and a checkbox do the same job; only one is in the system.                                                            |
| Badge, tag, chip             | Not covered. Record it as a gap.                                                                                                             |
| Autocomplete, typeahead      | **Select** if the list is short and known. Otherwise record it as a gap — an accessible autocomplete is a real component, not a styling job. |

When something lands here, say so in the report. "The system deliberately has
no modal; this step became its own page" is a useful sentence. Quietly
inventing `govbb-modal` is not.

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
- [ ] `data-govbb-module` present on Header, File upload, Number input
- [ ] `initAll()` called once, after the document exists
- [ ] Image and font assets resolved from `@govtech-bb/frontend/assets/*` and
      passed to Header, Footer and Official banner as URLs
- [ ] No `initAll()` over React components (there should be none here)

### React

- [ ] `@govtech-bb/frontend` and `@govtech-bb/react` installed
- [ ] `@govtech-bb/frontend/css` imported once at the app root, not per component
- [ ] Components imported from `@govtech-bb/react`
- [ ] No `initAll()` anywhere — the wrappers carry their own behaviour
- [ ] Where no wrapper exists, hand-written `govbb-` markup is fine; just do not
      also use a wrapper for the same element

### Both

- [ ] Page furniture present: Skip link, Official banner, Header, Footer
- [ ] Every form control keeps its label association, hint and error wiring
- [ ] Literal colours, spacing and font sizes replaced with `--govbb-*` tokens,
      preferring semantic names over the primitive ramp
- [ ] Works with JavaScript disabled, or degrades honestly
- [ ] Gap list written, with each gap routed
