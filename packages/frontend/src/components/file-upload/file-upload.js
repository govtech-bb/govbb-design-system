/*
 * File upload chosen-file list. Enhances .govbb-file-upload: mirrors the
 * input's FileList into .govbb-file-upload__list with a Remove button per
 * file. Override the button text with data-remove-label on the module root.
 */
export class FileUpload {
  /** @param {HTMLElement} el */
  constructor(el) {
    this.el = el;
    this.input = el.querySelector('input[type="file"]');
    this.list = el.querySelector('.govbb-file-upload__list');
    if (!this.list) {
      this.list = el.ownerDocument.createElement('ul');
      this.list.className = 'govbb-file-upload__list';
      el.append(this.list);
    }
    this.removeLabel = el.dataset.removeLabel ?? 'Remove';
    this.onChange = this.render.bind(this);
    this.onClick = this.onClick.bind(this);
    this.input?.addEventListener('change', this.onChange);
    this.list.addEventListener('click', this.onClick);
    this.render();
  }

  render() {
    const doc = this.el.ownerDocument;
    const items = Array.from(this.input?.files ?? [], (file, index) => {
      const item = doc.createElement('li');
      item.className = 'govbb-file-upload__item';
      const name = doc.createElement('span');
      name.className = 'govbb-file-upload__name';
      name.textContent = file.name;
      const remove = doc.createElement('button');
      remove.className =
        'govbb-button govbb-button--text govbb-button--negative';
      remove.type = 'button';
      remove.dataset.index = String(index);
      remove.textContent = this.removeLabel;
      item.append(name, remove);
      return item;
    });
    this.list.replaceChildren(...items);
  }

  /** @param {MouseEvent} event */
  onClick(event) {
    // Duck-typed rather than instanceof Element: the element may belong to
    // another realm when initAll() is called on a different document (iframe).
    const target = /** @type {Element | null} */ (event.target);
    if (typeof target?.closest !== 'function') return;
    const button = target.closest('button[data-index]');
    if (!button || !this.input) return;
    const index = Number(button.dataset.index);
    const transfer = new DataTransfer();
    for (const [i, file] of Array.from(this.input.files ?? []).entries()) {
      if (i !== index) transfer.items.add(file);
    }
    this.input.files = transfer.files;
    // our own change listener re-renders the list
    this.input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  destroy() {
    this.input?.removeEventListener('change', this.onChange);
    this.list.removeEventListener('click', this.onClick);
  }
}
