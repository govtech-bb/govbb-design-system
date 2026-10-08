import { cx } from 'class-variance-authority';
import {
  forwardRef,
  useRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { FieldShell, useFieldIds, type FieldExtras } from '../form/field';
import { has } from '../form/form';

/*
 * Dropzone + chosen-file list. Stateless: the consumer owns the file list
 * (from the input's onChange) and passes it back via `files`.
 */

export type FileUploadProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'title' | 'type'
> &
  FieldExtras & {
    title?: ReactNode;
    subtitle?: ReactNode;
    buttonLabel?: ReactNode;
    /** e.g. "Maximum size: 25MB". */
    maxSize?: ReactNode;
    files?: Array<{ name: string; onRemove?: () => void }>;
    /** A string: it doubles as each remove button's accessible name. */
    removeLabel?: string;
  };

/** Ref goes to the <input type="file">, not the wrapping div. */
export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  function FileUpload(
    {
      label,
      description,
      error,
      title = 'Upload a file',
      subtitle,
      buttonLabel = 'Choose file',
      maxSize,
      files,
      removeLabel = 'Remove',
      id,
      name,
      className,
      'aria-describedby': describedBy,
      'aria-labelledby': labelledBy,
      'aria-invalid': ariaInvalid,
      ...props
    },
    ref,
  ) {
    const ids = useFieldIds(id ?? name, has(description), has(error));
    const composed = has(label) || has(description) || has(error);
    const inputId = ids.fieldId;
    const labelId = has(label) ? `${ids.fieldId}-label` : undefined;
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [announcement, setAnnouncement] = useState('');
    function handleRemove(name: string, onRemove: () => void) {
      inputRef.current?.focus();
      setAnnouncement(`${name} removed`);
      onRemove();
    }
    const upload = (
      <div className="govbb-file-upload">
        <label className="govbb-file-upload__dropzone" htmlFor={inputId}>
          <span className="govbb-file-upload__info">
            <span className="govbb-file-upload__title">{title}</span>
            {has(subtitle) && (
              <span className="govbb-file-upload__subtitle">{subtitle}</span>
            )}
          </span>
          <input
            ref={(node) => {
              inputRef.current = node;
              if (ref == null) return;
              if ('current' in ref) ref.current = node;
              else ref(node);
            }}
            className={cx(
              'govbb-file-upload__input govbb-visually-hidden',
              className,
            )}
            id={inputId}
            name={name}
            aria-describedby={cx(ids.describedBy, describedBy) || undefined}
            aria-labelledby={cx(labelId, labelledBy) || undefined}
            aria-invalid={has(error) ? true : ariaInvalid}
            {...props}
            type="file"
          />
          <span className="govbb-file-upload__action">
            <span
              className="govbb-button govbb-button--tertiary"
              aria-hidden="true"
            >
              {buttonLabel}
            </span>
            {has(maxSize) && (
              <span className="govbb-file-upload__max-size">{maxSize}</span>
            )}
          </span>
        </label>
        {files != null && files.length > 0 && (
          <ul className="govbb-file-upload__list">
            {files.map(({ name, onRemove }) => (
              <li className="govbb-file-upload__item" key={name}>
                <span className="govbb-file-upload__name">{name}</span>
                {onRemove != null && (
                  <button
                    className="govbb-button govbb-button--text govbb-button--negative"
                    type="button"
                    // Matches the PE runtime: name each button after its file
                    // so "Remove" buttons are distinguishable to AT.
                    aria-label={`${removeLabel} ${name}`}
                    onClick={() => handleRemove(name, onRemove)}
                  >
                    {removeLabel}
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
        <span className="govbb-visually-hidden" role="status">
          {announcement}
        </span>
      </div>
    );
    if (!composed) return upload;
    return (
      <FieldShell
        {...{ label, description, error, labelId, ...ids }}
        optional={props.required === false}
      >
        {upload}
      </FieldShell>
    );
  },
);
