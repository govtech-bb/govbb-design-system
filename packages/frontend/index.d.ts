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
