---
title: Combobox
description: Use the combobox component to let users choose one option from a long list by typing to filter it.
lede: Lets users type to filter a long list and choose one option.
group: Form elements
---

## Preview

```html title="Combobox with hint text"
<div class="govbb-form-group">
  <label class="govbb-label" for="country">Country of birth</label>
  <span class="govbb-hint" id="country-description"
    >Start typing to filter the list</span
  >
  <div class="govbb-combobox" data-govbb-module="combobox">
    <select
      class="govbb-select"
      id="country"
      name="country"
      aria-describedby="country-description"
    >
      <option value="" disabled selected>Select a country</option>
      <option value="ag">Antigua and Barbuda</option>
      <option value="bs">Bahamas</option>
      <option value="bb">Barbados</option>
      <option value="bz">Belize</option>
      <option value="ca">Canada</option>
      <option value="dm">Dominica</option>
      <option value="gd">Grenada</option>
      <option value="gy">Guyana</option>
      <option value="jm">Jamaica</option>
      <option value="kn">Saint Kitts and Nevis</option>
      <option value="lc">Saint Lucia</option>
      <option value="vc">Saint Vincent and the Grenadines</option>
      <option value="tt">Trinidad and Tobago</option>
      <option value="gb">United Kingdom</option>
      <option value="us">United States</option>
    </select>
  </div>
</div>
```

```tsx
import { Combobox } from '@govtech-bb/react';

<Combobox
  label="Country of birth"
  description="Start typing to filter the list"
  name="country"
  defaultValue=""
  options={[
    { value: '', label: 'Select a country', disabled: true },
    { value: 'ag', label: 'Antigua and Barbuda' },
    { value: 'bs', label: 'Bahamas' },
    { value: 'bb', label: 'Barbados' },
    { value: 'bz', label: 'Belize' },
    { value: 'ca', label: 'Canada' },
    { value: 'dm', label: 'Dominica' },
    { value: 'gd', label: 'Grenada' },
    { value: 'gy', label: 'Guyana' },
    { value: 'jm', label: 'Jamaica' },
    { value: 'kn', label: 'Saint Kitts and Nevis' },
    { value: 'lc', label: 'Saint Lucia' },
    { value: 'vc', label: 'Saint Vincent and the Grenadines' },
    { value: 'tt', label: 'Trinidad and Tobago' },
    { value: 'gb', label: 'United Kingdom' },
    { value: 'us', label: 'United States' },
  ]}
/>;
```

`options` maps to `<option>` elements; `<option>` children work too. The
`value`, `defaultValue` and `onChange` props belong to the underlying select,
exactly as on [Select](/components/select/).

The Combobox component is a text input that filters a long list of options as
the user types, then lets them choose one. It is a progressive enhancement of a
native `<select>`: without JavaScript users get the select, and with it the
select stays in the form, so the chosen value still submits under the same
`name` and the visible labels can keep mapping to whatever values the service
needs. The same enhancement also works over a plain text input, offering
suggestions for free text: see
[Free text with suggestions](#free-text-with-suggestions).

## Usage

<div class="govbb-usage-guidance">
  <section class="govbb-usage-guidance__item" aria-labelledby="combobox-when-to-use">
    <h3 id="combobox-when-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--do" aria-hidden="true">✓</span>
      When to use
    </h3>
    <ul>
      <li>Use a combobox for one choice from a long list users already know the answer to, such as a country, a school or an occupation, where scrolling a select would be slow.</li>
      <li>Use it when the answer must stay one of the options, for example because each label maps to a code or an address the service relies on.</li>
    </ul>
  </section>
  <section class="govbb-usage-guidance__item" aria-labelledby="combobox-when-not-to-use">
    <h3 id="combobox-when-not-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--dont" aria-hidden="true">×</span>
      When not to use
    </h3>
    <ul>
      <li>Do not use it for a short list: <a href="/components/radio/">radio buttons</a> show every option, and a <a href="/components/select/">select</a> handles a familiar list of a dozen or so.</li>
      <li>Do not use it for an answer that is not on the list. If users may need to type something new, use an <a href="/components/input/">input</a>.</li>
    </ul>
  </section>
</div>

## Best practices

### Keep the options in the select

The options live in the `<select>`, so the same markup serves users with and
without JavaScript and the server validates one submitted value. Start the list
with a non-selectable placeholder option such as _"Select a country"_ so nothing
is chosen by default. Initialise the HTML enhancement with `initAll()` from
`@govtech-bb/frontend`; the React component enhances itself.

### Tell users they can type

Add hint text such as "Start typing to filter the list". The field looks like a
text input, and the list opens as soon as the user types or clicks into it, so
users who recognise their answer more easily than they recall it can still
browse the whole list.

### Write labels the way users type them

Filtering matches anywhere in an option's label, ignoring case and accents, so
"lucia" finds "Saint Lucia". Keep labels unique and spell them out in full
rather than abbreviating.

## How it works

The enhancement keeps the `<select>` in the form but hides it from assistive
technology and the tab order, and adds:

- a text input with `role="combobox"`, which takes over the select's `id` so
  the label, hint and error message stay connected. It carries
  `aria-expanded`, `aria-controls` pointing at the list and
  `aria-autocomplete="list"`;
- the list, a `role="listbox"` named by the field's label, holding one
  `role="option"` per matching choice. Focus never leaves the input:
  `aria-activedescendant` names the highlighted option, which is also marked
  `aria-selected`. The option currently chosen is shown bold;
- a visually hidden status region that announces how many options match.

Keyboard support:

- Type to filter. Click or tap the field to see the whole list.
- Down and Up arrow open the list and move the highlight, wrapping at the ends
  and skipping disabled options.
- Enter chooses the highlighted option. With nothing highlighted it closes the
  list rather than submitting the form.
- Escape closes the list and leaves the value as it was.
- Tab, or clicking elsewhere, closes the list. Text that exactly matches an
  option chooses it, an emptied field clears the choice, and anything else
  reverts to the chosen option, so the select never holds a value that is not
  one of its options.

Change the text shown when nothing matches with `data-empty-label` on the
`.govbb-combobox` wrapper, or the `emptyLabel` prop in React. The default is
"No results found".

Choosing an option fires `input` and `change` on the select, then a bubbling
`govbb-combobox-select` event on the wrapper whose `detail` holds the option's
`index`, `value` and `label`.

## Free text with suggestions

When the answer does not have to be one of the options, wrap a text input and a
`<datalist>` instead of a select. The input keeps carrying the value, and
whatever options the page puts in the datalist are offered as suggestions:
shown as they are, not filtered, so a lookup service simply rewrites the
datalist as results arrive and the list follows. Without JavaScript the
browser's own datalist suggestions apply. This is the shape for an address
lookup or a search box; GOV.UK calls this pattern an autocomplete.

```html title="Free text with suggestions"
<div class="govbb-form-group">
  <label class="govbb-label" for="street">Street</label>
  <span class="govbb-hint" id="street-description"
    >Start typing to see suggestions, or type the street yourself</span
  >
  <div class="govbb-combobox" data-govbb-module="combobox">
    <input
      class="govbb-input"
      id="street"
      name="street"
      list="street-suggestions"
      aria-describedby="street-description"
    />
    <datalist id="street-suggestions"></datalist>
  </div>
</div>
<script>
  // Stand-in for a lookup service: refill the datalist as the user types.
  const streets = [
    'Bay Street',
    'Broad Street',
    'Roebuck Street',
    'Spry Street',
    'Swan Street',
    'Tudor Street',
  ];
  const street = document.getElementById('street');
  const suggestions = document.getElementById('street-suggestions');
  street.addEventListener('input', () => {
    const typed = street.value.trim().toLowerCase();
    suggestions.replaceChildren(
      ...streets
        .filter((name) => typed && name.toLowerCase().includes(typed))
        .map((name) => new Option(name)),
    );
  });
</script>
```

```tsx
import { Autocomplete } from '@govtech-bb/react';
import { useState } from 'react';

const streets = [
  'Bay Street',
  'Broad Street',
  'Roebuck Street',
  'Spry Street',
  'Swan Street',
  'Tudor Street',
];

function StreetField() {
  const [street, setStreet] = useState('');
  const typed = street.trim().toLowerCase();
  return (
    <Autocomplete
      label="Street"
      description="Start typing to see suggestions, or type the street yourself"
      name="street"
      value={street}
      onChange={(event) => setStreet(event.target.value)}
      suggestions={streets
        .filter((name) => typed && name.toLowerCase().includes(typed))
        .map((name) => ({ value: name }))}
    />
  );
}
```

Each suggestion has a `value`, which the field takes when it is chosen, and an
optional `label` to show in the list instead, for example a full formatted
address for a value that is just its first line. `onSuggestionSelect` receives
the chosen suggestion and its index after `onChange`, which is where a form
fills in related fields such as the parish or coordinates. In HTML, listen for
the `govbb-combobox-select` event and read the `<option>`'s attributes.

The list only opens once the user has typed something, and closes when the
datalist is empty: no "No results found" row, because the typed text is a valid
answer on its own. Enter with nothing highlighted submits the form as it would
in any text input.

## Errors

When a combobox fails validation, show an error message (`.govbb-error-message`)
above the field with `role="alert"`, and mark the select with
`aria-invalid="true"` and `aria-describedby` pointing at the error message id.
The enhancement copies both onto the input. Keep error messages specific and
actionable, such as "Enter and select a country".

```html title="Combobox with error"
<div class="govbb-form-group">
  <label class="govbb-label" for="country">Country of birth</label>
  <span class="govbb-error-message" id="country-error" role="alert">
    Enter and select a country
  </span>
  <div class="govbb-combobox" data-govbb-module="combobox">
    <select
      class="govbb-select"
      id="country"
      name="country"
      aria-invalid="true"
      aria-describedby="country-error"
    >
      <option value="" disabled selected>Select a country</option>
      <option value="ag">Antigua and Barbuda</option>
      <option value="bb">Barbados</option>
      <option value="lc">Saint Lucia</option>
    </select>
  </div>
</div>
```

```tsx
import { Combobox } from '@govtech-bb/react';

<Combobox
  label="Country of birth"
  error="Enter and select a country"
  name="country"
  defaultValue=""
  options={[
    { value: '', label: 'Select a country', disabled: true },
    { value: 'ag', label: 'Antigua and Barbuda' },
    { value: 'bb', label: 'Barbados' },
    { value: 'lc', label: 'Saint Lucia' },
  ]}
/>;
```
