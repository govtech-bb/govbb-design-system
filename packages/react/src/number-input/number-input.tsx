import { cx } from 'class-variance-authority';
import {
  forwardRef,
  useState,
  useImperativeHandle,
  useRef,
  type InputHTMLAttributes,
  type InputEvent,
} from 'react';

export interface NumberInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type'
> {
  /** id of the field's <Label>, announced for the whole group. */
  labelId?: string;
}

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
      labelId,
      className,
      value,
      defaultValue,
      min,
      max,
      disabled,
      readOnly,
      onInput,
      ...props
    },
    ref,
  ) {
    const inputRef = useRef<HTMLInputElement>(null);
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
    return (
      <div
        className="govbb-number-input-wrapper"
        role="group"
        aria-labelledby={labelId}
      >
        <input
          className={cx('govbb-number-input', className)}
          ref={inputRef}
          value={value}
          defaultValue={defaultValue}
          min={min}
          max={max}
          disabled={disabled}
          readOnly={readOnly}
          onInput={handleInput}
          {...props}
          type="number"
        />
        <div className="govbb-number-input__steppers">
          <button
            className="govbb-number-input__step"
            type="button"
            tabIndex={-1}
            aria-label="Increment"
            aria-controls={props.id}
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
            aria-controls={props.id}
            disabled={unavailable || atMin}
            onClick={() => step(-1)}
          ></button>
        </div>
      </div>
    );
  },
);
