import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes } from 'react';

const buttonGroup = cva('govbb-button-group', {
  variants: {
    /** Stack the actions instead of laying them out in a row. */
    vertical: { true: 'govbb-button-group--vertical' },
  },
});

export interface ButtonGroupProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof buttonGroup> {}

export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  function ButtonGroup({ vertical, className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={buttonGroup({ vertical, className })}
        {...props}
      />
    );
  },
);
