import { cx } from 'class-variance-authority';
import {
  forwardRef,
  useId,
  type DetailsHTMLAttributes,
  type ReactNode,
} from 'react';

export interface FilterGroupProps extends Omit<
  DetailsHTMLAttributes<HTMLDetailsElement>,
  'name'
> {
  /** Group name, shown in the summary and announced with each option. Must
      not be empty: it is the only name the summary and the group have. The
      type rejects null and booleans; it cannot reject an empty string. */
  label: Exclude<ReactNode, null | undefined | boolean>;
  /** Lands on the summary, which names the options group. Generated if
      omitted. */
  id?: string;
  /** The options, usually Checkboxes. */
  children?: ReactNode;
}

/** Ref goes to the <details>. */
export const FilterGroup = forwardRef<HTMLDetailsElement, FilterGroupProps>(
  function FilterGroup({ label, id, className, children, ...props }, ref) {
    const generatedId = useId();
    const labelId = id || generatedId;
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
