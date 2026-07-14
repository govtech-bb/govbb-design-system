import { describe, expect, it, vi } from 'vitest';
import { initAll } from '../../../index.js';

function mount() {
  document.body.innerHTML = `
    <div class="govbb-number-input-wrapper" data-govbb-module="number-input">
      <input class="govbb-number-input" type="number" min="1" max="3" value="1" />
      <div class="govbb-number-input__steppers">
        <button class="govbb-number-input__step" type="button" aria-label="Increment"></button>
        <button class="govbb-number-input__step govbb-number-input__step--down" type="button" aria-label="Decrement"></button>
      </div>
    </div>`;
  initAll();
  return {
    input: document.querySelector('input'),
    up: document.querySelector('.govbb-number-input__step'),
    down: document.querySelector('.govbb-number-input__step--down'),
  };
}

describe('number-input module', () => {
  it('steps up and down and emits input and change', () => {
    const { input, up, down } = mount();
    const onChange = vi.fn();
    const onInput = vi.fn();
    input.addEventListener('change', onChange);
    input.addEventListener('input', onInput);
    up.click();
    expect(input.value).toBe('2');
    down.click();
    expect(input.value).toBe('1');
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onInput).toHaveBeenCalledTimes(2);
  });

  it('clamps at max', () => {
    const { input, up } = mount();
    input.value = '3';
    up.click();
    expect(input.value).toBe('3');
  });

  it('ignores clicks while disabled', () => {
    const { input, up } = mount();
    input.disabled = true;
    up.click();
    expect(input.value).toBe('1');
  });
});
