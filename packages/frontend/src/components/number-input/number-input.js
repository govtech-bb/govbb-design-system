/*
 * Number input steppers. Enhances .govbb-number-input-wrapper: clicking a
 * .govbb-number-input__step button steps the native input and emits a
 * bubbling change event so form code sees the update.
 */
export class NumberInput {
  /** @param {HTMLElement} el */
  constructor(el) {
    this.el = el;
    this.input = el.querySelector('.govbb-number-input');
    this.onClick = this.onClick.bind(this);
    el.addEventListener('click', this.onClick);
  }

  /** @param {MouseEvent} event */
  onClick(event) {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest('.govbb-number-input__step');
    const input = this.input;
    if (!button || !input || input.disabled || input.readOnly) return;
    if (button.classList.contains('govbb-number-input__step--down')) {
      input.stepDown();
    } else {
      input.stepUp();
    }
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  destroy() {
    this.el.removeEventListener('click', this.onClick);
  }
}
