import { cx } from 'class-variance-authority';
import { forwardRef, type SelectHTMLAttributes } from 'react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ className, ...props }, ref) {
    return (
      <select ref={ref} className={cx('govbb-select', className)} {...props} />
    );
  },
);
