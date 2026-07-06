import { cx } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  /** Logo image URL — the consumer hosts the asset. */
  logoSrc: string;
  logoAlt?: string;
  homeHref?: string;
  /** Extra header content (e.g. a borderless <Search />). */
  children?: ReactNode;
}

export const Header = forwardRef<HTMLElement, HeaderProps>(function Header(
  {
    logoSrc,
    logoAlt = 'gov.bb',
    homeHref = '/',
    className,
    children,
    ...props
  },
  ref,
) {
  return (
    <header ref={ref} className={cx('govbb-header', className)} {...props}>
      <div className="govbb-width-container govbb-header__inner">
        <a href={homeHref}>
          <img className="govbb-header__logo" src={logoSrc} alt={logoAlt} />
        </a>
        {children}
      </div>
    </header>
  );
});
