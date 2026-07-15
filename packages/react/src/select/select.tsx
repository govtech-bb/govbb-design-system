import { cx } from 'class-variance-authority';
import { forwardRef, type SelectHTMLAttributes } from 'react';
import { FieldShell, useFieldIds, type FieldExtras } from '../form/field';

export interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement>, FieldExtras {}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
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
    const ids = useFieldIds(id, hint != null, error != null);
    const composed = label != null || hint != null || error != null;
    const select = (
      <select
        ref={ref}
        id={composed ? ids.fieldId : id}
        className={cx('govbb-select', className)}
        aria-describedby={cx(ids.describedBy, describedBy) || undefined}
        aria-invalid={error != null || undefined}
        {...props}
      />
    );
    if (!composed) return select;
    return (
      <FieldShell {...{ label, hint, error, ...ids }}>{select}</FieldShell>
    );
  },
);
