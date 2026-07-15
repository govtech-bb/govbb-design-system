import { cva, cx, type VariantProps } from 'class-variance-authority';
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import type { LinkComponent } from '../link/link';

const serviceList = cva('govbb-service-list', {
  variants: {
    variant: {
      /** Category listing: big bold green names (Figma "Service"). */
      card: '',
      /** In-category service links: quiet teal body links (Figma
          "Signpost block"). */
      signpost: 'govbb-service-list--signpost',
    },
  },
  defaultVariants: { variant: 'card' },
});

export interface ServiceListProps
  extends HTMLAttributes<HTMLUListElement>, VariantProps<typeof serviceList> {}

/**
 * Navigational list of services, categories or topics — use
 * <ServiceListItem /> for each entry.
 */
export const ServiceList = forwardRef<HTMLUListElement, ServiceListProps>(
  function ServiceList({ variant, className, ...props }, ref) {
    return (
      <ul
        ref={ref}
        className={serviceList({ variant, className })}
        {...props}
      />
    );
  },
);

export interface ServiceListItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  /** Supporting line under the service name. */
  description?: ReactNode;
  /** Category tag, e.g. "Digital service" or "Information service". */
  tag?: ReactNode;
  /** Heading element wrapping the link — pick for document structure. */
  headingLevel?: 'h2' | 'h3' | 'h4';
  /** Swap the underlying `<a>` for a router link component. */
  linkComponent?: LinkComponent;
}

/**
 * One service list entry — a whole-card click target (GOV.UK cards pattern):
 * the heading holds the only link, whose stretched ::after covers the padded
 * __wrapper, so the description stays plain text and the accessible name stays
 * the service name. Anchor attributes (and `className`) land on the link; the
 * ref does too.
 */
export const ServiceListItem = forwardRef<
  HTMLAnchorElement,
  ServiceListItemProps
>(function ServiceListItem(
  {
    description,
    tag,
    headingLevel: HeadingTag = 'h3',
    linkComponent = 'a',
    className,
    children,
    ...props
  },
  ref,
) {
  // Widened so the optional `href` from AnchorHTMLAttributes can spread.
  const Anchor: ElementType = linkComponent;
  return (
    <li className="govbb-service-list__item">
      <div className="govbb-service-list__wrapper">
        <HeadingTag className="govbb-service-list__heading">
          <Anchor
            ref={ref}
            className={cx('govbb-link govbb-service-list__link', className)}
            {...props}
          >
            {children}
          </Anchor>
        </HeadingTag>
        {description != null && (
          <p className="govbb-service-list__description">{description}</p>
        )}
        {tag != null && <p className="govbb-service-list__tag">{tag}</p>}
      </div>
    </li>
  );
});
