/** Scan `root` for `[data-govbb-module]` elements and progressively enhance each one. */
export function initAll(root?: ParentNode): void;

/** Stepper buttons for `.govbb-number-input-wrapper` (`data-govbb-module="number-input"`). */
export class NumberInput {
  constructor(el: HTMLElement);
  destroy(): void;
}

/** Chosen-file list for `.govbb-file-upload` (`data-govbb-module="file-upload"`). */
export class FileUpload {
  constructor(el: HTMLElement);
  destroy(): void;
}

/** Menu toggle for `.govbb-header` (`data-govbb-module="header"`). */
export class Header {
  constructor(el: HTMLElement);
  destroy(): void;
}

/**
 * Filterable listbox for `.govbb-combobox` (`data-govbb-module="combobox"`): over a
 * native <select> (value stays one of its options) or over a text <input> with a
 * <datalist> (free text; the datalist's options are the suggestions). Choosing
 * an option fires input + change on the value-carrying element, then a bubbling
 * `govbb-combobox-select` CustomEvent (detail: index, value, label) on the root.
 */
export class Combobox {
  constructor(el: HTMLElement);
  /** Re-read the wrapped control: mirror a select's state onto the enhanced
   *  input and re-render the list from the current options. */
  sync(): void;
  destroy(): void;
}
