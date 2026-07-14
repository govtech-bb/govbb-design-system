import { cx } from 'class-variance-authority';
import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

/*
 * Dropzone + chosen-file list. Stateless: the consumer owns the file list
 * (from the input's onChange) and passes it back via `files`.
 */

export interface FileUploadProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'title'
> {
  title?: ReactNode;
  subtitle?: ReactNode;
  buttonLabel?: ReactNode;
  /** e.g. "Maximum size: 25MB". */
  maxSize?: ReactNode;
  files?: Array<{ name: string; onRemove?: () => void }>;
  removeLabel?: ReactNode;
}

/** Ref goes to the <input type="file">, not the wrapping div. */
export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  function FileUpload(
    {
      title = 'Upload a file',
      subtitle,
      buttonLabel = 'Choose file',
      maxSize,
      files,
      removeLabel = 'Remove',
      id,
      className,
      ...props
    },
    ref,
  ) {
    const autoId = useId();
    const inputId = id ?? autoId;
    return (
      <div className="govbb-file-upload">
        <label className="govbb-file-upload__dropzone" htmlFor={inputId}>
          <span className="govbb-file-upload__info">
            <span className="govbb-file-upload__title">{title}</span>
            {subtitle != null && (
              <span className="govbb-file-upload__subtitle">{subtitle}</span>
            )}
          </span>
          <input
            ref={ref}
            className={cx(
              'govbb-file-upload__input govbb-visually-hidden',
              className,
            )}
            id={inputId}
            type="file"
            {...props}
          />
          <span className="govbb-file-upload__action">
            <span className="govbb-button govbb-button--tertiary">
              {buttonLabel}
            </span>
            {maxSize != null && (
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
                    aria-label={
                      typeof removeLabel === 'string'
                        ? `${removeLabel} ${name}`
                        : undefined
                    }
                    onClick={onRemove}
                  >
                    {removeLabel}
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  },
);
