import { cx } from 'class-variance-authority';
import {
  Children,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useId,
  useState,
  useSyncExternalStore,
} from 'react';
import { Button } from '../button/button';
import type { LinkComponent } from '../link/link';

// Never-updating store: useSyncExternalStore reads false on the server and
// true after hydration, which is the whole "is JS running" signal.
const noopSubscribe = () => () => {};

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  /** Logo image URL — the consumer hosts the asset. */
  logoSrc: string;
  logoAlt?: string;
  homeHref?: string;
  /** Render the logo's home link with an href-compatible router component. */
  linkComponent?: LinkComponent;
  /** Consumer-owned navigation content: visible on desktop, disclosed on mobile. */
  nav?: ReactNode;
  /** Accessible name for the nav landmark. */
  navAriaLabel?: string;
  /** Label shown by the menu control when the navigation is collapsed. */
  menuLabel?: ReactNode;
  /** Label shown by the menu control when the navigation is expanded. */
  closeMenuLabel?: ReactNode;
  /** Optional consumer-owned content in the header's top row. */
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
    menuLabel = 'Menu',
    closeMenuLabel = menuLabel,
    className,
    children,
    ...props
  },
  ref,
) {
  const navId = useId();
  const navigation = Children.toArray(nav);
  const content = Children.toArray(children);
  const hasNavigation = navigation.length > 0;
  const hasContent = content.length > 0;
  const [expanded, setExpanded] = useState(false);
  // The Menu toggle is a JS enhancement (same as the frontend header module):
  // it renders [hidden] with the nav open, so pages without JS keep their
  // navigation. Once hydrated, CSS collapses the nav only at mobile widths.
  const enhanced = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  return (
    <header
      ref={ref}
      className={cx('govbb-header', className)}
      data-govbb-header-enhanced={enhanced || undefined}
      {...props}
    >
      <div className="govbb-width-container govbb-header__inner">
        <HomeLink className="govbb-header__home" href={homeHref}>
          <img className="govbb-header__logo" src={logoSrc} alt={logoAlt} />
        </HomeLink>
        {hasContent || hasNavigation ? (
          <div className="govbb-header__controls">
            {content}
            {hasNavigation ? (
              <Button
                className="govbb-header__toggle"
                variant="text"
                type="button"
                hidden={!enhanced}
                aria-expanded={expanded}
                aria-controls={navId}
                onClick={() => setExpanded((open) => !open)}
              >
                {expanded ? closeMenuLabel : menuLabel}
              </Button>
            ) : null}
          </div>
        ) : null}
        {hasNavigation ? (
          <nav
            id={navId}
            className="govbb-header__nav"
            aria-label={navAriaLabel}
            data-expanded={expanded}
          >
            <div className="govbb-header__nav-inner">{navigation}</div>
          </nav>
        ) : null}
      </div>
    </header>
  );
});
