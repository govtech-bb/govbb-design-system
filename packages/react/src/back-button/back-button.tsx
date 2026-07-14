import { cx } from 'class-variance-authority';
import { forwardRef, type AnchorHTMLAttributes } from 'react';

export interface BackButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {}

/**
 * Composes with the link component (govbb-link govbb-back-button) so the
 * arrow follows the link's colour on hover, active and focus. Point href at
 * the previous page in the journey so it works without JavaScript.
 */
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
