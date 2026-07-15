import { cx } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import type { LinkComponent } from '../link/link';

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  /** Logo image URL — the consumer hosts the asset. */
  logoSrc: string;
  logoAlt?: string;
  homeHref?: string;
  /** Render the home link with a router link component (SPA navigation). */
  linkComponent?: LinkComponent;
  /** Nav links (e.g. <Link>s) — stacked panel on phones, inline from tablet. */
  nav?: ReactNode;
  /** Accessible name for the nav landmark. */
  navAriaLabel?: string;
  /** Extra header content (e.g. a borderless <Search />). */
  children?: ReactNode;
}

export const Header = forwardRef<HTMLElement, HeaderProps>(function Header(
  {
    logoSrc,
    logoAlt = 'gov.bb',
    homeHref = '/',
    linkComponent: HomeLink = 'a',
    nav,
    navAriaLabel = 'Menu',
    className,
    children,
    ...props
  },
  ref,
) {
  return (
    <header ref={ref} className={cx('govbb-header', className)} {...props}>
      <div className="govbb-width-container govbb-header__inner">
        <HomeLink href={homeHref}>
          <img className="govbb-header__logo" src={logoSrc} alt={logoAlt} />
        </HomeLink>
        {children}
        {nav && (
          <nav className="govbb-header__nav" aria-label={navAriaLabel}>
            {nav}
          </nav>
        )}
      </div>
    </header>
  );
});
