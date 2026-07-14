import { cx } from 'class-variance-authority';
import {
  forwardRef,
  type ReactNode,
  type TableHTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from 'react';

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  /** Rendered as the <caption>; always describe what the table shows. */
  caption?: ReactNode;
}

/**
 * Compose the body with native <thead>/<tbody>/<tr> and the TableHeader /
 * TableCell primitives. Wide tables: wrap in <div class="govbb-table-container"
 * tabindex="0" role="region" aria-label="…"> so they scroll on small screens.
 */
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  { caption, className, children, ...props },
  ref,
) {
  return (
    <table ref={ref} className={cx('govbb-table', className)} {...props}>
      {caption != null && (
        <caption className="govbb-table__caption">{caption}</caption>
      )}
      {children}
    </table>
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
