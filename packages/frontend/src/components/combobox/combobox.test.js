import { describe, expect, it, vi } from 'vitest';
import { Combobox, initAll } from '../../../index.js';

const OPTIONS = `
  <option value="" disabled selected>Select a country</option>
  <option value="ag">Antigua and Barbuda</option>
  <option value="bb">Barbados</option>
  <option value="lc">Saint Lucia</option>
  <option value="kn" disabled>Saint Kitts and Nevis</option>
  <option value="vc">Saint Vincent and the Grenadines</option>`;

function markup(attrs = '', options = OPTIONS, selectAttrs = '') {
  return `
    <label class="govbb-label" for="country">Country of birth</label>
    <span class="govbb-hint" id="country-hint">Start typing to filter the list</span>
    <div class="govbb-combobox" data-govbb-module="combobox" ${attrs}>
      <select class="govbb-select" id="country" name="country" aria-describedby="country-hint" ${selectAttrs}>${options}</select>
    </div>`;
}

function mount(...args) {
  document.body.innerHTML = markup(...args);
  initAll();
  return {
    input: document.querySelector('input'),
    select: document.querySelector('select'),
    list: document.querySelector('ul'),
    status: document.querySelector('[role="status"]'),
  };
}

const type = (input, text) => {
  input.value = text;
  input.dispatchEvent(new Event('input', { bubbles: true }));
};
const press = (input, key) => {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
  });
  input.dispatchEvent(event);
  return event;
};
const shown = (list) =>
  Array.from(list.querySelectorAll('[role="option"]'), (o) => o.textContent);
const active = (input) =>
  document.getElementById(input.getAttribute('aria-activedescendant'))
    ?.textContent;

describe('combobox module', () => {
  it('takes over the id, label and description; keeps the select in the form', () => {
    const { input, select, list } = mount();
    const label = document.querySelector('label');
    expect(input.id).toBe('country');
    expect(input.getAttribute('role')).toBe('combobox');
    expect(input.getAttribute('aria-describedby')).toBe('country-hint');
    expect(input.getAttribute('aria-controls')).toBe(list.id);
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(label.htmlFor).toBe(input.id);
    expect(list.getAttribute('aria-labelledby')).toBe(label.id);
    expect(list.hidden).toBe(true);
    expect(select.name).toBe('country');
    expect(select.id).toBe('country-select');
    expect(select.getAttribute('aria-hidden')).toBe('true');
    expect(select.tabIndex).toBe(-1);
    expect(select.classList.contains('govbb-visually-hidden')).toBe(true);
  });

  it('shows the chosen option and hides the placeholder', () => {
    const { input } = mount(
      '',
      OPTIONS.replace('value="bb"', 'value="bb" selected').replace(
        'disabled selected',
        'disabled',
      ),
    );
    expect(input.value).toBe('Barbados');
    const empty = mount();
    expect(empty.input.value).toBe('');
  });

  it('filters as the user types, ignoring case and accents', () => {
    const { input, list, status } = mount();
    type(input, 'saint');
    expect(list.hidden).toBe(false);
    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(shown(list)).toEqual([
      'Saint Lucia',
      'Saint Kitts and Nevis',
      'Saint Vincent and the Grenadines',
    ]);
    expect(status.textContent).toBe('3 results available');
    type(input, 'LUCÍA');
    expect(shown(list)).toEqual(['Saint Lucia']);
    expect(status.textContent).toBe('1 result available');
    type(input, '');
    expect(shown(list)).toHaveLength(5); // every option but the placeholder
  });

  it('shows the empty row when nothing matches', () => {
    const { input, list, status } = mount();
    type(input, 'zzz');
    expect(shown(list)).toEqual(['No results found']);
    expect(
      list.querySelector('[role="option"]').getAttribute('aria-disabled'),
    ).toBe('true');
    expect(status.textContent).toBe('No results found');
    const custom = mount('data-empty-label="Nothing matches"');
    type(custom.input, 'zzz');
    expect(shown(custom.list)).toEqual(['Nothing matches']);
  });

  it('moves the highlight with the arrow keys, skipping disabled options, and chooses with Enter', () => {
    const { input, select, list } = mount();
    const onChange = vi.fn();
    const onInput = vi.fn();
    select.addEventListener('change', onChange);
    select.addEventListener('input', onInput);
    type(input, 'saint');
    expect(input.hasAttribute('aria-activedescendant')).toBe(false);
    press(input, 'ArrowDown');
    expect(active(input)).toBe('Saint Lucia');
    expect(list.querySelector('[aria-selected="true"]').textContent).toBe(
      'Saint Lucia',
    );
    press(input, 'ArrowDown');
    expect(active(input)).toBe('Saint Vincent and the Grenadines');
    press(input, 'ArrowDown');
    expect(active(input)).toBe('Saint Lucia'); // wraps
    press(input, 'ArrowUp');
    expect(active(input)).toBe('Saint Vincent and the Grenadines');
    press(input, 'Enter');
    expect(select.value).toBe('vc');
    expect(input.value).toBe('Saint Vincent and the Grenadines');
    expect(list.hidden).toBe(true);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onInput).toHaveBeenCalledTimes(1);
  });

  it('opens the whole list on the current value from a closed field', () => {
    const { input, list } = mount(
      '',
      OPTIONS.replace('value="lc"', 'value="lc" selected').replace(
        'disabled selected',
        'disabled',
      ),
    );
    press(input, 'ArrowDown');
    expect(shown(list)).toHaveLength(5);
    expect(active(input)).toBe('Saint Lucia');
    expect(
      list.querySelector('.govbb-combobox__option--chosen').textContent,
    ).toBe('Saint Lucia');
    press(input, 'Escape');
    press(input, 'ArrowUp');
    expect(active(input)).toBe('Saint Vincent and the Grenadines');
  });

  it('opens on click and chooses the clicked option', () => {
    const { input, select, list } = mount();
    const onChange = vi.fn();
    select.addEventListener('change', onChange);
    input.click();
    expect(list.hidden).toBe(false);
    expect(shown(list)).toHaveLength(5);
    const down = new Event('pointerdown', { bubbles: true, cancelable: true });
    list.dispatchEvent(down);
    expect(down.defaultPrevented).toBe(true); // focus stays in the input
    list.querySelector('[data-index="1"]').click();
    expect(select.value).toBe('ag');
    expect(input.value).toBe('Antigua and Barbuda');
    expect(list.hidden).toBe(true);
    expect(onChange).toHaveBeenCalledTimes(1);
    input.click();
    list.querySelector('[aria-disabled="true"]').click();
    expect(select.value).toBe('ag'); // disabled options cannot be chosen
  });

  it('Escape closes the list without changing the value', () => {
    const { input, select, list } = mount();
    type(input, 'bar');
    const event = press(input, 'Escape');
    expect(event.defaultPrevented).toBe(true);
    expect(list.hidden).toBe(true);
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(select.value).toBe('');
    expect(input.value).toBe('bar');
    expect(press(input, 'Escape').defaultPrevented).toBe(false);
  });

  it('on blur chooses an exact match, clears an emptied field and reverts anything else', () => {
    const { input, select } = mount();
    const onChange = vi.fn();
    select.addEventListener('change', onChange);
    type(input, 'barbados');
    input.dispatchEvent(new Event('blur'));
    expect(select.value).toBe('bb');
    expect(input.value).toBe('Barbados');
    expect(onChange).toHaveBeenCalledTimes(1);
    type(input, 'nonsense');
    input.dispatchEvent(new Event('blur'));
    expect(select.value).toBe('bb');
    expect(input.value).toBe('Barbados');
    expect(onChange).toHaveBeenCalledTimes(1);
    type(input, 'Saint Kitts and Nevis'); // disabled: not choosable by typing
    input.dispatchEvent(new Event('blur'));
    expect(select.value).toBe('bb');
    type(input, '');
    input.dispatchEvent(new Event('blur'));
    expect(select.value).toBe('');
    expect(select.selectedIndex).toBe(0); // back on the placeholder
    expect(input.value).toBe('');
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('Enter with nothing highlighted settles the text instead of submitting', () => {
    const { input, select } = mount();
    type(input, 'barbados');
    expect(press(input, 'Enter').defaultPrevented).toBe(true);
    expect(select.value).toBe('bb');
    expect(press(input, 'Enter').defaultPrevented).toBe(false); // list closed
  });

  it('mirrors disabled, required and aria-invalid from the select', () => {
    const { input, select } = mount(
      '',
      OPTIONS,
      'disabled required aria-invalid="true"',
    );
    expect(input.disabled).toBe(true);
    expect(input.required).toBe(true);
    expect(select.required).toBe(true); // stays on the select for the browser
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('sync() follows programmatic changes to the select', () => {
    document.body.innerHTML = markup();
    const combobox = new Combobox(document.querySelector('.govbb-combobox'));
    const input = document.querySelector('input');
    const select = document.querySelector('select');
    select.value = 'lc';
    select.disabled = true;
    select.setAttribute('aria-invalid', 'true');
    combobox.sync();
    expect(input.value).toBe('Saint Lucia');
    expect(input.disabled).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    select.removeAttribute('aria-invalid');
    combobox.sync();
    expect(input.hasAttribute('aria-invalid')).toBe(false);
  });

  it('names the listbox from the select when there is no label', () => {
    document.body.innerHTML = `
      <div class="govbb-combobox" data-govbb-module="combobox">
        <select aria-label="Country">${OPTIONS}</select>
      </div>`;
    initAll();
    const input = document.querySelector('input');
    const list = document.querySelector('ul');
    expect(input.getAttribute('aria-label')).toBe('Country');
    expect(list.getAttribute('aria-label')).toBe('Country');
    expect(input.id).toMatch(/^govbb-combobox-\d+$/);
    expect(document.querySelector('select').id).toBe(`${input.id}-select`);
  });

  it('destroy() puts the select back', () => {
    document.body.innerHTML = markup();
    const root = document.querySelector('.govbb-combobox');
    const combobox = new Combobox(root);
    combobox.destroy();
    const select = document.querySelector('select');
    expect(root.querySelector('input, ul, [role="status"]')).toBeNull();
    expect(select.id).toBe('country');
    expect(select.hasAttribute('aria-hidden')).toBe(false);
    expect(select.hasAttribute('tabindex')).toBe(false);
    expect(select.classList.contains('govbb-visually-hidden')).toBe(false);
    // and can be enhanced again
    new Combobox(root);
    expect(root.querySelectorAll('input')).toHaveLength(1);
  });

  it('enhances controls rendered in another document', () => {
    const frame = document.createElement('iframe');
    document.body.replaceChildren(frame);
    const frameDocument = frame.contentDocument;
    frameDocument.body.innerHTML = markup();
    initAll(frameDocument);
    const input = frameDocument.querySelector('input');
    type(input, 'bar');
    frameDocument.querySelector('[data-index="2"]').click();
    expect(frameDocument.querySelector('select').value).toBe('bb');
  });
});

const SUGGESTIONS = `
  <option value="12 Bay Street" label="12 Bay Street, Bridgetown, Saint Michael"></option>
  <option value="Bay Street">Bay Street, Bridgetown</option>
  <option value="Baxters Road"></option>`;

function mountInput(options = SUGGESTIONS) {
  document.body.innerHTML = `
    <label class="govbb-label" for="street">Street</label>
    <div class="govbb-combobox" data-govbb-module="combobox">
      <input class="govbb-input" id="street" name="street" list="street-suggestions" autocomplete="street-address" />
      <datalist id="street-suggestions">${options}</datalist>
    </div>`;
  initAll();
  return {
    root: document.querySelector('.govbb-combobox'),
    input: document.getElementById('street'),
    datalist: document.getElementById('street-suggestions'),
    list: document.querySelector('ul'),
    status: document.querySelector('[role="status"]'),
  };
}

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('combobox module over a text input and datalist', () => {
  it('enhances the input in place and takes over from the native datalist popup', () => {
    const { input, list } = mountInput();
    const label = document.querySelector('label');
    expect(input.id).toBe('street');
    expect(input.name).toBe('street');
    expect(input.getAttribute('role')).toBe('combobox');
    expect(input.getAttribute('aria-controls')).toBe(list.id);
    expect(list.id).toBe('street-listbox');
    expect(input.hasAttribute('list')).toBe(false);
    expect(input.getAttribute('autocomplete')).toBe('off');
    expect(label.htmlFor).toBe('street');
    expect(list.getAttribute('aria-labelledby')).toBe(label.id);
    expect(list.hidden).toBe(true);
  });

  it('offers the datalist options as typed, showing labels and storing values', () => {
    const { root, input, list, status } = mountInput();
    const onSelect = vi.fn();
    const onChange = vi.fn();
    root.addEventListener('govbb-combobox-select', onSelect);
    input.addEventListener('change', onChange);
    type(input, 'ba');
    expect(list.hidden).toBe(false);
    expect(shown(list)).toEqual([
      '12 Bay Street, Bridgetown, Saint Michael',
      'Bay Street, Bridgetown',
      'Baxters Road',
    ]); // unfiltered: the page decides what is suggested
    expect(status.textContent).toBe('3 results available');
    press(input, 'ArrowDown');
    press(input, 'Enter');
    expect(input.value).toBe('12 Bay Street');
    expect(list.hidden).toBe(true);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect.mock.calls[0][0].detail).toEqual({
      index: 0,
      value: '12 Bay Street',
      label: '12 Bay Street, Bridgetown, Saint Michael',
    });
  });

  it('keeps free text: blur and Enter leave what was typed', () => {
    const { input, list } = mountInput();
    type(input, 'somewhere new');
    expect(press(input, 'Enter').defaultPrevented).toBe(false); // submits
    expect(list.hidden).toBe(true);
    type(input, 'somewhere else');
    input.dispatchEvent(new Event('blur'));
    expect(input.value).toBe('somewhere else');
    expect(list.hidden).toBe(true);
  });

  it('follows the datalist as a lookup refills it', async () => {
    const { input, datalist, list } = mountInput('');
    input.focus();
    type(input, 'ba');
    expect(list.hidden).toBe(true); // nothing to suggest yet, no empty row
    datalist.innerHTML = SUGGESTIONS;
    await tick();
    expect(list.hidden).toBe(false);
    expect(shown(list)).toHaveLength(3);
    datalist.innerHTML = '';
    await tick();
    expect(list.hidden).toBe(true);
  });

  it('waits for the user before showing suggestions, then opens on click too', async () => {
    const { input, datalist, list } = mountInput('');
    input.focus();
    datalist.innerHTML = SUGGESTIONS;
    await tick();
    expect(list.hidden).toBe(true); // arrived unasked, with nothing typed
    input.click();
    expect(list.hidden).toBe(false);
  });

  it('shows the option matching the text as chosen', () => {
    const { input, list } = mountInput();
    type(input, 'Bay Street');
    expect(
      list.querySelector('.govbb-combobox__option--chosen').textContent,
    ).toBe('Bay Street, Bridgetown');
  });

  it('destroy() puts the input back', () => {
    document.body.innerHTML = `
      <div class="govbb-combobox">
        <input class="govbb-input" id="street" list="street-suggestions" autocomplete="street-address" />
        <datalist id="street-suggestions">${SUGGESTIONS}</datalist>
      </div>`;
    const root = document.querySelector('.govbb-combobox');
    const input = document.getElementById('street');
    const combobox = new Combobox(root);
    expect(input.getAttribute('autocomplete')).toBe('off');
    combobox.destroy();
    expect(root.querySelector('ul, [role="status"]')).toBeNull();
    expect(input.hasAttribute('role')).toBe(false);
    expect(input.hasAttribute('aria-expanded')).toBe(false);
    expect(input.getAttribute('list')).toBe('street-suggestions');
    expect(input.getAttribute('autocomplete')).toBe('street-address');
  });
});
