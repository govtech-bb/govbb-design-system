import { cx } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import type { LinkComponent } from '../link/link';

export interface OfficialBannerProps extends HTMLAttributes<HTMLDivElement> {
  /** Banner image URL — the consumer hosts the asset. */
  imageSrc: string;
  /** Accessible image text. Keep empty when the adjacent banner text conveys the meaning. */
  imageAlt?: string;
  /** Whether to show the learn-more link. */
  showLearnMore?: boolean;
  /** Destination for the learn-more link. */
  learnMoreHref?: string;
  linkLabel?: ReactNode;
  linkComponent?: LinkComponent;
  children?: ReactNode;
}

export const OfficialBanner = forwardRef<HTMLDivElement, OfficialBannerProps>(
  function OfficialBanner(
    {
      imageSrc,
      imageAlt = '',
      showLearnMore = true,
      learnMoreHref = '#',
      linkLabel = 'Learn more',
      linkComponent: Anchor = 'a',
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
              src={imageSrc}
              alt={imageAlt}
            />
          </div>
          <div className="govbb-official-banner__text">
            <span>{children}</span>
            {showLearnMore ? (
              <Anchor
                className="govbb-official-banner__link"
                href={learnMoreHref}
                aria-label={
                  linkLabel === 'Learn more'
                    ? 'Learn how to identify an official government website'
                    : undefined
                }
              >
                {linkLabel}
              </Anchor>
            ) : null}
          </div>
        </div>
      </div>
    );
  },
);
