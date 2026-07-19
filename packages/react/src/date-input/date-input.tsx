import { cx } from 'class-variance-authority';
import {
  forwardRef,
  useId,
  type ChangeEvent,
  type ComponentPropsWithRef,
  type ReactNode,
} from 'react';
import { FormGroup } from '../form/form';
import type { HintOrError } from '../form/field';

/*
 * Day / month / year fieldset. Field labels and structure are fixed; pass
 * dayProps/monthProps/yearProps to reach the individual inputs (name, value,
 * onChange, aria-invalid, ref, …). The forwarded ref goes to the <fieldset>.
 */

type FieldProps = ComponentPropsWithRef<'input'>;

export interface DateInputValue {
  day: string;
  month: string;
  year: string;
}

export function formatDateInput(value: DateInputValue): string {
  const { day, month, year } = value;
  if (!day || !month || !year) return '';
  return `${year.padStart(4, '0')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

export function parseDateInput(iso: string): DateInputValue {
  const [year = '', month = '', day = ''] = iso.split('-');
  return { day, month, year };
}

export type DateInputProps = {
  legend: ReactNode;
  name?: string;
  value?: DateInputValue;
  onChange?: (value: DateInputValue) => void;
  dayProps?: FieldProps;
  monthProps?: FieldProps;
  yearProps?: FieldProps;
} & HintOrError;

export const DateInput = forwardRef<HTMLFieldSetElement, DateInputProps>(
  function DateInput(
    {
      legend,
      hint,
      error,
      name,
      value,
      onChange,
      dayProps,
      monthProps,
      yearProps,
    },
    ref,
  ) {
    const id = useId();
    const hintId = hint != null && error == null ? `${id}-hint` : undefined;
    const errorId = error != null ? `${id}-error` : undefined;
    const parts = [
      {
        label: 'Day',
        part: 'day' as const,
        partId: dayProps?.id ?? `${id}-day`,
        props: dayProps,
      },
      {
        label: 'Month',
        part: 'month' as const,
        partId: monthProps?.id ?? `${id}-month`,
        props: monthProps,
      },
      {
        label: 'Year',
        part: 'year' as const,
        partId: yearProps?.id ?? `${id}-year`,
        props: yearProps,
        year: true,
      },
    ];
    return (
      <FormGroup>
        <fieldset
          ref={ref}
          className="govbb-fieldset"
          role="group"
          aria-describedby={
            [hintId, errorId].filter(Boolean).join(' ') || undefined
          }
        >
          <legend className="govbb-fieldset__legend">{legend}</legend>
          {hint != null && error == null && (
            <span className="govbb-hint" id={hintId}>
              {hint}
            </span>
          )}
          {error != null && (
            <span className="govbb-error-message" id={errorId} role="alert">
              {error}
            </span>
          )}
          <div className="govbb-date-input">
            {parts.map(({ label, part, partId, props, year }) => (
              <div className="govbb-date-input__part" key={partId}>
                <label className="govbb-label" htmlFor={partId}>
                  {label}
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  name={name != null ? `${name}-${part}` : undefined}
                  {...(value !== undefined && {
                    value: value[part],
                    onChange: (event: ChangeEvent<HTMLInputElement>) =>
                      onChange?.({
                        ...value,
                        [part]: event.currentTarget.value,
                      }),
                  })}
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
      </FormGroup>
    );
  },
);
