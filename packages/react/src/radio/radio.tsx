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
  { label, hint, conditional, id, className, ...props },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = hint != null ? `${inputId}-hint` : undefined;
  return (
    <>
      <div className="govbb-radio-item">
        <input
          ref={ref}
          className={cx('govbb-radio', className)}
          id={inputId}
          type="radio"
          aria-describedby={hintId}
          {...props}
        />
        <label className="govbb-radio-item__label" htmlFor={inputId}>
          {label}
        </label>
        {hint != null && (
          <div className="govbb-hint" id={hintId}>
            {hint}
          </div>
        )}
      </div>
      {conditional != null && (
        <div className="govbb-radio-item__conditional">{conditional}</div>
      )}
    </>
  );
});
