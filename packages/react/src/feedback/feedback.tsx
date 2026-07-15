import { cx } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

export interface FeedbackProps extends HTMLAttributes<HTMLElement> {
  /** Heading line above the prompt. */
  heading?: ReactNode;
  /** Body copy and the feedback link — use <Link> for the link. */
  children?: ReactNode;
}

/**
 * "Was this helpful?" box inviting feedback on the current page. Renders an
 * <aside> so it sits alongside, not inside, the page's main content flow.
 */
export const Feedback = forwardRef<HTMLElement, FeedbackProps>(
  function Feedback(
    { heading = 'Was this helpful?', className, children, ...props },
    ref,
  ) {
    return (
      <aside ref={ref} className={cx('govbb-feedback', className)} {...props}>
        <h3 className="govbb-feedback__heading">{heading}</h3>
        {children}
      </aside>
    );
  },
);
