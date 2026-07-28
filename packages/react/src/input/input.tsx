import { cx } from 'class-variance-authority';
import {
  forwardRef,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import { FieldShell, useFieldIds, type FieldExtras } from '../form/field';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & FieldExtras;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
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
  const ids = useFieldIds(id ?? props.name, description != null, error != null);
  const composed = label != null || description != null || error != null;
  const input = (
    <input
      ref={ref}
      id={composed ? ids.fieldId : id}
      className={cx('govbb-input', className)}
      aria-describedby={cx(ids.describedBy, describedBy) || undefined}
      aria-invalid={error != null ? true : ariaInvalid}
      {...props}
    />
  );
  if (!composed) return input;
  return (
    <FieldShell {...{ label, description, error, ...ids }}>{input}</FieldShell>
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
      <FieldShell {...{ label, description, error, ...ids }}>
        {textarea}
      </FieldShell>
    );
  },
);
