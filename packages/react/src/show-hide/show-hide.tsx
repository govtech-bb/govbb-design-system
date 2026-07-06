import { cx } from 'class-variance-authority';
import { forwardRef, type DetailsHTMLAttributes, type ReactNode } from 'react';

export interface ShowHideProps extends DetailsHTMLAttributes<HTMLDetailsElement> {
  summary: ReactNode;
}

export const ShowHide = forwardRef<HTMLDetailsElement, ShowHideProps>(
  function ShowHide({ summary, className, children, ...props }, ref) {
    return (
      <details
        ref={ref}
        className={cx('govbb-show-hide', className)}
        {...props}
      >
        <summary className="govbb-show-hide__summary">{summary}</summary>
        <div className="govbb-show-hide__content">{children}</div>
      </details>
    );
  },
);
