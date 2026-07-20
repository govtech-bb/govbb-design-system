---
title: File upload
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
import { useState } from 'react';
import { FileUpload, FormGroup, Hint, Label } from '@govtech-bb/react';

const [files, setFiles] = useState<File[]>([]);

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
    aria-labelledby="proof-of-address-label"
    aria-describedby="proof-of-address-hint"
    onChange={(event) => setFiles(Array.from(event.currentTarget.files ?? []))}
    files={files.map((file, index) => ({
      name: file.name,
      onRemove: () =>
        setFiles((current) =>
          current.filter((_, itemIndex) => itemIndex !== index),
        ),
    }))}
  />
</FormGroup>;
```

The File Upload component lets users attach a file, such as a supporting document
or a photo of an ID. The whole dropzone acts as the label, so clicking anywhere
inside it opens the file picker, and uploaded files stay visible in a list so
users can confirm what they attached.

## Usage

<div class="govbb-usage-guidance">
  <section class="govbb-usage-guidance__item" aria-labelledby="file-upload-when-to-use">
    <h3 id="file-upload-when-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--do" aria-hidden="true">✓</span>
      When to use
    </h3>
    <ul>
      <li>Use file upload only when a document is necessary to complete the service.</li>
      <li>Use it for evidence that cannot be entered, declared or verified another way.</li>
    </ul>
  </section>
  <section class="govbb-usage-guidance__item" aria-labelledby="file-upload-when-not-to-use">
    <h3 id="file-upload-when-not-to-use">
      <span class="govbb-usage-guidance__icon govbb-usage-guidance__icon--dont" aria-hidden="true">×</span>
      When not to use
    </h3>
    <ul>
      <li>Do not request optional documents “just in case”.</li>
      <li>Do not require a file format or size that creates unnecessary software, connectivity or data costs.</li>
    </ul>
  </section>
</div>

## Best practices

### Explain restrictions before users choose a file

State the accepted file types, maximum size and whether more than one file is
allowed in hint text. Use the `accept` attribute to narrow the system file
picker, but validate the file again on the server.

### Prefer one document per input

One clearly labelled input per document is easier to understand than a single
multi-file picker. Let users see what they selected, remove the wrong file and
reuse an upload within the same journey where it is safe to do so.

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
        aria-describedby="proof-of-address-error"
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
  <ErrorMessage id="proof-of-address-error" role="alert">
    Select a file
  </ErrorMessage>
  <FileUpload
    id="proof-of-address"
    name="proof-of-address"
    subtitle="Attach a .pdf, .docx, or .png file"
    maxSize="Maximum size: 25MB"
    aria-invalid
    aria-describedby="proof-of-address-error"
  />
</FormGroup>;
```
