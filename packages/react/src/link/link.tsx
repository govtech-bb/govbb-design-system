import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type AnchorHTMLAttributes } from 'react';

const link = cva('govbb-link', {
  variants: {
    /** Underline on hover only. */
    noUnderline: { true: 'govbb-link--no-underline' },
    /** Keep the unvisited colour after visiting. */
    noVisited: { true: 'govbb-link--no-visited' },
  },
});

export interface LinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement>, VariantProps<typeof link> {}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { noUnderline, noVisited, className, ...props },
  ref,
) {
  return (
    <a
      ref={ref}
      className={link({ noUnderline, noVisited, className })}
      {...props}
    />
  );
});
