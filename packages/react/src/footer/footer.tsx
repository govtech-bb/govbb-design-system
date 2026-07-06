import { cx } from 'class-variance-authority';
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

export interface FooterProps extends HTMLAttributes<HTMLElement> {
  /** Coat-of-arms image URL — the consumer hosts the asset. */
  coatSrc?: string;
  /** Copyright line, e.g. "© 2026 Government of Barbados". */
  copy?: ReactNode;
  /** Nav content — use <FooterLink /> for each entry. */
  children?: ReactNode;
}

export const Footer = forwardRef<HTMLElement, FooterProps>(function Footer(
  { coatSrc, copy, className, children, ...props },
  ref,
) {
  return (
    <footer ref={ref} className={cx('govbb-footer', className)} {...props}>
      <div className="govbb-width-container govbb-footer__inner">
        <nav className="govbb-footer__nav" aria-label="Footer navigation">
          {children}
        </nav>
        <hr className="govbb-footer__divider" aria-hidden="true" />
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

export interface FooterLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {}

export const FooterLink = forwardRef<HTMLAnchorElement, FooterLinkProps>(
  function FooterLink({ className, ...props }, ref) {
    return (
      <a ref={ref} className={cx('govbb-footer__link', className)} {...props} />
    );
  },
);
