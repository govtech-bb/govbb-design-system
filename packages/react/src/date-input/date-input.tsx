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
  dayProps?: FieldProps;
  monthProps?: FieldProps;
  yearProps?: FieldProps;
}

export const DateInput = forwardRef<HTMLFieldSetElement, DateInputProps>(
  function DateInput({ legend, hint, dayProps, monthProps, yearProps }, ref) {
    const id = useId();
    const hintId = hint != null ? `${id}-hint` : undefined;
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
        aria-describedby={hintId}
      >
        <legend className="govbb-fieldset__legend">{legend}</legend>
        {hint != null && (
          <p className="govbb-hint" id={hintId}>
            {hint}
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
