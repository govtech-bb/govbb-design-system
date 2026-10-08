import { cva, cx, type VariantProps } from 'class-variance-authority';
import {
  forwardRef,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import type { LinkComponent } from '../link/link';

const breadcrumbs = cva('govbb-breadcrumbs', {
  variants: {
    /** Show only the parent crumb on small screens. */
    collapseOnMobile: { true: 'govbb-breadcrumbs--collapse-on-mobile' },
  },
});

export interface BreadcrumbsProps
  extends HTMLAttributes<HTMLElement>, VariantProps<typeof breadcrumbs> {
  items: Array<{ href: string; label: ReactNode; current?: boolean }>;
  /** Render each crumb with a router link component (SPA navigation). */
  linkComponent?: LinkComponent;
}

export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(
  function Breadcrumbs(
    { items, collapseOnMobile, linkComponent = 'a', className, ...props },
    ref,
  ) {
    const Crumb: ElementType = linkComponent;
    return (
      <nav
        ref={ref}
        className={breadcrumbs({ collapseOnMobile, className })}
        aria-label="Breadcrumb"
        {...props}
      >
        <ol className="govbb-breadcrumbs__list">
          {items.map(({ href, label, current }) => (
            <li className="govbb-breadcrumbs__item" key={href}>
              <Crumb
                className={cx('govbb-link', 'govbb-breadcrumbs__link')}
                href={href}
                aria-current={current ? 'page' : undefined}
              >
                {label}
              </Crumb>
            </li>
          ))}
        </ol>
      </nav>
    );
  },
);
