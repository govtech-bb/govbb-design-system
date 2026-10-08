import { cx } from 'class-variance-authority';
import {
  forwardRef,
  useId,
  type FieldsetHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { ErrorMessage, Fieldset, Hint, has } from '../form/form';
import type { FieldFeedback } from '../form/field';

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type'
> {
  /** Rendered in the item's label, wired to the input via htmlFor. */
  label: ReactNode;
  /** Per-option description, announced with the label via aria-describedby. */
  description?: ReactNode;
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
      description,
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
    const descriptionId = has(description)
      ? `${inputId}-description`
      : undefined;
    const conditionalId = has(conditional)
      ? `${inputId}-conditional`
      : undefined;
    return (
      <>
        <div className="govbb-checkbox-item">
          <input
            ref={ref}
            className={cx('govbb-checkbox', className)}
            id={inputId}
            aria-describedby={cx(descriptionId, ariaDescribedBy) || undefined}
            aria-controls={conditionalId}
            {...props}
            type="checkbox"
          />
          <label className="govbb-checkbox-item__label" htmlFor={inputId}>
            {label}
          </label>
          {has(description) && (
            <span className="govbb-hint" id={descriptionId}>
              {description}
            </span>
          )}
        </div>
        {has(conditional) && (
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
} & FieldFeedback;

/*
 * Fieldset scaffolding for a set of <Checkbox> children: legend, description and
 * error. Checkboxes are independent booleans, so — unlike RadioGroup — this
 * holds no state; each Checkbox stays controlled by the consumer.
 */
export const CheckboxGroup = forwardRef<
  HTMLFieldSetElement,
  CheckboxGroupProps
>(function CheckboxGroup(
  {
    legend,
    description,
    error,
    children,
    'aria-describedby': describedBy,
    ...props
  },
  ref,
) {
  const id = useId();
  const descriptionId = has(description) ? `${id}-description` : undefined;
  const errorId = has(error) ? `${id}-error` : undefined;
  return (
    <Fieldset
      ref={ref}
      legend={legend}
      aria-describedby={cx(descriptionId, errorId, describedBy) || undefined}
      {...props}
    >
      {has(description) && <Hint id={descriptionId}>{description}</Hint>}
      {has(error) && (
        <ErrorMessage id={errorId} role="alert">
          {error}
        </ErrorMessage>
      )}
      {children}
    </Fieldset>
  );
});
