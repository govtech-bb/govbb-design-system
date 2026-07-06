import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes } from 'react';

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
