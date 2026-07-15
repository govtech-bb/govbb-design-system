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
        <a class="govbb-link govbb-service-list__link" href="#">
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
        <a class="govbb-link govbb-service-list__link" href="#">
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
        <a class="govbb-link govbb-service-list__link" href="#">
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

## When to use this component

Use a service list wherever users pick a destination from a set of services,
categories or topics: the categories on a homepage with the default look, the
services inside a category page with the signpost look, or an A to Z of
services. Add a description when the link name alone does not say what users
will find, and a tag when it helps users know what kind of service to expect.

## When not to use this component

Do not use a service list for general content lists; use the
[list](/components/list/) component instead. Do not use it for the trail back
up the page hierarchy; that is the job of
[breadcrumbs](/components/breadcrumbs/).

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
