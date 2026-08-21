import { cx } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Heading } from '../typography/typography';

type HeadingLevel = 'h1' | 'h2';

export interface ServiceHeadingProps extends HTMLAttributes<HTMLDivElement> {
  /** Service the page belongs to, shown above the heading with a quiet rule. */
  service?: ReactNode;
  /** The heading itself — on a question page, the question. */
  children: ReactNode;
  /** Supporting detail under the heading. Keep it to a line or two. */
  description?: ReactNode;
  /** Heading element. A page's question is its `h1`. */
  as?: HeadingLevel;
  /** Visual size on the type scale, when it should differ from `as`. */
  size?: 'display' | HeadingLevel;
}

/**
 * Opens a form page: service name, question, optional supporting line. The
 * service name is a paragraph, not a heading, so it stays out of the document
 * outline — the question is the page's only top-level heading.
 */
export const ServiceHeading = forwardRef<HTMLDivElement, ServiceHeadingProps>(
  function ServiceHeading(
    { service, description, as = 'h1', size, className, children, ...props },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cx('govbb-service-heading', className)}
        {...props}
      >
        {service != null && (
          <p className="govbb-service-heading__service">{service}</p>
        )}
        <Heading as={as} size={size}>
          {children}
        </Heading>
        {description != null && (
          <p className="govbb-service-heading__description">{description}</p>
        )}
      </div>
    );
  },
);
