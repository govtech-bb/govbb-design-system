import { cx } from 'class-variance-authority';
import { forwardRef, type SelectHTMLAttributes } from 'react';
import { FieldShell, useFieldIds, type FieldExtras } from '../form/field';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export type SelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'multiple'
> &
  FieldExtras & { options?: SelectOption[] };

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    {
      label,
      hint,
      error,
      options,
      id,
      className,
      children,
      'aria-describedby': describedBy,
      ...props
    },
    ref,
  ) {
    const ids = useFieldIds(
      id ?? props.name,
      hint != null && error == null,
      error != null,
    );
    const composed = label != null || hint != null || error != null;
    const select = (
      <select
        ref={ref}
        id={composed ? ids.fieldId : id}
        className={cx('govbb-select', className)}
        aria-describedby={cx(ids.describedBy, describedBy) || undefined}
        aria-invalid={error != null || undefined}
        {...props}
        multiple={false}
      >
        {options?.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        )) ?? children}
      </select>
    );
    if (!composed) return select;
    return (
      <FieldShell {...{ label, hint, error, ...ids }}>{select}</FieldShell>
    );
  },
);
