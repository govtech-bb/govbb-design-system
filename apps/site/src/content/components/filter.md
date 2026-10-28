---
title: Filter
description: Use a filter to let users narrow a list of results by choosing options in groups.
lede: A collapsed panel of option groups that narrows a list of results.
group: Navigation
---

## Preview

```html title="Filter"
<details class="govbb-filter" open>
  <summary class="govbb-button govbb-button--ghost govbb-filter__summary">
    Filter
  </summary>
  <form class="govbb-filter__panel" method="get" action="/services">
    <details class="govbb-filter-group" open>
      <summary class="govbb-filter-group__summary" id="filter-type">
        Service type
      </summary>
      <div
        class="govbb-filter-group__options"
        role="group"
        aria-labelledby="filter-type"
      >
        <div class="govbb-checkbox-item">
          <input
            class="govbb-checkbox"
            id="filter-type-information"
            name="type"
            value="information"
            type="checkbox"
          />
          <label
            class="govbb-checkbox-item__label"
            for="filter-type-information"
            >Information service</label
          >
        </div>
        <div class="govbb-checkbox-item">
          <input
            class="govbb-checkbox"
            id="filter-type-digital"
            name="type"
            value="digital"
            type="checkbox"
          />
          <label class="govbb-checkbox-item__label" for="filter-type-digital"
            >Digital service</label
          >
        </div>
      </div>
    </details>
    <details class="govbb-filter-group">
      <summary class="govbb-filter-group__summary" id="filter-category">
        Category
      </summary>
      <div
        class="govbb-filter-group__options"
        role="group"
        aria-labelledby="filter-category"
      >
        <div class="govbb-checkbox-item">
          <input
            class="govbb-checkbox"
            id="filter-category-travel"
            name="category"
            value="travel"
            type="checkbox"
          />
          <label class="govbb-checkbox-item__label" for="filter-category-travel"
            >Travel</label
          >
        </div>
      </div>
    </details>
    <button class="govbb-button" type="submit">Apply</button>
  </form>
</details>
```

```tsx
import { Checkbox, Filter, FilterGroup } from '@govtech-bb/react';

<Filter open formProps={{ action: '/services' }}>
  <FilterGroup label="Service type" open>
    <Checkbox name="type" value="information" label="Information service" />
    <Checkbox name="type" value="digital" label="Digital service" />
  </FilterGroup>
  <FilterGroup label="Category">
    <Checkbox name="category" value="travel" label="Travel" />
  </FilterGroup>
</Filter>;
```

The filter sits above a list of results, closed until the user asks for it.
Inside are filter groups, each a named set of checkboxes that also starts
closed, and an Apply button. Both levels are built on the native `<details>`
element, so they open, close and take keyboard focus with no JavaScript.

The panel is a form that submits with `GET`, so the chosen options end up in
the page address. The page reads them and renders the narrowed results, and
users can bookmark or share a filtered list.

## Usage

<div class="govbb-usage-guidance">
  <section class="govbb-usage-guidance__item" aria-labelledby="filter-when-to-use">
    <h3 id="filter-when-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--do" aria-hidden="true">✓</span>
      When to use
    </h3>
    <ul>
      <li>Use a filter on a list long enough that users need to narrow it, such as a list of services.</li>
      <li>Use it when the results can be sorted into a few clear groups of options.</li>
    </ul>
  </section>
  <section class="govbb-usage-guidance__item" aria-labelledby="filter-when-not-to-use">
    <h3 id="filter-when-not-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--dont" aria-hidden="true">×</span>
      When not to use
    </h3>
    <ul>
      <li>Do not use it when users know what they are looking for by name; use <a href="/components/search/">search</a>.</li>
      <li>Do not use it to collect answers in a form; use <a href="/components/checkbox/">checkboxes</a> in a fieldset.</li>
    </ul>
  </section>
</div>

## Best practices

### Name groups after what users are looking for

Write each group's name as a short noun phrase in
[sentence case](/styles/text-case/), such as _"Service type"_, using the words
users would use rather than internal categories.

### Keep the options few

Keep each group to a handful of options, and the filter to a few groups. If a
group needs many options, the list probably needs search instead.

### Show the chosen options after applying

When the page reloads with a filter applied, check the options the user chose
and open the groups they are in, so users can see why the list is shorter.

### Keep the rest of the page's state

Applying replaces the page address's query with the filter's own fields, so a
search term or sort order already in the address is lost. Carry it over with
hidden inputs inside the panel, before the button, such as
`<input type="hidden" name="q" value="passport">`. In React, pass them as
children of `Filter`.

## Filter groups

A filter group labels its options with its summary. Give the summary an `id`
and point the options' `aria-labelledby` at it, so screen readers announce the
group's name with each checkbox. The React `FilterGroup` wires this up for
you, and puts an `id` you pass on the summary.

```html title="Filter groups"
<details class="govbb-filter-group" open>
  <summary class="govbb-filter-group__summary" id="group-type">
    Service type
  </summary>
  <div
    class="govbb-filter-group__options"
    role="group"
    aria-labelledby="group-type"
  >
    <div class="govbb-checkbox-item">
      <input
        class="govbb-checkbox"
        id="group-type-information"
        name="type"
        value="information"
        type="checkbox"
      />
      <label class="govbb-checkbox-item__label" for="group-type-information"
        >Information service</label
      >
    </div>
    <div class="govbb-checkbox-item">
      <input
        class="govbb-checkbox"
        id="group-type-digital"
        name="type"
        value="digital"
        type="checkbox"
        checked
      />
      <label class="govbb-checkbox-item__label" for="group-type-digital"
        >Digital service</label
      >
    </div>
  </div>
</details>
<details class="govbb-filter-group">
  <summary class="govbb-filter-group__summary" id="group-category">
    Category
  </summary>
  <div
    class="govbb-filter-group__options"
    role="group"
    aria-labelledby="group-category"
  >
    <div class="govbb-checkbox-item">
      <input
        class="govbb-checkbox"
        id="group-category-travel"
        name="category"
        value="travel"
        type="checkbox"
      />
      <label class="govbb-checkbox-item__label" for="group-category-travel"
        >Travel</label
      >
    </div>
  </div>
</details>
```

```tsx
import { Checkbox, FilterGroup } from '@govtech-bb/react';

<>
  <FilterGroup label="Service type" id="group-type" open>
    <Checkbox name="type" value="information" label="Information service" />
    <Checkbox
      name="type"
      value="digital"
      label="Digital service"
      defaultChecked
    />
  </FilterGroup>
  <FilterGroup label="Category" id="group-category">
    <Checkbox name="category" value="travel" label="Travel" />
  </FilterGroup>
</>;
```
