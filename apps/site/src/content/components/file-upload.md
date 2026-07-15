---
title: File Upload
description: Use the file upload component to let users attach a file, such as a supporting document.
lede: Lets users attach a file, such as a supporting document.
group: Form elements
---

## Preview

```html title="File upload with an uploaded file"
<div class="govbb-form-group">
  <label class="govbb-label" id="proof-of-address-label" for="proof-of-address"
    >Proof of address</label
  >
  <span class="govbb-hint" id="proof-of-address-hint">
    This could be a recent utility bill or bank statement
  </span>
  <div class="govbb-file-upload" data-govbb-module="file-upload">
    <label class="govbb-file-upload__dropzone" for="proof-of-address">
      <span class="govbb-file-upload__info">
        <span class="govbb-file-upload__title">Upload a file</span>
        <span class="govbb-file-upload__subtitle"
          >Attach a .pdf, .docx, or .png file</span
        >
      </span>
      <input
        class="govbb-file-upload__input govbb-visually-hidden"
        id="proof-of-address"
        name="proof-of-address"
        type="file"
        aria-labelledby="proof-of-address-label"
        aria-describedby="proof-of-address-hint"
      />
      <span class="govbb-file-upload__action">
        <span class="govbb-button govbb-button--tertiary" aria-hidden="true"
          >Choose file</span
        >
        <span class="govbb-file-upload__max-size">Maximum size: 25MB</span>
      </span>
    </label>
    <ul class="govbb-file-upload__list">
      <li class="govbb-file-upload__item">
        <span class="govbb-file-upload__name">proof-of-address.pdf</span>
        <button
          type="button"
          class="govbb-button govbb-button--text govbb-button--negative"
          aria-label="Remove proof-of-address.pdf"
        >
          Remove
        </button>
      </li>
    </ul>
  </div>
</div>
```

```tsx
import { FileUpload, FormGroup, Hint, Label } from '@govtech-bb/react';

<FormGroup>
  <Label id="proof-of-address-label" htmlFor="proof-of-address">
    Proof of address
  </Label>
  <Hint id="proof-of-address-hint">
    This could be a recent utility bill or bank statement
  </Hint>
  <FileUpload
    id="proof-of-address"
    name="proof-of-address"
    subtitle="Attach a .pdf, .docx, or .png file"
    maxSize="Maximum size: 25MB"
    aria-describedby="proof-of-address-hint"
    files={[{ name: 'proof-of-address.pdf', onRemove: () => remove(0) }]}
  />
</FormGroup>;
```

The File Upload component lets users attach a file, such as a supporting document
or a photo of an ID. The whole dropzone acts as the label, so clicking anywhere
inside it opens the file picker, and uploaded files stay visible in a list so
users can confirm what they attached.

## When to use this component

Use file upload when you genuinely need a copy of a document that cannot be
verified another way, such as evidence of address or a scanned certificate.

## When not to use this component

Do not ask users to upload a file when the information could instead be entered as
text, looked up from another government system, or confirmed by a simple
declaration. Every upload is extra work and a chance to fail. Only ask for one
when it is strictly necessary.

## Guidance

State the accepted file types and the maximum size up front, in the subtitle and
the `.govbb-file-upload__max-size` text: users should not have to guess and
fail. Keep uploaded files visible in the list (`.govbb-file-upload__list`) so
users can confirm what they attached, and give each one a _Remove_ action so
they can correct a mistake without starting over.

Pair the dropzone with a `.govbb-form-group`, a visible `.govbb-label` naming
what to upload, and a `.govbb-hint` giving an example, such as _"This could be a
recent utility bill or bank statement"_.

## Errors

When an upload fails or a file is rejected, set `aria-invalid="true"` on the
input and show an error message (`.govbb-error-message`) with `role="alert"`,
linked to the input with `aria-describedby`. Keep the message specific, such as
_"Select a file"_ or _"The file must be smaller than 25MB"_.

```html title="File upload with an error"
<div class="govbb-form-group">
  <label class="govbb-label" id="proof-of-address-label" for="proof-of-address"
    >Proof of address</label
  >
  <span class="govbb-hint" id="proof-of-address-hint">
    This could be a recent utility bill or bank statement
  </span>
  <span class="govbb-error-message" id="proof-of-address-error" role="alert">
    Select a file
  </span>
  <div class="govbb-file-upload" data-govbb-module="file-upload">
    <label class="govbb-file-upload__dropzone" for="proof-of-address">
      <span class="govbb-file-upload__info">
        <span class="govbb-file-upload__title">Upload a file</span>
        <span class="govbb-file-upload__subtitle"
          >Attach a .pdf, .docx, or .png file</span
        >
      </span>
      <input
        class="govbb-file-upload__input govbb-visually-hidden"
        id="proof-of-address"
        name="proof-of-address"
        type="file"
        aria-invalid="true"
        aria-labelledby="proof-of-address-label"
        aria-describedby="proof-of-address-hint proof-of-address-error"
      />
      <span class="govbb-file-upload__action">
        <span class="govbb-button govbb-button--tertiary" aria-hidden="true"
          >Choose file</span
        >
        <span class="govbb-file-upload__max-size">Maximum size: 25MB</span>
      </span>
    </label>
  </div>
</div>
```

```tsx
import {
  ErrorMessage,
  FileUpload,
  FormGroup,
  Hint,
  Label,
} from '@govtech-bb/react';

<FormGroup>
  <Label htmlFor="proof-of-address">Proof of address</Label>
  <Hint id="proof-of-address-hint">
    This could be a recent utility bill or bank statement
  </Hint>
  <ErrorMessage id="proof-of-address-error" role="alert">
    Select a file
  </ErrorMessage>
  <FileUpload
    id="proof-of-address"
    name="proof-of-address"
    subtitle="Attach a .pdf, .docx, or .png file"
    maxSize="Maximum size: 25MB"
    aria-invalid
    aria-describedby="proof-of-address-hint proof-of-address-error"
  />
</FormGroup>;
```
