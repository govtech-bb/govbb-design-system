import { cx } from 'class-variance-authority';
import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

export interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Rendered in the item's label, wired to the input via htmlFor. */
  label: ReactNode;
  /**
   * Revealed below the item while this radio is checked (pure CSS, via
   * :has() on the sibling). Rendered even when hidden — keep it light.
   */
  conditional?: ReactNode;
}

/** Ref goes to the <input>, not the wrapping item div. */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, conditional, id, className, ...props },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <>
      <div className="govbb-radio-item">
        <input
          ref={ref}
          className={cx('govbb-radio', className)}
          id={inputId}
          type="radio"
          {...props}
        />
        <label className="govbb-radio-item__label" htmlFor={inputId}>
          {label}
        </label>
      </div>
      {conditional != null && (
        <div className="govbb-radio-item__conditional">{conditional}</div>
      )}
    </>
  );
});
