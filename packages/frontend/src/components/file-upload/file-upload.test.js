import { beforeEach, describe, expect, it } from 'vitest';
import { initAll } from '../../../index.js';

/* jsdom lacks DataTransfer; a minimal stand-in for the remove path. */
class FakeDataTransfer {
  constructor() {
    const files = [];
    this.items = { add: (file) => files.push(file) };
    this.files = files;
  }
}

function setFiles(input, files) {
  Object.defineProperty(input, 'files', {
    value: files,
    writable: true,
    configurable: true,
  });
}

function mount() {
  document.body.innerHTML = `
    <div class="govbb-file-upload" data-govbb-module="file-upload">
      <label class="govbb-file-upload__dropzone" for="f">
        <input class="govbb-visually-hidden" id="f" type="file" multiple />
      </label>
      <ul class="govbb-file-upload__list"></ul>
    </div>`;
  initAll();
  return document.querySelector('input');
}

describe('file-upload module', () => {
  beforeEach(() => {
    globalThis.DataTransfer = FakeDataTransfer;
  });

  it('mirrors chosen files into the list', () => {
    const input = mount();
    setFiles(input, [{ name: 'proof.pdf' }, { name: 'id.png' }]);
    input.dispatchEvent(new Event('change', { bubbles: true }));
    const names = [...document.querySelectorAll('.govbb-file-upload__name')];
    expect(names.map((n) => n.textContent)).toEqual(['proof.pdf', 'id.png']);
    expect(document.querySelectorAll('button').length).toBe(2);
  });

  it('removes a single file and re-renders', () => {
    const input = mount();
    setFiles(input, [{ name: 'proof.pdf' }, { name: 'id.png' }]);
    input.dispatchEvent(new Event('change', { bubbles: true }));
    document.querySelector('button[data-index="0"]').click();
    const names = [...document.querySelectorAll('.govbb-file-upload__name')];
    expect(names.map((n) => n.textContent)).toEqual(['id.png']);
  });

  it('announces removal and parks focus on the input', () => {
    const input = mount();
    setFiles(input, [{ name: 'proof.pdf' }, { name: 'id.png' }]);
    input.dispatchEvent(new Event('change', { bubbles: true }));
    document.querySelector('button[data-index="0"]').click();
    const status = document.querySelector('[role="status"]');
    expect(status.className).toBe('govbb-visually-hidden');
    expect(status.textContent).toBe('proof.pdf removed');
    expect(document.activeElement).toBe(input);
  });

  it('honours a custom remove label', () => {
    document.body.innerHTML = `
      <div class="govbb-file-upload" data-govbb-module="file-upload" data-remove-label="Delete">
        <input type="file" />
      </div>`;
    initAll();
    const input = document.querySelector('input');
    setFiles(input, [{ name: 'a.pdf' }]);
    input.dispatchEvent(new Event('change', { bubbles: true }));
    expect(document.querySelector('button').textContent).toBe('Delete');
  });
});
