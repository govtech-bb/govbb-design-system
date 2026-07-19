import { cx } from 'class-variance-authority';
import { forwardRef, type AnchorHTMLAttributes, type ElementType } from 'react';
import type { LinkComponent } from '../link/link';

export interface BackButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  linkComponent?: LinkComponent;
}

/**
 * Composes with the link component (govbb-link govbb-back-button) so the
 * arrow follows the link's colour on hover, active and focus. Point href at
 * the previous page in the journey so it works without JavaScript.
 */
export const BackButton = forwardRef<HTMLAnchorElement, BackButtonProps>(
  function BackButton(
    { linkComponent = 'a', className, children = 'Back', ...props },
    ref,
  ) {
    const Anchor: ElementType = linkComponent;
    return (
      <Anchor
        ref={ref}
        className={cx('govbb-link', 'govbb-back-button', className)}
        {...props}
      >
        {children}
      </Anchor>
    );
  },
);
