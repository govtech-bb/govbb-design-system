---
title: Search
description: Use the search component to let users find content by keyword.
lede: Lets users find pages and services by entering a search term.
group: Navigation
---

## Preview

```html title="Search"
<form
  role="search"
  class="govbb-search"
  action="/search"
  style="max-width: 30rem"
>
  <label class="govbb-visually-hidden" for="search-q">Search</label>
  <input
    class="govbb-search__input"
    id="search-q"
    name="q"
    type="search"
    placeholder="Search gov.bb"
  />
  <button class="govbb-search__button" type="submit">Search</button>
</form>
```

```tsx
import { Search } from '@govtech-bb/react';

<Search action="/search" inputProps={{ placeholder: 'Search gov.bb' }} />;
```

The Search component joins a search input and a submit button into a single
unit. The label is visually hidden (the joined input and button already read
as search) but stays available to screen readers.

## Usage

<div class="govbb-usage-guidance">
  <section class="govbb-usage-guidance__item" aria-labelledby="search-when-to-use">
    <h3 id="search-when-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--do" aria-hidden="true">✓</span>
      When to use
    </h3>
    <ul>
      <li>Use search when a website has enough content that users may look for a known term, service or topic.</li>
      <li>Use a prominent full search field where search is a common starting point.</li>
    </ul>
  </section>
  <section class="govbb-usage-guidance__item" aria-labelledby="search-when-not-to-use">
    <h3 id="search-when-not-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--dont" aria-hidden="true">×</span>
      When not to use
    </h3>
    <ul>
      <li>Do not use search as a replacement for clear information architecture and navigation.</li>
      <li>Do not add it to a single page or very small content set when browsing is faster.</li>
    </ul>
  </section>
</div>

## Best practices

### Make the search scope clear

Use a label that says what will be searched and keep the word “Search” in the
submit button's accessible name. Keep the button label to that one word: a
longer label takes its width from the field. Give the field enough width for
users to review several words before submitting.

### Preserve and recover from the query

Submit with `GET` so results can be bookmarked and shared. Keep the original
query in the results field, show the result count and provide useful recovery
when there are no matches or the search fails.

## Borderless search

Add the `govbb-search--borderless` modifier to drop the input border. Use this
inside coloured containers, such as the site header, where the container
itself provides the contrast and a border would clash.

```html title="Borderless search"
<form
  role="search"
  class="govbb-search govbb-search--borderless"
  action="/search"
  style="max-width: 30rem"
>
  <label class="govbb-visually-hidden" for="search-hdr">Search</label>
  <input class="govbb-search__input" id="search-hdr" name="q" type="search" />
  <button class="govbb-search__button" type="submit">Search</button>
</form>
```

```tsx
import { Search } from '@govtech-bb/react';

<Search action="/search" borderless />;
```

## Search with suggestions

To suggest queries or pages as the user types, wrap the input in the
[combobox](/components/combobox/#free-text-with-suggestions) enhancement in
its inline mode: a `.govbb-combobox.govbb-combobox--inline` around the input
and an empty `<datalist>` that the page refills as suggestions arrive. The
list opens beneath the whole bar and sits in the page flow, so the content
below moves down while it is open instead of being covered. GOV.UK's search
does the same to keep overlays away from screen reader users. Keep to five
suggestions or fewer: the inline list has no height cap and never scrolls.

Give the input `type="text"` rather than `type="search"`. The enhanced input
is a combobox, a role a search input may not take. `enterkeyhint="search"`
keeps the Search key on touch keyboards.

```html title="Search with suggestions"
<form
  role="search"
  class="govbb-search"
  action="/search"
  style="max-width: 30rem"
>
  <label class="govbb-visually-hidden" for="site-q">Search</label>
  <div
    class="govbb-combobox govbb-combobox--inline"
    data-govbb-module="combobox"
  >
    <input
      class="govbb-search__input"
      id="site-q"
      name="q"
      type="text"
      enterkeyhint="search"
      list="site-q-suggestions"
      placeholder="Search gov.bb"
    />
    <datalist id="site-q-suggestions"></datalist>
  </div>
  <button class="govbb-search__button" type="submit">Search</button>
</form>
<p>Content below the search moves down while the suggestions are open.</p>
<script>
  // Stand-in for a suggestions service: refill the datalist as the user types.
  const services = [
    'Apply for a passport',
    'Renew a passport',
    'Apply for a police certificate of character',
    'Pay land tax',
    'Register a birth',
    "Renew a driver's licence",
  ];
  const query = document.getElementById('site-q');
  const suggestions = document.getElementById('site-q-suggestions');
  query.addEventListener('input', () => {
    const typed = query.value.trim().toLowerCase();
    suggestions.replaceChildren(
      ...services
        .filter((name) => typed && name.toLowerCase().includes(typed))
        .slice(0, 5)
        .map((name) => new Option(name)),
    );
  });
</script>
```

```tsx
import { Search } from '@govtech-bb/react';
import { useRef, useState } from 'react';

const services = [
  'Apply for a passport',
  'Renew a passport',
  'Apply for a police certificate of character',
  'Pay land tax',
  'Register a birth',
  "Renew a driver's licence",
];

function SiteSearch() {
  const form = useRef<HTMLFormElement>(null);
  const [query, setQuery] = useState('');
  const typed = query.trim().toLowerCase();
  return (
    <Search
      ref={form}
      action="/search"
      inputProps={{
        value: query,
        onChange: (event) => setQuery(event.target.value),
        placeholder: 'Search gov.bb',
      }}
      suggestions={services
        .filter((name) => typed && name.toLowerCase().includes(typed))
        .slice(0, 5)
        .map((name) => ({ value: name }))}
      onSuggestionSelect={() => form.current?.requestSubmit()}
    />
  );
}
```

Passing `suggestions` to the React component renders this markup and mounts
the enhancement; `inputProps` still reaches the input for its value and
`onChange`. Choosing a suggestion fills the field, then fires
`govbb-combobox-select` on the wrapper, or `onSuggestionSelect` in React,
which is where a site search submits the query as GOV.UK's does. Keyboard
support, the live result count and the ARIA wiring are those of the
[combobox](/components/combobox/#how-it-works).
