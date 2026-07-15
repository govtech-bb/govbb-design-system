import { cx } from 'class-variance-authority';
import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useEffect,
  useId,
  useState,
} from 'react';
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
  const navId = useId();
  const [expanded, setExpanded] = useState(false);
  // The Menu toggle is a JS enhancement (same as the frontend header module):
  // it renders [hidden] so server-rendered pages without JS keep the nav
  // panel open, and mounting reveals it in the collapsed state.
  const [enhanced, setEnhanced] = useState(false);
  useEffect(() => setEnhanced(true), []);
  return (
    <header ref={ref} className={cx('govbb-header', className)} {...props}>
      <div className="govbb-width-container govbb-header__inner">
        <HomeLink href={homeHref}>
          <img className="govbb-header__logo" src={logoSrc} alt={logoAlt} />
        </HomeLink>
        {children}
        {nav && (
          <>
            <button
              className="govbb-header__toggle"
              type="button"
              hidden={!enhanced}
              aria-expanded={expanded}
              aria-controls={navId}
              onClick={() => setExpanded((open) => !open)}
            >
              Menu
            </button>
            <nav
              id={navId}
              className="govbb-header__nav"
              aria-label={navAriaLabel}
            >
              {nav}
            </nav>
          </>
        )}
      </div>
    </header>
  );
});
