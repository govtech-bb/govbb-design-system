import { cx } from 'class-variance-authority';
import { forwardRef, type AnchorHTMLAttributes } from 'react';

export interface BackButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {}

export const BackButton = forwardRef<HTMLAnchorElement, BackButtonProps>(
  function BackButton({ className, children = 'Back', ...props }, ref) {
    return (
      <a
        ref={ref}
        className={cx('govbb-link', 'govbb-back-button', className)}
        {...props}
      >
        {children}
      </a>
    );
  },
);
