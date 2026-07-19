import { cx } from 'class-variance-authority';
import {
  forwardRef,
  useId,
  type FieldsetHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { ErrorMessage, Fieldset, Hint } from '../form/form';
import type { HintOrError } from '../form/field';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Rendered in the item's label, wired to the input via htmlFor. */
  label: ReactNode;
  /** Per-option hint, announced with the label via aria-describedby. */
  hint?: ReactNode;
  /**
   * Revealed below the item while this checkbox is checked (pure CSS, via
   * :has() on the sibling). Rendered even when hidden — keep it light.
   */
  conditional?: ReactNode;
}

/** Ref goes to the <input>, not the wrapping item div. */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      label,
      hint,
      conditional,
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
    const conditionalId =
      conditional != null ? `${inputId}-conditional` : undefined;
    return (
      <>
        <div className="govbb-checkbox-item">
          <input
            ref={ref}
            className={cx('govbb-checkbox', className)}
            id={inputId}
            type="checkbox"
            aria-describedby={cx(hintId, ariaDescribedBy) || undefined}
            aria-controls={conditionalId}
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
        {conditional != null && (
          <div className="govbb-checkbox-item__conditional" id={conditionalId}>
            {conditional}
          </div>
        )}
      </>
    );
  },
);

export type CheckboxGroupProps = FieldsetHTMLAttributes<HTMLFieldSetElement> & {
  /** Fieldset legend describing the whole group. */
  legend: ReactNode;
  children: ReactNode;
} & HintOrError;

/*
 * Fieldset scaffolding for a set of <Checkbox> children: legend, hint and
 * error. Checkboxes are independent booleans, so — unlike RadioGroup — this
 * holds no state; each Checkbox stays controlled by the consumer.
 */
export const CheckboxGroup = forwardRef<
  HTMLFieldSetElement,
  CheckboxGroupProps
>(function CheckboxGroup(
  { legend, hint, error, children, 'aria-describedby': describedBy, ...props },
  ref,
) {
  const id = useId();
  const hintId = hint != null && error == null ? `${id}-hint` : undefined;
  const errorId = error != null ? `${id}-error` : undefined;
  return (
    <Fieldset
      ref={ref}
      legend={legend}
      aria-describedby={cx(hintId, errorId, describedBy) || undefined}
      {...props}
    >
      {hint != null && error == null && <Hint id={hintId}>{hint}</Hint>}
      {error != null && (
        <ErrorMessage id={errorId} role="alert">
          {error}
        </ErrorMessage>
      )}
      {children}
    </Fieldset>
  );
});
