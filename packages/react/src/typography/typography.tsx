import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes } from 'react';

/*
 * Heading and Text put the govbb-text-* type-scale utilities (utilities.css in
 * @govtech-bb/frontend) on elements. Element and size are deliberately
 * independent, mirroring the typography guidance: choose `as` for the document
 * outline and `size` for how it looks on the page.
 */
const heading = cva('', {
  variants: {
    size: {
      display: 'govbb-text-display',
      h1: 'govbb-text-h1',
      h2: 'govbb-text-h2',
      h3: 'govbb-text-h3',
      h4: 'govbb-text-h4',
    },
  },
});

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4';

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Heading element — pick for document structure, never for looks. */
  as?: HeadingLevel;
  /** Visual size on the type scale. Defaults to matching `as`. */
  size?: 'display' | HeadingLevel;
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  function Heading({ as: As = 'h2', size, className, ...props }, ref) {
    return (
      <As
        ref={ref}
        className={heading({ size: size ?? As, className })}
        {...props}
      />
    );
  },
);

const text = cva('', {
  variants: {
    size: {
      'body-lg': 'govbb-text-body-lg',
      body: 'govbb-text-body',
      'body-sm': 'govbb-text-body-sm',
    },
    /** Visual bolding only — where the emphasis is semantic, use <strong>. */
    weight: {
      regular: '',
      bold: 'govbb-text-bold',
    },
  },
  defaultVariants: { size: 'body', weight: 'regular' },
});

export interface TextProps
  extends HTMLAttributes<HTMLElement>, VariantProps<typeof text> {
  /** Rendered element. */
  as?: 'p' | 'span' | 'div';
}

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { as: As = 'p', size, weight, className, ...props },
  ref,
) {
  return (
    <As
      // p/span/div refs all narrow to HTMLElement, but the element union
      // defeats JSX's per-element ref typing, so cast once here.
      ref={ref as never}
      className={text({ size, weight, className })}
      {...props}
    />
  );
});
