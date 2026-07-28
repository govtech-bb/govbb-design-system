import { cx } from 'class-variance-authority';
import {
  Children,
  forwardRef,
  type AnchorHTMLAttributes,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import type { LinkComponent } from '../link/link';
import {
  resolveExternalLinkProps,
  type ExternalLinkOptions,
} from '../link/external';

export interface FooterLinkItem
  extends
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'href'>,
    ExternalLinkOptions {
  href: string;
  label: ReactNode;
}

export type FooterLinkRenderProps = Omit<
  FooterLinkItem,
  'external' | 'label'
> & {
  children: ReactNode;
};

export type FooterLinkRenderer = (props: FooterLinkRenderProps) => ReactNode;

export interface FooterProps extends HTMLAttributes<HTMLElement> {
  /** Coat-of-arms image URL — the consumer hosts the asset. */
  coatSrc?: string;
  /** Copyright line, e.g. "© 2026 Government of Barbados". */
  copy?: ReactNode;
  /** Standard footer links. This is the preferred navigation API. */
  links?: readonly FooterLinkItem[];
  /** Render standard links with an href-compatible router component. */
  linkComponent?: LinkComponent;
  /**
   * Render a standard link with a router or framework-specific component.
   * Receives the href, label as children, and all GovBB classes/attributes.
   * Takes precedence over linkComponent.
   */
  renderLink?: FooterLinkRenderer;
  /** Accessible name for the navigation landmark. */
  navAriaLabel?: string;
  /** Additional custom navigation links. Prefer links for standard entries. */
  children?: ReactNode;
}

export const Footer = forwardRef<HTMLElement, FooterProps>(function Footer(
  {
    coatSrc,
    copy,
    links = [],
    linkComponent,
    renderLink,
    navAriaLabel = 'Footer navigation',
    className,
    children,
    ...props
  },
  ref,
) {
  const customLinks = Children.toArray(children);
  const hasNavigation = links.length > 0 || customLinks.length > 0;

  return (
    <footer ref={ref} className={cx('govbb-footer', className)} {...props}>
      <div className="govbb-width-container govbb-footer__inner">
        {hasNavigation ? (
          <nav className="govbb-footer__nav" aria-label={navAriaLabel}>
            <ul className="govbb-footer__list">
              {links.map(
                ({
                  label,
                  className: linkClassName,
                  external,
                  rel,
                  target,
                  ...link
                }) => {
                  const externalProps = resolveExternalLinkProps({
                    external,
                    rel,
                    target,
                  });
                  const renderProps: FooterLinkRenderProps = {
                    ...link,
                    ...externalProps,
                    className: cx(
                      'govbb-link govbb-footer__link',
                      linkClassName,
                    ),
                    children: label,
                  };
                  return (
                    <li className="govbb-footer__item" key={link.href}>
                      {renderLink != null ? (
                        renderLink(renderProps)
                      ) : (
                        <FooterLink
                          {...link}
                          className={linkClassName}
                          external={external}
                          linkComponent={linkComponent}
                          rel={rel}
                          target={target}
                        >
                          {label}
                        </FooterLink>
                      )}
                    </li>
                  );
                },
              )}
              {Children.map(customLinks, (child) => (
                <li className="govbb-footer__item">{child}</li>
              ))}
            </ul>
          </nav>
        ) : null}
        {hasNavigation ? (
          <hr className="govbb-footer__divider" aria-hidden="true" />
        ) : null}
        <div className="govbb-footer__end">
          {coatSrc != null && (
            <img className="govbb-footer__coat" src={coatSrc} alt="" />
          )}
          {copy != null && <p className="govbb-footer__copy">{copy}</p>}
        </div>
      </div>
    </footer>
  );
});

export interface FooterLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement>, ExternalLinkOptions {
  /** Swap the underlying `<a>` for a router link component. */
  linkComponent?: LinkComponent;
}

export const FooterLink = forwardRef<HTMLAnchorElement, FooterLinkProps>(
  function FooterLink(
    { external, linkComponent = 'a', className, rel, target, ...props },
    ref,
  ) {
    // Widened so the optional `href` from AnchorHTMLAttributes can spread.
    const Anchor: ElementType = linkComponent;
    const externalProps = resolveExternalLinkProps({
      external,
      rel,
      target,
    });
    return (
      <Anchor
        ref={ref}
        className={cx('govbb-link govbb-footer__link', className)}
        {...externalProps}
        {...props}
      />
    );
  },
);
