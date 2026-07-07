import { cx } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes } from 'react';

export interface PillProps extends HTMLAttributes<HTMLSpanElement> {}

export const Pill = forwardRef<HTMLSpanElement, PillProps>(function Pill(
  { className, ...props },
  ref,
) {
  return <span ref={ref} className={cx('govbb-pill', className)} {...props} />;
});
