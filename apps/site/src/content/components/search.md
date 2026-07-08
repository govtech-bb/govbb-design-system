---
title: Search
description: Use the search component to let users find content by keyword.
lede: Lets users find pages and services by entering a search term.
group: Navigation
---

## Preview

```html title="Search"
<form class="govbb-search" action="/search" style="max-width: 30rem">
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

## When to use this component

Use search when users need to find a page or service by keyword rather than by
browsing, such as searching gov.bb for "renew passport" or "road tax". Submit
the form to a results page with a `GET` request so users can bookmark and
share their search.

## When not to use this component

Do not use search as a substitute for clear navigation: most users should be
able to reach common services without it. Do not use it to filter a short list
on the same page; showing the full list is simpler and more predictable.

## Borderless search

Add the `govbb-search--borderless` modifier to drop the input border. Use this
inside coloured containers, such as the site header, where the container
itself provides the contrast and a border would clash.

```html title="Borderless search"
<form
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
