---
title: Add another
description: Use the add another component to let users repeat a small group of fields, such as the details of each person, as many times as they need.
lede: Lets users repeat a small group of fields, adding and removing entries on the page.
group: Form elements
---

## Preview

```html title="Add another person"
<div
  class="govbb-add-another"
  data-govbb-module="add-another"
  data-item-label="Person"
>
  <div class="govbb-add-another__items">
    <div class="govbb-add-another__item">
      <fieldset class="govbb-fieldset govbb-add-another__fieldset">
        <legend class="govbb-fieldset__legend govbb-add-another__legend">
          Person 1
        </legend>
        <div class="govbb-form-group">
          <label class="govbb-label" for="person-0-name">Full name</label>
          <input
            class="govbb-input"
            id="person-0-name"
            name="person[0][name]"
            type="text"
            data-id="person-%index%-name"
            data-name="person[%index%][name]"
          />
        </div>
        <div class="govbb-form-group">
          <label class="govbb-label" for="person-0-relationship"
            >Relationship to you</label
          >
          <input
            class="govbb-input"
            id="person-0-relationship"
            name="person[0][relationship]"
            type="text"
            data-id="person-%index%-relationship"
            data-name="person[%index%][relationship]"
          />
        </div>
      </fieldset>
    </div>
  </div>
  <button
    class="govbb-button govbb-button--text govbb-add-another__add"
    type="submit"
    name="add-another"
    value="person"
  >
    Add another person
  </button>
</div>
```

```tsx
import { AddAnother, AddAnotherItem, Input } from '@govtech-bb/react';
import { useState } from 'react';

function People() {
  const [people, setPeople] = useState([{ id: 1, name: '', relationship: '' }]);
  return (
    <AddAnother
      itemLabel="Person"
      onAdd={() =>
        setPeople([...people, { id: Date.now(), name: '', relationship: '' }])
      }
      canAdd={people.length < 5}
    >
      {people.map((person, index) => (
        <AddAnotherItem
          key={person.id}
          index={index}
          onRemove={() => setPeople(people.filter((p) => p.id !== person.id))}
        >
          <Input label="Full name" name={`person[${index}][name]`} />
          <Input
            label="Relationship to you"
            name={`person[${index}][relationship]`}
          />
        </AddAnotherItem>
      ))}
    </AddAnother>
  );
}
```

The Add another component lets users give the same small set of details more
than once on a single page, for example the name and relationship of each
person in a household. Each entry is a numbered fieldset with its own
Remove button, and an Add button appends a blank entry. Both are text buttons, the way
gov.bb forms already renders them; Remove throws away what the user typed, so
it takes the negative (red) modifier rather than a red box, which would put a
block of red on the page for every entry. Without JavaScript the
buttons submit the form, so the server adds or removes the entry and shows the
page again; with it the change happens on the page.

## Usage

<div class="govbb-usage-guidance">
  <section class="govbb-usage-guidance__item" aria-labelledby="add-another-when-to-use">
    <h3 id="add-another-when-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--do" aria-hidden="true">✓</span>
      When to use
    </h3>
    <ul>
      <li>Use it for a few short fields users repeat a handful of times: people, dates, payments, previous addresses.</li>
      <li>Use it when users need to see all their entries together to check or compare them.</li>
    </ul>
  </section>
  <section class="govbb-usage-guidance__item" aria-labelledby="add-another-when-not-to-use">
    <h3 id="add-another-when-not-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--dont" aria-hidden="true">×</span>
      When not to use
    </h3>
    <ul>
      <li>Do not use it for long or complex entries. Ask for each one on its own page, then show them in a <a href="/components/summary-list/">summary list</a> with a question such as "Do you need to add another person?", so nothing is lost if the page is left.</li>
      <li>Do not use it for a single field repeated once or twice, such as a second phone number: add the second field directly.</li>
      <li>Do not nest one add another inside another, or put the stacked layout on a page more than once.</li>
    </ul>
  </section>
</div>

## Best practices

### Name the item

Give the entries a short, singular name in sentence case, such as "Person",
"Payment" or "Previous address", with `data-item-label` in HTML or `itemLabel`
in React. It numbers every legend ("Person 2 of 3") and button ("Remove person
2", "Add another person"), so users and screen readers know which entry they
are on. Keep it to a word or two: it is printed inside the buttons, which do
not break long words.

### Keep entries small

Two or three fields per entry is the sweet spot. Use inputs, selects, radios,
checkboxes or date inputs; keep the labels short. Put a heading that describes
the task, such as "Who lives with you?", above the component.

### Make it work without JavaScript

Render the Add and Remove buttons as submit buttons with a `name` and `value`,
and handle them on the server: add a blank entry or drop the numbered one,
then show the page again with the other values kept. The JavaScript turns the
same buttons into page actions, so one template serves both. Initialise it
with `initAll()` from `@govtech-bb/frontend`; the React component manages the
list itself.

## How it works

Each entry is a `.govbb-add-another__item` holding a fieldset whose legend
carries the item name and number. The JavaScript keeps a blank copy of the
first entry, with values and error messages cleared, and clones it when the
user chooses Add.

Because a new entry needs its own names and ids, write those attributes as
templates with a `%index%` placeholder and the JavaScript fills them in for
every entry after each change:

- `data-name` sets `name`, for example `person[%index%][name]`
- `data-id` sets `id`, and any label pointing at the old id follows it
- `data-for`, `data-describedby`, `data-controls` and `data-labelledby` set
  `for`, `aria-describedby`, `aria-controls` and `aria-labelledby`, for hints,
  error messages and controls that reference other elements

Give hints and error messages inside an entry a `data-id` too, so they stay
unique when the entry is repeated.

After a change the numbering updates ("Person 1 of 2", "Person 2 of 2"), focus
moves to the new entry's fieldset, or to the neighbour of a removed one, and a
visually hidden status region announces "Person 2 added" or "Person 2
removed". The Remove button hides when only one entry is left (set another
floor with `data-min`) and the Add button hides at `data-max`. Modules inside a
new entry, such as a combobox, are enhanced automatically.

The root fires `govbb-add-another-add` (with the new `item` and its `index`)
and `govbb-add-another-remove` (with the `index`) for anything else on the
page that needs to know.

In React the list is yours: render one `AddAnotherItem` per entry from your
state, append in `onAdd` and drop in `onRemove`, and give each entry a stable
`key` so the other entries keep their values. Set `canAdd` false at your
maximum and `removable` false at your minimum.

## Inline layout

For up to three short fields, `govbb-add-another--inline` (React
`layout="inline"`) puts each entry's fields in one row with Remove at the end,
so a list of similar entries reads like a table. The row needs about 28rem
(450px) of width: in a narrower column, or on a small screen, the layout falls
back to stacked with its legends showing. The switch follows the component's
own width, not the viewport, so a one-third column behaves like a phone.

```html title="Add another payment, inline"
<div
  class="govbb-add-another govbb-add-another--inline"
  data-govbb-module="add-another"
  data-item-label="Payment"
>
  <div class="govbb-add-another__items">
    <div class="govbb-add-another__item">
      <fieldset class="govbb-fieldset govbb-add-another__fieldset">
        <legend class="govbb-fieldset__legend govbb-add-another__legend">
          Payment 1
        </legend>
        <div class="govbb-form-group">
          <label class="govbb-label" for="payment-0-payee">Paid to</label>
          <input
            class="govbb-input"
            id="payment-0-payee"
            name="payment[0][payee]"
            type="text"
            data-id="payment-%index%-payee"
            data-name="payment[%index%][payee]"
          />
        </div>
        <div class="govbb-form-group">
          <label class="govbb-label" for="payment-0-amount">Amount</label>
          <input
            class="govbb-input"
            id="payment-0-amount"
            name="payment[0][amount]"
            type="text"
            inputmode="decimal"
            data-id="payment-%index%-amount"
            data-name="payment[%index%][amount]"
          />
        </div>
      </fieldset>
    </div>
  </div>
  <button
    class="govbb-button govbb-button--text govbb-add-another__add"
    type="submit"
    name="add-another"
    value="payment"
  >
    Add another payment
  </button>
</div>
```

```tsx
import { AddAnother, AddAnotherItem, Input } from '@govtech-bb/react';

<AddAnother itemLabel="Payment" layout="inline" onAdd={addPayment}>
  {payments.map((payment, index) => (
    <AddAnotherItem
      key={payment.id}
      index={index}
      onRemove={() => removePayment(payment.id)}
    >
      <Input label="Paid to" name={`payment[${index}][payee]`} />
      <Input
        label="Amount"
        name={`payment[${index}][amount]`}
        inputMode="decimal"
      />
    </AddAnotherItem>
  ))}
</AddAnother>;
```

## Errors

Show errors on the field they belong to, as on any form, and name the entry in
the message: "Enter a full name for person 2". Point the error summary at the
field's id. When a new entry is cloned, the error messages and `aria-invalid`
of the entry it was copied from are cleared.

```html title="Add another with an error"
<div
  class="govbb-add-another"
  data-govbb-module="add-another"
  data-item-label="Person"
>
  <div class="govbb-add-another__items">
    <div class="govbb-add-another__item">
      <fieldset class="govbb-fieldset govbb-add-another__fieldset">
        <legend class="govbb-fieldset__legend govbb-add-another__legend">
          Person 1
        </legend>
        <div class="govbb-form-group">
          <label class="govbb-label" for="person-0-name">Full name</label>
          <span
            class="govbb-error-message"
            id="person-0-name-error"
            role="alert"
            data-id="person-%index%-name-error"
          >
            Enter a full name for person 1
          </span>
          <input
            class="govbb-input"
            id="person-0-name"
            name="person[0][name]"
            type="text"
            aria-invalid="true"
            aria-describedby="person-0-name-error"
            data-id="person-%index%-name"
            data-name="person[%index%][name]"
            data-describedby="person-%index%-name-error"
          />
        </div>
      </fieldset>
    </div>
  </div>
  <button
    class="govbb-button govbb-button--text govbb-add-another__add"
    type="submit"
    name="add-another"
    value="person"
  >
    Add another person
  </button>
</div>
```

```tsx
import { AddAnother, AddAnotherItem, Input } from '@govtech-bb/react';

<AddAnother itemLabel="Person" onAdd={addPerson}>
  <AddAnotherItem index={0}>
    <Input
      label="Full name"
      name="person[0][name]"
      error="Enter a full name for person 1"
    />
  </AddAnotherItem>
</AddAnother>;
```
