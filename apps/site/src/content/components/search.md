---
title: Search
description: Use the search component to let users search the site or a list.
lede: A labelled search field with a submit button.
group: Navigation
---

## Preview

```html title="Search" full
<form class="govbb-search" action="/search">
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

<Search
  action="/search"
  inputProps={{ name: 'q', placeholder: 'Search gov.bb' }}
/>;
```

The search component pairs a search input with a submit button in a single
form. The label is visually hidden but announced by screen readers, and the
input uses `type="search"` so browsers offer the right keyboard and clearing
behaviour.

## When to use this component

Use search when the site or section has too much content to browse
comfortably. Submitting the form should take the user to a results page that
restates the query.

## When not to use this component

Do not use search as a substitute for clear navigation — most users on a
small site find things faster by browsing. For filtering a short list already
on the page, a visible set of filters is usually clearer than a search box.

## Borderless variant

Use the `--borderless` modifier when the search sits inside a container that
already provides a visual edge, such as the site header.

```html title="Borderless search" full
<form class="govbb-search govbb-search--borderless" action="/search">
  <label class="govbb-visually-hidden" for="search-hdr">Search</label>
  <input class="govbb-search__input" id="search-hdr" name="q" type="search" />
  <button class="govbb-search__button" type="submit">Search</button>
</form>
```

```tsx
import { Search } from '@govtech-bb/react';

<Search borderless action="/search" inputProps={{ name: 'q' }} />;
```
