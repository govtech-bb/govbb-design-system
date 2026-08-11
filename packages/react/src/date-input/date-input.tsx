import { cx } from 'class-variance-authority';
import {
  forwardRef,
  useId,
  type ChangeEvent,
  type ComponentPropsWithRef,
  type FieldsetHTMLAttributes,
  type ReactNode,
} from 'react';
import { FormGroup } from '../form/form';
import type { FieldFeedback } from '../form/field';

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

export type DateInputProps = Omit<
  FieldsetHTMLAttributes<HTMLFieldSetElement>,
  'name' | 'onChange'
> & {
  legend: ReactNode;
  name?: string;
  value?: DateInputValue;
  onChange?: (value: DateInputValue) => void;
  dayProps?: FieldProps;
  monthProps?: FieldProps;
  yearProps?: FieldProps;
} & FieldFeedback;

export const DateInput = forwardRef<HTMLFieldSetElement, DateInputProps>(
  function DateInput(
    {
      legend,
      description,
      error,
      name,
      value,
      onChange,
      dayProps,
      monthProps,
      yearProps,
      className,
      'aria-describedby': describedBy,
      ...props
    },
    ref,
  ) {
    const id = useId();
    const descriptionId = description != null ? `${id}-description` : undefined;
    const errorId = error != null ? `${id}-error` : undefined;
    const parts = [
      {
        label: 'Day',
        part: 'day' as const,
        partId: dayProps?.id ?? `${name ?? id}-day`,
        props: dayProps,
      },
      {
        label: 'Month',
        part: 'month' as const,
        partId: monthProps?.id ?? `${name ?? id}-month`,
        props: monthProps,
      },
      {
        label: 'Year',
        part: 'year' as const,
        partId: yearProps?.id ?? `${name ?? id}-year`,
        props: yearProps,
        year: true,
      },
    ];
    return (
      <FormGroup>
        <fieldset
          ref={ref}
          className={cx('govbb-fieldset', className)}
          role="group"
          aria-describedby={
            cx(descriptionId, errorId, describedBy) || undefined
          }
          {...props}
        >
          <legend className="govbb-fieldset__legend">{legend}</legend>
          {description != null && (
            <span className="govbb-hint" id={descriptionId}>
              {description}
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
                  aria-invalid={error != null ? true : props?.['aria-invalid']}
                />
              </div>
            ))}
          </div>
        </fieldset>
      </FormGroup>
    );
  },
);
