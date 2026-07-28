import { cva, type VariantProps } from 'class-variance-authority';
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ElementType,
} from 'react';
import type { LinkComponent } from '../link/link';
import {
  resolveExternalLinkProps,
  type ExternalLinkOptions,
} from '../link/external';

/*
 * cva maps props to the govbb-button classes; the CSS owns how they look. This
 * is the shape every wrapper in the package follows. Import the stylesheet once
 * at the app root.
 */
const button = cva('govbb-button', {
  variants: {
    variant: {
      primary: '',
      secondary: 'govbb-button--secondary',
      tertiary: 'govbb-button--tertiary',
      text: 'govbb-button--text',
    },
    /** Danger variant (primary and text only). */
    negative: { true: 'govbb-button--negative' },
    /** For placing on dark backgrounds. */
    inverse: { true: 'govbb-button--inverse' },
  },
  defaultVariants: { variant: 'primary' },
});

export interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant, negative, inverse, type = 'button', className, ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={button({ variant, negative, inverse, className })}
        {...props}
      />
    );
  },
);

export interface LinkButtonProps
  extends
    AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof button>,
    ExternalLinkOptions {
  linkComponent?: LinkComponent;
}

/*
 * An <a> that looks like a Button — the GOV.UK "start button" pattern, for
 * navigation styled as a primary action. It stays a link (no role="button"):
 * it goes somewhere, it doesn't submit.
 */
export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  function LinkButton(
    {
      variant,
      negative,
      inverse,
      external,
      linkComponent = 'a',
      className,
      rel,
      target,
      ...props
    },
    ref,
  ) {
    const Anchor: ElementType = linkComponent;
    const externalProps = resolveExternalLinkProps({
      external,
      rel,
      target,
    });
    return (
      <Anchor
        ref={ref}
        className={button({ variant, negative, inverse, className })}
        {...externalProps}
        {...props}
      />
    );
  },
);
