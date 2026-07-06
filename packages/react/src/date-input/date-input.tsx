import { cx } from 'class-variance-authority';
import {
  forwardRef,
  useId,
  type ComponentPropsWithRef,
  type ReactNode,
} from 'react';

/*
 * Day / month / year fieldset. Field labels and structure are fixed; pass
 * dayProps/monthProps/yearProps to reach the individual inputs (name, value,
 * onChange, aria-invalid, ref, …). The forwarded ref goes to the <fieldset>.
 */

type FieldProps = ComponentPropsWithRef<'input'>;

export interface DateInputProps {
  legend: ReactNode;
  hint?: ReactNode;
  /** Validation error shown between the hint and the fields. */
  error?: ReactNode;
  dayProps?: FieldProps;
  monthProps?: FieldProps;
  yearProps?: FieldProps;
}

export const DateInput = forwardRef<HTMLFieldSetElement, DateInputProps>(
  function DateInput(
    { legend, hint, error, dayProps, monthProps, yearProps },
    ref,
  ) {
    const id = useId();
    const hintId = hint != null ? `${id}-hint` : undefined;
    const errorId = error != null ? `${id}-error` : undefined;
    const parts = [
      { label: 'Day', partId: `${id}-day`, props: dayProps },
      { label: 'Month', partId: `${id}-month`, props: monthProps },
      { label: 'Year', partId: `${id}-year`, props: yearProps, year: true },
    ];
    return (
      <fieldset
        ref={ref}
        className="govbb-fieldset"
        role="group"
        aria-describedby={
          [hintId, errorId].filter(Boolean).join(' ') || undefined
        }
      >
        <legend className="govbb-fieldset__legend">{legend}</legend>
        {hint != null && (
          <p className="govbb-hint" id={hintId}>
            {hint}
          </p>
        )}
        {error != null && (
          <p className="govbb-error-message" id={errorId} role="alert">
            {error}
          </p>
        )}
        <div className="govbb-date-input">
          {parts.map(({ label, partId, props, year }) => (
            <div className="govbb-date-input__part" key={partId}>
              <label className="govbb-label" htmlFor={partId}>
                {label}
              </label>
              <input
                type="text"
                inputMode="numeric"
                {...props}
                className={cx(
                  'govbb-input govbb-date-input__field',
                  year && 'govbb-date-input__field--year',
                  props?.className,
                )}
                id={partId}
              />
            </div>
          ))}
        </div>
      </fieldset>
    );
  },
);
