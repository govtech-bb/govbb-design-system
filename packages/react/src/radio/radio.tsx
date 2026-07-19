import { cx } from 'class-variance-authority';
import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useId,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { ErrorMessage, Fieldset, Hint } from '../form/form';
import type { HintOrError } from '../form/field';

export interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Rendered in the item's label, wired to the input via htmlFor. */
  label: ReactNode;
  /** Per-option hint, announced with the label via aria-describedby. */
  hint?: ReactNode;
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
      <div className="govbb-radio-item">
        <input
          ref={ref}
          className={cx('govbb-radio', className)}
          id={inputId}
          type="radio"
          aria-describedby={cx(hintId, ariaDescribedBy) || undefined}
          aria-controls={conditionalId}
          {...props}
        />
        <label className="govbb-radio-item__label" htmlFor={inputId}>
          {label}
        </label>
        {hint != null && (
          <span className="govbb-hint" id={hintId}>
            {hint}
          </span>
        )}
      </div>
      {conditional != null && (
        <div className="govbb-radio-item__conditional" id={conditionalId}>
          {conditional}
        </div>
      )}
    </>
  );
});

export type RadioGroupProps = {
  /** Fieldset legend describing the whole group. */
  legend: ReactNode;
  /** Shared name for the radios. Required for a single-choice group. */
  name: string;
  /** Controlled selected value. */
  value?: string;
  /** Fires with the newly selected radio's `value`. */
  onValueChange?: (value: string) => void;
  className?: string;
  children: ReactNode;
} & HintOrError;

/*
 * Wires a set of <Radio> children into a controlled single-choice group:
 * shared name, checked derived from `value`, and change routed to
 * onValueChange. Explicit props on a child still win. Non-<Radio> children
 * (dividers, "or" separators) pass through untouched.
 */
export function RadioGroup({
  legend,
  hint,
  error,
  name,
  value,
  onValueChange,
  className,
  children,
}: RadioGroupProps) {
  const id = useId();
  const hintId = hint != null && error == null ? `${id}-hint` : undefined;
  const errorId = error != null ? `${id}-error` : undefined;
  return (
    <Fieldset
      legend={legend}
      className={className}
      aria-describedby={cx(hintId, errorId) || undefined}
    >
      {hint != null && error == null && <Hint id={hintId}>{hint}</Hint>}
      {error != null && <ErrorMessage id={errorId}>{error}</ErrorMessage>}
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
}
