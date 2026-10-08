import { describe, expect, it, vi } from 'vitest';
import { initAll } from '../../../index.js';

function item(index, { value = '', error = false, remove = false } = {}) {
  return `
    <div class="govbb-add-another__item">
      <fieldset class="govbb-fieldset govbb-add-another__fieldset">
        <legend class="govbb-fieldset__legend govbb-add-another__legend">Person ${index + 1}</legend>
        <div class="govbb-form-group">
          <label class="govbb-label" for="person-${index}-name">Full name</label>
          <span class="govbb-hint" id="person-${index}-name-hint" data-id="person-%index%-name-hint">As on the passport</span>
          ${error ? `<span class="govbb-error-message" id="person-${index}-name-error" data-id="person-%index%-name-error">Enter a name</span>` : ''}
          <input class="govbb-input" id="person-${index}-name" name="person[${index}][name]" value="${value}"
            data-id="person-%index%-name" data-name="person[%index%][name]"
            data-describedby="person-%index%-name-hint${error ? ' person-%index%-name-error' : ''}"
            aria-describedby="person-${index}-name-hint${error ? ` person-${index}-name-error` : ''}"
            ${error ? 'aria-invalid="true"' : ''} />
        </div>
        <div class="govbb-form-group">
          <label class="govbb-label" for="person-${index}-country">Country</label>
          <div class="govbb-combobox" data-govbb-module="combobox">
            <select class="govbb-select" id="person-${index}-country" name="person[${index}][country]" data-id="person-%index%-country" data-name="person[%index%][country]">
              <option value="">Select a country</option>
              <option value="bb" ${value ? 'selected' : ''}>Barbados</option>
            </select>
          </div>
        </div>
        ${remove ? `<button class="govbb-button govbb-button--text govbb-button--negative govbb-add-another__remove" type="submit" name="remove" value="${index}">Remove person ${index + 1}</button>` : ''}
      </fieldset>
    </div>`;
}

function mount(items, attrs = '', itemLabel = 'Person') {
  document.body.innerHTML = `
    <form>
      <div class="govbb-add-another" data-govbb-module="add-another" data-item-label="${itemLabel}" ${attrs}>
        <div class="govbb-add-another__items">${items}</div>
        <button class="govbb-button govbb-button--text govbb-add-another__add" type="submit" name="add-another" value="person">Add another person</button>
      </div>
    </form>`;
  initAll();
  const root = document.querySelector('.govbb-add-another');
  return {
    root,
    add: root.querySelector('.govbb-add-another__add'),
    items: () => Array.from(root.querySelectorAll('.govbb-add-another__item')),
    legends: () =>
      Array.from(
        root.querySelectorAll('.govbb-add-another__legend'),
        (l) => l.textContent,
      ),
    removes: () =>
      Array.from(root.querySelectorAll('.govbb-add-another__remove')),
    status: root.querySelector(':scope > [role="status"]'),
  };
}

describe('add-another module', () => {
  it('turns the submit buttons into page actions and hides Remove on a single item', () => {
    const { add, removes, legends } = mount(item(0));
    expect(add.type).toBe('button');
    expect(removes()).toHaveLength(1); // created for the first item
    expect(removes()[0].hidden).toBe(true);
    expect(removes()[0].type).toBe('button');
    expect(removes()[0].className).toBe(
      'govbb-button govbb-button--text govbb-button--negative govbb-add-another__remove',
    );
    expect(add.className).toContain('govbb-button--text');
    expect(legends()).toEqual(['Person 1']);
  });

  it('adds a blank, renumbered copy of the first item and moves focus to it', () => {
    const { root, add, items, legends, removes, status } = mount(
      item(0, { value: 'Sara Williams', error: true }),
    );
    const onAdd = vi.fn();
    root.addEventListener('govbb-add-another-add', onAdd);
    add.click();
    expect(items()).toHaveLength(2);
    expect(legends()).toEqual(['Person 1 of 2', 'Person 2 of 2']);
    const second = items()[1];
    const name = second.querySelector('input');
    expect(name.value).toBe('');
    expect(name.id).toBe('person-1-name');
    expect(name.name).toBe('person[1][name]');
    expect(name.hasAttribute('aria-invalid')).toBe(false);
    expect(name.getAttribute('aria-describedby')).toBe('person-1-name-hint');
    expect(second.querySelector('.govbb-error-message')).toBeNull();
    expect(second.querySelector('label[for="person-1-name"]').textContent).toBe(
      'Full name',
    );
    expect(second.querySelector('.govbb-hint').id).toBe('person-1-name-hint');
    expect(second.querySelector('select').value).toBe(''); // selection cleared
    expect(second.querySelector('select').name).toBe('person[1][country]');
    // the first item keeps its value and error, only its legend changes
    expect(items()[0].querySelector('input').value).toBe('Sara Williams');
    expect(items()[0].querySelector('.govbb-error-message')).not.toBeNull();
    expect(removes().map((b) => [b.textContent, b.hidden])).toEqual([
      ['Remove person 1', false],
      ['Remove person 2', false],
    ]);
    expect(document.activeElement).toBe(second.querySelector('fieldset'));
    expect(status.textContent).toBe('Person 2 added');
    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd.mock.calls[0][0].detail).toEqual({ item: second, index: 1 });
  });

  it('enhances modules inside the new item', () => {
    const { add, items } = mount(item(0));
    expect(items()[0].querySelector('[role="combobox"]')).not.toBeNull();
    add.click();
    const combobox = items()[1].querySelector('[role="combobox"]');
    expect(combobox).not.toBeNull();
    expect(combobox.id).toBe('person-1-country'); // the enhanced input took the renumbered id
    expect(items()[1].querySelectorAll('[role="combobox"]')).toHaveLength(1);
  });

  it('removes an item, renumbers the rest and focuses the neighbour', () => {
    const { root, items, legends, removes, status, add } = mount(
      item(0, { remove: true }) +
        item(1, { remove: true }) +
        item(2, { remove: true }),
    );
    const onRemove = vi.fn();
    root.addEventListener('govbb-add-another-remove', onRemove);
    expect(legends()).toEqual([
      'Person 1 of 3',
      'Person 2 of 3',
      'Person 3 of 3',
    ]);
    removes()[1].click();
    expect(items()).toHaveLength(2);
    expect(legends()).toEqual(['Person 1 of 2', 'Person 2 of 2']);
    expect(items()[1].querySelector('input').name).toBe('person[1][name]');
    expect(document.activeElement).toBe(items()[0].querySelector('fieldset'));
    expect(status.textContent).toBe('Person 2 removed');
    expect(onRemove.mock.calls[0][0].detail).toEqual({ index: 1 });
    removes()[0].click(); // first item: focus goes to the one after it
    expect(document.activeElement).toBe(items()[0].querySelector('fieldset'));
    expect(legends()).toEqual(['Person 1']);
    expect(removes()[0].hidden).toBe(true);
    expect(add.hidden).toBe(false);
  });

  it('respects data-min and data-max', () => {
    const { add, removes, items } = mount(
      item(0) + item(1),
      'data-min="2" data-max="3"',
    );
    expect(removes().every((b) => b.hidden)).toBe(true);
    add.click();
    expect(items()).toHaveLength(3);
    expect(add.hidden).toBe(true);
    expect(removes().every((b) => !b.hidden)).toBe(true);
    add.click(); // hidden, but clicking programmatically must still not add
    expect(items()).toHaveLength(3);
    removes()[2].click();
    expect(items()).toHaveLength(2);
    expect(add.hidden).toBe(false);
    removes()[1].click(); // at the minimum: ignored
    expect(items()).toHaveLength(2);
  });

  it('falls back to "Item" when the item label is empty', () => {
    const { legends, removes, add } = mount(item(0) + item(1), '', '');
    expect(legends()).toEqual(['Item 1 of 2', 'Item 2 of 2']);
    expect(removes()[1].textContent).toBe('Remove item 2');
    expect(add.hidden).toBe(false);
  });

  it('leaves a nested group to its own module', () => {
    document.body.innerHTML = `
      <div class="govbb-add-another" data-govbb-module="add-another" data-item-label="Outer">
        <div class="govbb-add-another__items">
          <div class="govbb-add-another__item">
            <fieldset class="govbb-fieldset govbb-add-another__fieldset">
              <legend class="govbb-fieldset__legend govbb-add-another__legend">Outer 1</legend>
              <div class="govbb-add-another" data-govbb-module="add-another" data-item-label="Inner">
                <div class="govbb-add-another__items">
                  <div class="govbb-add-another__item">
                    <fieldset class="govbb-fieldset govbb-add-another__fieldset">
                      <legend class="govbb-fieldset__legend govbb-add-another__legend">Inner 1</legend>
                      <input class="govbb-input" name="inner[0]" data-name="inner[%index%]" />
                    </fieldset>
                  </div>
                </div>
                <button class="govbb-button govbb-button--text govbb-add-another__add" type="button">Add another inner</button>
              </div>
            </fieldset>
          </div>
        </div>
        <button class="govbb-button govbb-button--text govbb-add-another__add" type="button">Add another outer</button>
      </div>`;
    initAll();
    const inner = document.querySelectorAll('.govbb-add-another')[1];
    inner.querySelector('.govbb-add-another__add').click();
    expect(inner.querySelectorAll('.govbb-add-another__item')).toHaveLength(2);
    expect(
      document.querySelectorAll(
        '.govbb-add-another > .govbb-add-another__items > .govbb-add-another__item',
      ),
    ).toHaveLength(3); // 1 outer + 2 inner: nothing was added to the outer group
  });

  it('does not submit the form from either button', () => {
    const { root, add, removes } = mount(item(0) + item(1, { remove: true }));
    const onSubmit = vi.fn((e) => e.preventDefault());
    root.closest('form').addEventListener('submit', onSubmit);
    add.click();
    removes()[0].click();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
