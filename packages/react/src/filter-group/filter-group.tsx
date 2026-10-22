import { cx } from 'class-variance-authority';
import {
  forwardRef,
  useId,
  type DetailsHTMLAttributes,
  type ReactNode,
} from 'react';

export interface FilterGroupProps extends DetailsHTMLAttributes<HTMLDetailsElement> {
  /** Group name, shown in the summary and announced with each option. */
  label: ReactNode;
  /** The options, usually Checkboxes. */
  children?: ReactNode;
}

/** Ref goes to the <details>. */
export const FilterGroup = forwardRef<HTMLDetailsElement, FilterGroupProps>(
  function FilterGroup({ label, className, children, ...props }, ref) {
    const labelId = useId();
    return (
      <details
        ref={ref}
        className={cx('govbb-filter-group', className)}
        {...props}
      >
        <summary className="govbb-filter-group__summary" id={labelId}>
          {label}
        </summary>
        <div
          className="govbb-filter-group__options"
          role="group"
          aria-labelledby={labelId}
        >
          {children}
        </div>
      </details>
    );
  },
);
