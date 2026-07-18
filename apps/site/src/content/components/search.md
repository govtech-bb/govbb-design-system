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
submit button's accessible name. Give the field enough width for users to
review several words before submitting.

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
