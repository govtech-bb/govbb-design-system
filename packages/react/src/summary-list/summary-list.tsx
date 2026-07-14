import { cx } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

export interface SummaryListRow {
  key: ReactNode;
  value: ReactNode;
}

export interface SummaryListProps extends HTMLAttributes<HTMLDListElement> {
  rows: SummaryListRow[];
}

export const SummaryList = forwardRef<HTMLDListElement, SummaryListProps>(
  function SummaryList({ rows, className, ...props }, ref) {
    return (
      <dl ref={ref} className={cx('govbb-summary-list', className)} {...props}>
        {rows.map((row, index) => (
          <div className="govbb-summary-list__row" key={index}>
            <dt className="govbb-summary-list__key">{row.key}</dt>
            <dd className="govbb-summary-list__value">{row.value}</dd>
          </div>
        ))}
      </dl>
    );
  },
);
