import { cva, cx, type VariantProps } from 'class-variance-authority';
import {
  forwardRef,
  type ReactNode,
  type TableHTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from 'react';

/*
 * Table styling wrappers — Table, TableHeader (th) and TableCell (td). Rows,
 * thead and tbody are plain HTML; only the elements that carry govbb classes
 * get a wrapper.
 */

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  /** Rendered as the table's <caption>. */
  caption?: ReactNode;
}

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

const header = cva('govbb-table__header', {
  variants: {
    /** Right-align so digits line up down the column. */
    numeric: { true: 'govbb-table__header--numeric' },
  },
});

export interface TableHeaderProps
  extends ThHTMLAttributes<HTMLTableCellElement>, VariantProps<typeof header> {}

export const TableHeader = forwardRef<HTMLTableCellElement, TableHeaderProps>(
  function TableHeader({ numeric, className, ...props }, ref) {
    return (
      <th ref={ref} className={header({ numeric, className })} {...props} />
    );
  },
);

const cell = cva('govbb-table__cell', {
  variants: {
    /** Right-align so digits line up down the column. */
    numeric: { true: 'govbb-table__cell--numeric' },
  },
});

export interface TableCellProps
  extends TdHTMLAttributes<HTMLTableCellElement>, VariantProps<typeof cell> {}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  function TableCell({ numeric, className, ...props }, ref) {
    return <td ref={ref} className={cell({ numeric, className })} {...props} />;
  },
);
