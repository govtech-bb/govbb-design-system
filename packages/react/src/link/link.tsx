import { cva, type VariantProps } from 'class-variance-authority';
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ElementType,
  type ReactNode,
} from 'react';

const link = cva('govbb-link', {
  variants: {
    /** Underline on hover only. */
    noUnderline: { true: 'govbb-link--no-underline' },
    /** Keep the unvisited colour after visiting. */
    noVisited: { true: 'govbb-link--no-visited' },
  },
});

/**
 * Anything that renders like an anchor — `'a'` (the default) or a client-side
 * router link (e.g. Next's `Link`, or a TanStack Router `createLink()`
 * component) so navigation stays in the SPA instead of a full page load. Must
 * accept `href`, `className` and `children`; routers whose link takes `to`
 * need a small `href`→`to` adapter component.
 */
export type LinkComponent = ElementType<{
  href: string;
  className?: string;
  children?: ReactNode;
}>;

export interface LinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement>, VariantProps<typeof link> {
  /** Swap the underlying `<a>` for a router link component. */
  linkComponent?: LinkComponent;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { noUnderline, noVisited, linkComponent = 'a', className, ...props },
  ref,
) {
  // Widened so the optional `href` from AnchorHTMLAttributes can spread.
  const Anchor: ElementType = linkComponent;
  return (
    <Anchor
      ref={ref}
      className={link({ noUnderline, noVisited, className })}
      {...props}
    />
  );
});
