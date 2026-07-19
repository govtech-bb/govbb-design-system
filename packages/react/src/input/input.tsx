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
    hint,
    error,
    id,
    className,
    'aria-describedby': describedBy,
    ...props
  },
  ref,
) {
  const ids = useFieldIds(id, hint != null && error == null, error != null);
  const composed = label != null || hint != null || error != null;
  const input = (
    <input
      ref={ref}
      id={composed ? ids.fieldId : id}
      className={cx('govbb-input', className)}
      aria-describedby={cx(ids.describedBy, describedBy) || undefined}
      aria-invalid={error != null || undefined}
      {...props}
    />
  );
  if (!composed) return input;
  return <FieldShell {...{ label, hint, error, ...ids }}>{input}</FieldShell>;
});

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> &
  FieldExtras;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      label,
      hint,
      error,
      id,
      className,
      'aria-describedby': describedBy,
      ...props
    },
    ref,
  ) {
    const ids = useFieldIds(id, hint != null && error == null, error != null);
    const composed = label != null || hint != null || error != null;
    const textarea = (
      <textarea
        ref={ref}
        id={composed ? ids.fieldId : id}
        className={cx('govbb-textarea', className)}
        aria-describedby={cx(ids.describedBy, describedBy) || undefined}
        aria-invalid={error != null || undefined}
        {...props}
      />
    );
    if (!composed) return textarea;
    return (
      <FieldShell {...{ label, hint, error, ...ids }}>{textarea}</FieldShell>
    );
  },
);
