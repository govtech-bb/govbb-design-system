import { cx } from 'class-variance-authority';
import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { ErrorMessage, Fieldset, Hint } from '../form/form';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Rendered in the item's label, wired to the input via htmlFor. */
  label: ReactNode;
  /** Per-option hint, announced with the label via aria-describedby. */
  hint?: ReactNode;
}

/** Ref goes to the <input>, not the wrapping item div. */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      label,
      hint,
      id,
      className,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref,
  ) {
    const autoId = useId();
    const inputId = id ?? autoId;
    const hintId = hint != null ? `${inputId}-hint` : undefined;
    return (
      <div className="govbb-checkbox-item">
        <input
          ref={ref}
          className={cx('govbb-checkbox', className)}
          id={inputId}
          type="checkbox"
          aria-describedby={cx(hintId, ariaDescribedBy) || undefined}
          {...props}
        />
        <label className="govbb-checkbox-item__label" htmlFor={inputId}>
          {label}
        </label>
        {hint != null && (
          <span className="govbb-hint" id={hintId}>
            {hint}
          </span>
        )}
      </div>
    );
  },
);

export interface CheckboxGroupProps {
  /** Fieldset legend describing the whole group. */
  legend: ReactNode;
  /** Group-level hint, announced via the fieldset's aria-describedby. */
  hint?: ReactNode;
  /** Group-level error; announced and marks the group invalid. */
  error?: ReactNode;
  className?: string;
  children: ReactNode;
}

/*
 * Fieldset scaffolding for a set of <Checkbox> children: legend, hint and
 * error. Checkboxes are independent booleans, so — unlike RadioGroup — this
 * holds no state; each Checkbox stays controlled by the consumer.
 */
export function CheckboxGroup({
  legend,
  hint,
  error,
  className,
  children,
}: CheckboxGroupProps) {
  const id = useId();
  const hintId = hint != null ? `${id}-hint` : undefined;
  const errorId = error != null ? `${id}-error` : undefined;
  return (
    <Fieldset
      legend={legend}
      className={className}
      aria-describedby={cx(hintId, errorId) || undefined}
    >
      {hint != null && <Hint id={hintId}>{hint}</Hint>}
      {error != null && <ErrorMessage id={errorId}>{error}</ErrorMessage>}
      {children}
    </Fieldset>
  );
}
