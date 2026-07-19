import { cx } from 'class-variance-authority';
import { forwardRef, type AnchorHTMLAttributes } from 'react';

export interface SkipLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

export const SkipLink = forwardRef<HTMLAnchorElement, SkipLinkProps>(
  function SkipLink({ className, children, ...props }, ref) {
    return (
      <a ref={ref} className={cx('govbb-skip-link', className)} {...props}>
        {children ?? 'Skip to main content'}
      </a>
    );
  },
);
