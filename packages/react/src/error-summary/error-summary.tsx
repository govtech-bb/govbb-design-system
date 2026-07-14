import { cx } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

/*
 * Focusable (tabIndex -1) so the consumer can move focus here on failed
 * submit, per the GOV.UK pattern: summaryRef.current?.focus().
 */

export interface ErrorSummaryProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'title'
> {
  title?: ReactNode;
  /** One entry per error; href targets the offending field's id. */
  errors: Array<{ href: string; label: ReactNode }>;
}

export const ErrorSummary = forwardRef<HTMLDivElement, ErrorSummaryProps>(
  function ErrorSummary(
    { title = 'There is a problem', errors, className, ...props },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cx('govbb-error-summary', className)}
        role="alert"
        tabIndex={-1}
        {...props}
      >
        <h2 className="govbb-error-summary__title">{title}</h2>
        <ul className="govbb-error-summary__list">
          {errors.map(({ href, label }) => (
            <li key={href}>
              <a className="govbb-link govbb-error-summary__link" href={href}>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  },
);
