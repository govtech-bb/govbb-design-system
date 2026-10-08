import { cx } from 'class-variance-authority';
import {
  forwardRef,
  useId,
  type ReactNode,
  type TableHTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from 'react';

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  /** Rendered as the <caption>; always describe what the table shows. */
  caption?: ReactNode;
  /**
   * Wide tables: wraps the table in the govbb-table-container scroll region
   * (tabindex 0 + role region) so keyboard users can reach and scroll it.
   * Labelled by `scrollLabel`, falling back to the `caption` element.
   */
  scrollable?: boolean;
  /** Accessible name for the scroll region; defaults to the caption. */
  scrollLabel?: string;
}

/**
 * Compose the body with native <thead>/<tbody>/<tr> and the TableHeader /
 * TableCell primitives. Wide tables: set `scrollable` so they scroll on
 * small screens without trapping keyboard users.
 */
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  { caption, scrollable, scrollLabel, className, children, ...props },
  ref,
) {
  const captionId = useId();
  // The scroll region borrows the caption element as its accessible name
  // unless a dedicated scrollLabel is given.
  const labelledBy =
    scrollable && scrollLabel == null && caption != null
      ? captionId
      : undefined;
  const table = (
    <table ref={ref} className={cx('govbb-table', className)} {...props}>
      {caption != null && (
        <caption id={labelledBy} className="govbb-table__caption">
          {caption}
        </caption>
      )}
      {children}
    </table>
  );
  if (!scrollable) return table;
  return (
    <div
      className="govbb-table-container"
      tabIndex={0}
      role="region"
      aria-label={scrollLabel}
      aria-labelledby={labelledBy}
    >
      {table}
    </div>
  );
});

export interface TableHeaderProps extends ThHTMLAttributes<HTMLTableCellElement> {
  /** Right-aligns the column and uses tabular figures. */
  numeric?: boolean;
}

export const TableHeader = forwardRef<HTMLTableCellElement, TableHeaderProps>(
  function TableHeader({ numeric, className, ...props }, ref) {
    return (
      <th
        ref={ref}
        className={cx(
          'govbb-table__header',
          numeric && 'govbb-table__header--numeric',
          className,
        )}
        {...props}
      />
    );
  },
);

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  /** Right-aligns the cell and uses tabular figures. */
  numeric?: boolean;
}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  function TableCell({ numeric, className, ...props }, ref) {
    return (
      <td
        ref={ref}
        className={cx(
          'govbb-table__cell',
          numeric && 'govbb-table__cell--numeric',
          className,
        )}
        {...props}
      />
    );
  },
);
