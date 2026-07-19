import { cx } from 'class-variance-authority';
import {
  forwardRef,
  useId,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';

/*
 * Focusable (tabIndex -1) so the consumer can move focus here on failed
 * submit, per the GOV.UK pattern: summaryRef.current?.focus().
 */

export interface ErrorSummaryItem {
  /** Targets the offending field's id, e.g. `#date-of-birth`. */
  href: string;
  label: ReactNode;
}

export interface ErrorSummaryProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'title'
> {
  title?: ReactNode;
  /** One entry per error; href targets the offending field's id. */
  errors: ErrorSummaryItem[];
  /**
   * Called when a summary link is activated. By default the linked control is
   * focused (the GOV.UK behaviour); call `event.preventDefault()` to skip that.
   */
  onErrorClick?: (
    item: ErrorSummaryItem,
    event: MouseEvent<HTMLAnchorElement>,
  ) => void;
}

export const ErrorSummary = forwardRef<HTMLDivElement, ErrorSummaryProps>(
  function ErrorSummary(
    { title = 'There is a problem', errors, onErrorClick, className, ...props },
    ref,
  ) {
    function handleClick(
      item: ErrorSummaryItem,
      event: MouseEvent<HTMLAnchorElement>,
    ) {
      onErrorClick?.(item, event);
      if (event.defaultPrevented || !item.href.startsWith('#')) return;
      const target = document.getElementById(item.href.slice(1));
      if (target == null) return;
      target.focus();
      if (document.activeElement !== target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    }
    const titleId = useId();
    return (
      <div
        ref={ref}
        className={cx('govbb-error-summary', className)}
        role="alert"
        aria-labelledby={titleId}
        tabIndex={-1}
        {...props}
      >
        <h2 className="govbb-error-summary__title" id={titleId}>
          {title}
        </h2>
        <ul className="govbb-error-summary__list">
          {errors.map((item) => (
            <li key={item.href}>
              <a
                className="govbb-link govbb-error-summary__link"
                href={item.href}
                onClick={(event) => handleClick(item, event)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  },
);
