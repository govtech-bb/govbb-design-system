import { cx } from 'class-variance-authority';
import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type InputHTMLAttributes,
} from 'react';

export interface NumberInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** id of the field's <Label>, announced for the whole group. */
  labelId?: string;
}

/** Ref goes to the <input>, not the wrapping group div. */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  function NumberInput({ labelId, className, ...props }, ref) {
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current!, []);
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
          type="number"
          {...props}
        />
        <div className="govbb-number-input__steppers">
          <button
            className="govbb-number-input__step"
            type="button"
            tabIndex={-1}
            aria-label="Increment"
            aria-controls={props.id}
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
            onClick={() => step(-1)}
          ></button>
        </div>
      </div>
    );
  },
);
