---
title: Service list
description: Use the service list to help users navigate to services, categories and topics.
lede: A list of bold green links to services, with optional descriptions and tags.
group: Navigation
---

## Preview

```html title="Service list"
<ul class="govbb-service-list">
  <li class="govbb-service-list__item">
    <div class="govbb-service-list__wrapper">
      <h3 class="govbb-service-list__heading">
        <a class="govbb-link govbb-service-list__link" href="/services/family/">
          Family, birth and relationships
        </a>
      </h3>
      <p class="govbb-service-list__description">
        Managing key life events and family responsibilities, from registering a
        birth to caring for others
      </p>
    </div>
  </li>
  <li class="govbb-service-list__item">
    <div class="govbb-service-list__wrapper">
      <h3 class="govbb-service-list__heading">
        <a class="govbb-link govbb-service-list__link" href="/services/travel/">
          Travel and transport
        </a>
      </h3>
      <p class="govbb-service-list__tag">Information service</p>
    </div>
  </li>
</ul>
```

```tsx
import { ServiceList, ServiceListItem } from '@govtech-bb/react';

<ServiceList>
  <ServiceListItem
    href="/family"
    description="Managing key life events and family responsibilities, from registering a birth to caring for others"
  >
    Family, birth and relationships
  </ServiceListItem>
  <ServiceListItem href="/travel" tag="Information service">
    Travel and transport
  </ServiceListItem>
</ServiceList>;
```

The Service list component is a vertical list of navigation entries separated
by a neutral rule. Each entry is a card: a heading holding an underlined
link, an optional one-line description and an optional tag naming the kind of
service, such as "Digital service" or "Information service".

It has two looks. The default, for listings of categories, gives entries big
bold green names: heading-three size on small screens, stepping up to the
large body size from tablet width. The signpost look, for the service links
inside a category, keeps names at the quiet body size in the standard teal
link colour, with a divider that thickens from 2px to 4px from tablet width.

## Whole-card click target

The whole entry is clickable, following the GOV.UK cards pattern: the link
carries a stretched pseudo-element that covers the entire item, so tapping
the description or the space around it follows the link too. There is still
exactly one link per entry, and its accessible name is the service name; the
description stays plain text. Hovering or focusing anywhere on the card shows
the link's own hover and focus states, since the whole area is the link.

Because the markup relies on this, do not add a second link or other
interactive control inside an entry; the stretched link would sit on top of
it.

## Signpost look

Use the `govbb-service-list--signpost` modifier (or `variant="signpost"` in
React) for the links inside a category: the destinations are services, not
more categories, so the names step down to regular-weight body-size links in
the standard teal. The markup, whole-card click behaviour, descriptions and
tags all work the same as the default look.

```html title="Signpost service list"
<ul class="govbb-service-list govbb-service-list--signpost">
  <li class="govbb-service-list__item">
    <div class="govbb-service-list__wrapper">
      <h3 class="govbb-service-list__heading">
        <a
          class="govbb-link govbb-service-list__link"
          href="/services/register-birth/"
        >
          Register a birth
        </a>
      </h3>
      <p class="govbb-service-list__description">
        What you need to register a birth in Barbados
      </p>
    </div>
  </li>
</ul>
```

```tsx
import { ServiceList, ServiceListItem } from '@govtech-bb/react';

<ServiceList variant="signpost">
  <ServiceListItem
    href="/register-birth"
    description="What you need to register a birth in Barbados"
  >
    Register a birth
  </ServiceListItem>
</ServiceList>;
```

## Usage

<div class="govbb-usage-guidance">
  <section class="govbb-usage-guidance__item" aria-labelledby="service-list-when-to-use">
    <h3 id="service-list-when-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--do" aria-hidden="true">✓</span>
      When to use
    </h3>
    <ul>
      <li>Use a service list when users choose a destination from related services, categories or topics.</li>
      <li>Use a description or tag only when it helps users distinguish similar destinations.</li>
    </ul>
  </section>
  <section class="govbb-usage-guidance__item" aria-labelledby="service-list-when-not-to-use">
    <h3 id="service-list-when-not-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--dont" aria-hidden="true">×</span>
      When not to use
    </h3>
    <ul>
      <li>Do not use it for general prose or task steps; use a <a href="/components/list/">list</a>.</li>
      <li>Do not use it to show the path to the current page; use <a href="/components/breadcrumbs/">breadcrumbs</a>.</li>
    </ul>
  </section>
</div>

## Best practices

### Make each destination distinct

Use a short, unique service name as the link. Add a one-sentence description
when the name alone does not explain the task, and keep descriptions parallel
across the list.

### Keep one destination per item

The whole item is a larger target for its single link. Do not add another link,
button or interactive control inside it. Choose a heading level that fits the
page outline.

## Heading level

Each entry's name is a heading, so screen reader users can jump between
services. The visual size stays the same at every level; pick the level that
fits the page outline with `headingLevel` (h2, h3 or h4; the default is h3),
or by changing the element in HTML.

## Client-side routing

In React each item accepts a `linkComponent`, the same adapter pattern as the
[link](/components/link/) component, so a single-page app can navigate without
a full page load. Anchor attributes, including analytics data attributes, are
spread onto the link.
