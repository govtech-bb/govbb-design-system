import { cx } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

export interface OfficialBannerProps extends HTMLAttributes<HTMLDivElement> {
  /** Coat-of-arms image URL — the consumer hosts the asset. */
  crestSrc: string;
  linkHref?: string;
  linkLabel?: ReactNode;
  children?: ReactNode;
}

export const OfficialBanner = forwardRef<HTMLDivElement, OfficialBannerProps>(
  function OfficialBanner(
    {
      crestSrc,
      linkHref,
      linkLabel = 'Learn more',
      children = 'Official government website',
      className,
      ...props
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cx('govbb-official-banner', className)}
        {...props}
      >
        <div className="govbb-width-container govbb-official-banner__inner">
          <div className="govbb-official-banner__crest">
            <img
              className="govbb-official-banner__icon"
              src={crestSrc}
              alt=""
            />
          </div>
          <div className="govbb-official-banner__text">
            <span>{children}</span>
            {linkHref != null && (
              <a className="govbb-official-banner__link" href={linkHref}>
                {linkLabel}
              </a>
            )}
          </div>
        </div>
      </div>
    );
  },
);
