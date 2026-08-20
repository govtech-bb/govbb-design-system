import { cx } from 'class-variance-authority';
import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react';
import { FieldShell, useFieldIds, type FieldExtras } from '../form/field';

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> &
  FieldExtras & {
    /** Adornment before the field, e.g. a currency sign. Visual only
     *  (aria-hidden) — the label or description must carry its meaning. */
    prefix?: ReactNode;
    /** Adornment after the field, e.g. a unit. Visual only (aria-hidden). */
    suffix?: ReactNode;
  };

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    description,
    error,
    id,
    className,
    prefix,
    suffix,
    'aria-describedby': describedBy,
    'aria-invalid': ariaInvalid,
    ...props
  },
  ref,
) {
  const ids = useFieldIds(id ?? props.name, description != null, error != null);
  const composed = label != null || description != null || error != null;
  let input = (
    <input
      ref={ref}
      id={composed ? ids.fieldId : id}
      className={cx('govbb-input', className)}
      aria-describedby={cx(ids.describedBy, describedBy) || undefined}
      aria-invalid={error != null ? true : ariaInvalid}
      {...props}
    />
  );
  if (prefix != null || suffix != null) {
    input = (
      <div className="govbb-input-wrapper">
        {prefix != null && (
          <span className="govbb-input__prefix" aria-hidden="true">
            {prefix}
          </span>
        )}
        {input}
        {suffix != null && (
          <span className="govbb-input__suffix" aria-hidden="true">
            {suffix}
          </span>
        )}
      </div>
    );
  }
  if (!composed) return input;
  return (
    <FieldShell
      {...{ label, description, error, ...ids }}
      optional={props.required === false}
    >
      {input}
    </FieldShell>
  );
});

export type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> &
  FieldExtras;

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea(
    {
      label,
      description,
      error,
      id,
      className,
      'aria-describedby': describedBy,
      'aria-invalid': ariaInvalid,
      ...props
    },
    ref,
  ) {
    const ids = useFieldIds(
      id ?? props.name,
      description != null,
      error != null,
    );
    const composed = label != null || description != null || error != null;
    const textarea = (
      <textarea
        ref={ref}
        id={composed ? ids.fieldId : id}
        className={cx('govbb-textarea', className)}
        aria-describedby={cx(ids.describedBy, describedBy) || undefined}
        aria-invalid={error != null ? true : ariaInvalid}
        {...props}
      />
    );
    if (!composed) return textarea;
    return (
      <FieldShell
        {...{ label, description, error, ...ids }}
        optional={props.required === false}
      >
        {textarea}
      </FieldShell>
    );
  },
);
