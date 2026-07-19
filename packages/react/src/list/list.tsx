import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes } from 'react';

const list = cva('govbb-list', {
  variants: {
    variant: {
      plain: '',
      bullet: 'govbb-list--bullet',
      number: 'govbb-list--number',
    },
  },
  defaultVariants: { variant: 'plain' },
});

export interface ListProps
  extends
    HTMLAttributes<HTMLUListElement | HTMLOListElement>,
    VariantProps<typeof list> {}

export const List = forwardRef<HTMLUListElement | HTMLOListElement, ListProps>(
  function List({ variant, className, ...props }, ref) {
    const Tag = variant === 'number' ? 'ol' : 'ul';
    return (
      <Tag
        // one ref type per tag at runtime; the union confuses JSX's per-tag props
        ref={ref as never}
        className={list({ variant, className })}
        role={variant == null || variant === 'plain' ? 'list' : undefined}
        {...props}
      />
    );
  },
);
