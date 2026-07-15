import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes } from 'react';

const statusBanner = cva('govbb-status-banner', {
  variants: {
    variant: {
      alpha: 'govbb-status-banner--alpha',
      beta: 'govbb-status-banner--beta',
      migrated: 'govbb-status-banner--migrated',
      service: 'govbb-status-banner--service',
    },
    rounded: { true: 'govbb-status-banner--rounded' },
    fullWidth: { true: 'govbb-status-banner--full-width' },
  },
});

export interface StatusBannerProps
  extends
    HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof statusBanner>, 'variant'>,
    Required<Pick<VariantProps<typeof statusBanner>, 'variant'>> {}

export const StatusBanner = forwardRef<HTMLDivElement, StatusBannerProps>(
  function StatusBanner(
    { variant, rounded, fullWidth, className, children, ...props },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={statusBanner({ variant, rounded, fullWidth, className })}
        {...props}
      >
        {fullWidth ? (
          // Page-level shape: full-bleed background, content aligned to the
          // page column — same structure as the official banner.
          <div className="govbb-width-container govbb-status-banner__inner">
            {children}
          </div>
        ) : (
          children
        )}
      </div>
    );
  },
);
