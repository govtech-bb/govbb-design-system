import { cx } from 'class-variance-authority';
import {
  forwardRef,
  useState,
  useImperativeHandle,
  useRef,
  type InputHTMLAttributes,
  type InputEvent,
} from 'react';
import { FieldShell, useFieldIds, type FieldExtras } from '../form/field';

export type NumberInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type'
> &
  FieldExtras & {
    /** id of the field's <Label>, announced for the whole group. */
    labelId?: string;
  };

type NumericValue = string | number | readonly string[] | undefined;

function parseNumericValue(value: NumericValue) {
  if (value === undefined || value === '' || Array.isArray(value)) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

/** Ref goes to the <input>, not the wrapping group div. */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  function NumberInput(
    {
      label,
      hint,
      error,
      labelId,
      id,
      name,
      className,
      value,
      defaultValue,
      min,
      max,
      disabled,
      readOnly,
      onInput,
      'aria-describedby': describedBy,
      'aria-invalid': ariaInvalid,
      ...props
    },
    ref,
  ) {
    const inputRef = useRef<HTMLInputElement>(null);
    const ids = useFieldIds(
      id ?? name,
      hint != null && error == null,
      error != null,
    );
    const composed = label != null || hint != null || error != null;
    const inputId = composed ? ids.fieldId : (id ?? name);
    const resolvedLabelId =
      labelId ?? (label != null ? `${ids.fieldId}-label` : undefined);
    const [uncontrolledValue, setUncontrolledValue] =
      useState<NumericValue>(defaultValue);
    useImperativeHandle(ref, () => inputRef.current!, []);
    const currentValue = value === undefined ? uncontrolledValue : value;
    const numericValue = parseNumericValue(currentValue);
    const numericMin = parseNumericValue(min);
    const numericMax = parseNumericValue(max);
    const unavailable = disabled || readOnly;
    const atMin =
      numericValue !== null &&
      numericMin !== null &&
      numericValue <= numericMin;
    const atMax =
      numericValue !== null &&
      numericMax !== null &&
      numericValue >= numericMax;

    const handleInput = (event: InputEvent<HTMLInputElement>) => {
      if (value === undefined) setUncontrolledValue(event.currentTarget.value);
      onInput?.(event);
    };
    const step = (dir: 1 | -1) => {
      const el = inputRef.current;
      if (!el || el.disabled || el.readOnly) return;
      if (dir === 1) el.stepUp();
      else el.stepDown();
      // stepUp/stepDown bypass React's value tracking, so this synthetic input
      // event is not deduped and onChange fires with the new value. The change
      // event matches native steppers and the frontend PE runtime.
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    };
    const control = (
      <div
        className="govbb-number-input-wrapper"
        role="group"
        aria-labelledby={resolvedLabelId}
      >
        <input
          className={cx('govbb-number-input', className)}
          ref={inputRef}
          id={inputId}
          name={name}
          value={value}
          defaultValue={defaultValue}
          min={min}
          max={max}
          disabled={disabled}
          readOnly={readOnly}
          onInput={handleInput}
          aria-describedby={cx(ids.describedBy, describedBy) || undefined}
          aria-invalid={error != null ? true : ariaInvalid}
          {...props}
          type="number"
        />
        <div className="govbb-number-input__steppers">
          <button
            className="govbb-number-input__step"
            type="button"
            tabIndex={-1}
            aria-label="Increment"
            aria-controls={inputId}
            disabled={unavailable || atMax}
            onClick={() => step(1)}
          ></button>
          <span
            className="govbb-number-input__divider"
            aria-hidden="true"
          ></span>
          <button
            className="govbb-number-input__step govbb-number-input__step--down"
            type="button"
            tabIndex={-1}
            aria-label="Decrement"
            aria-controls={inputId}
            disabled={unavailable || atMin}
            onClick={() => step(-1)}
          ></button>
        </div>
      </div>
    );
    if (!composed) return control;
    return (
      <FieldShell {...{ label, hint, error, labelId: resolvedLabelId, ...ids }}>
        {control}
      </FieldShell>
    );
  },
);
