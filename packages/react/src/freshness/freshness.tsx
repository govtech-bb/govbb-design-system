import { cx } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

export interface FreshnessProps extends HTMLAttributes<HTMLParagraphElement> {
  /** The full line, e.g. "Last updated on" and a <time> element. */
  children: ReactNode;
}

/**
 * The "last updated" line under a content page's heading. The wording and the
 * date format stay with the consumer, so pass the whole line as children.
 */
export const Freshness = forwardRef<HTMLParagraphElement, FreshnessProps>(
  function Freshness({ className, children, ...props }, ref) {
    return (
      <p ref={ref} className={cx('govbb-freshness', className)} {...props}>
        {children}
      </p>
    );
  },
);
