import { cx } from 'class-variance-authority';
import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Rendered in the item's label, wired to the input via htmlFor. */
  label: ReactNode;
}

/** Ref goes to the <input>, not the wrapping item div. */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox({ label, id, className, ...props }, ref) {
    const autoId = useId();
    const inputId = id ?? autoId;
    return (
      <div className="govbb-checkbox-item">
        <input
          ref={ref}
          className={cx('govbb-checkbox', className)}
          id={inputId}
          type="checkbox"
          {...props}
        />
        <label className="govbb-checkbox-item__label" htmlFor={inputId}>
          {label}
        </label>
      </div>
    );
  },
);
