import { cx } from 'class-variance-authority';
import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useId,
  type ChangeEvent,
  type FieldsetHTMLAttributes,
  type InputHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { ErrorMessage, Fieldset, Hint, has } from '../form/form';
import type { FieldFeedback } from '../form/field';

export interface RadioProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type'
> {
  /** Rendered in the item's label, wired to the input via htmlFor. */
  label: ReactNode;
  /** Per-option description, announced with the label via aria-describedby. */
  description?: ReactNode;
  /**
   * Revealed below the item while this radio is checked (pure CSS, via
   * :has() on the sibling). Rendered even when hidden — keep it light.
   */
  conditional?: ReactNode;
}

/** Ref goes to the <input>, not the wrapping item div. */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
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
  const descriptionId = has(description) ? `${inputId}-description` : undefined;
  const conditionalId = has(conditional) ? `${inputId}-conditional` : undefined;
  return (
    <>
      <div className="govbb-radio-item">
        <input
          ref={ref}
          className={cx('govbb-radio', className)}
          id={inputId}
          aria-describedby={cx(descriptionId, ariaDescribedBy) || undefined}
          aria-controls={conditionalId}
          {...props}
          type="radio"
        />
        <label className="govbb-radio-item__label" htmlFor={inputId}>
          {label}
        </label>
        {has(description) && (
          <span className="govbb-hint" id={descriptionId}>
            {description}
          </span>
        )}
      </div>
      {has(conditional) && (
        <div className="govbb-radio-item__conditional" id={conditionalId}>
          {conditional}
        </div>
      )}
    </>
  );
});

export type RadioGroupProps = FieldsetHTMLAttributes<HTMLFieldSetElement> & {
  /** Fieldset legend describing the whole group. */
  legend: ReactNode;
  /** Shared name for the radios. Required for a single-choice group. */
  name: string;
  /** Controlled selected value. */
  value?: string;
  /** Fires with the newly selected radio's `value`. */
  onValueChange?: (value: string) => void;
  children: ReactNode;
} & FieldFeedback;

/*
 * Wires a set of <Radio> children into a controlled single-choice group:
 * shared name, checked derived from `value`, and change routed to
 * onValueChange. Explicit props on a child still win. Non-<Radio> children
 * (dividers, "or" separators) pass through untouched.
 */
export const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  function RadioGroup(
    {
      legend,
      description,
      error,
      name,
      value,
      onValueChange,
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
        {Children.map(children, (child) => {
          if (!isValidElement(child)) return child;
          const radio = child as ReactElement<RadioProps>;
          if (radio.props.value == null) return child;
          return cloneElement(radio, {
            name: radio.props.name ?? name,
            checked: radio.props.checked ?? radio.props.value === value,
            onChange: (event: ChangeEvent<HTMLInputElement>) => {
              radio.props.onChange?.(event);
              onValueChange?.(String(radio.props.value));
            },
          });
        })}
      </Fieldset>
    );
  },
);
