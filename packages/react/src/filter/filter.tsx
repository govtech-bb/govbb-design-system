import { cx } from 'class-variance-authority';
import {
  forwardRef,
  type DetailsHTMLAttributes,
  type FormHTMLAttributes,
  type ReactNode,
} from 'react';
import { Button } from '../button/button';
import { has } from '../form/form';

export interface FilterProps extends DetailsHTMLAttributes<HTMLDetailsElement> {
  /** Toggle text. Empty falls back to "Filter". */
  summary?: ReactNode;
  /** Submit button text. Empty falls back to "Apply". */
  applyLabel?: ReactNode;
  /** Reaches the panel's <form> (action, method, onSubmit, …). Its content is
      the Filter's children. */
  formProps?: Omit<FormHTMLAttributes<HTMLFormElement>, 'children'>;
  /** The filter groups. */
  children?: ReactNode;
}

/** Ref goes to the <details>. */
export const Filter = forwardRef<HTMLDetailsElement, FilterProps>(
  function Filter(
    { summary, applyLabel, formProps, onToggle, className, children, ...props },
    ref,
  ) {
    return (
      <details
        ref={ref}
        className={cx('govbb-filter', className)}
        // React bubbles toggle from the nested groups; report only our own.
        onToggle={(e) => {
          if (e.target === e.currentTarget) onToggle?.(e);
        }}
        {...props}
      >
        <summary className="govbb-button govbb-button--ghost govbb-filter__summary">
          {has(summary) ? summary : 'Filter'}
        </summary>
        <form
          {...formProps}
          className={cx('govbb-filter__panel', formProps?.className)}
        >
          {children}
          <Button type="submit">
            {has(applyLabel) ? applyLabel : 'Apply'}
          </Button>
        </form>
      </details>
    );
  },
);
