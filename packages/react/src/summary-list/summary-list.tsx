import { cx } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

export interface SummaryListProps extends HTMLAttributes<HTMLDListElement> {
  /** Key–value pairs, one row each. */
  rows: Array<{ key: ReactNode; value: ReactNode }>;
}

export const SummaryList = forwardRef<HTMLDListElement, SummaryListProps>(
  function SummaryList({ rows, className, ...props }, ref) {
    return (
      <dl ref={ref} className={cx('govbb-summary-list', className)} {...props}>
        {rows.map(({ key, value }, i) => (
          <div className="govbb-summary-list__row" key={i}>
            <dt className="govbb-summary-list__key">{key}</dt>
            <dd className="govbb-summary-list__value">{value}</dd>
          </div>
        ))}
      </dl>
    );
  },
);
