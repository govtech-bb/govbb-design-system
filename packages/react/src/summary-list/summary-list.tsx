import { cx } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import type { LinkComponent } from '../link/link';

export interface SummaryListAction {
  href: string;
  label: ReactNode;
  visuallyHiddenText?: ReactNode;
}

export interface SummaryListRow {
  key: ReactNode;
  value: ReactNode;
  actions?: SummaryListAction | SummaryListAction[];
}

export type SummaryListLinkRenderProps = {
  href: string;
  className: string;
  children: ReactNode;
};

export type SummaryListLinkRenderer = (
  props: SummaryListLinkRenderProps,
) => ReactNode;

export interface SummaryListSection {
  title: ReactNode;
  headingLevel?: 'h2' | 'h3' | 'h4';
  action?: SummaryListAction;
}

export interface SummaryListProps extends HTMLAttributes<HTMLDListElement> {
  rows: SummaryListRow[];
  section?: SummaryListSection;
  /** Render actions with an href-compatible router component. */
  linkComponent?: LinkComponent;
  /**
   * Render an action with a router or framework-specific component. Receives the
   * href, the label as children, and the GovBB classes. Takes precedence over
   * linkComponent — use it for routers whose link takes `to` rather than `href`.
   */
  renderLink?: SummaryListLinkRenderer;
}

function ActionLink({
  action,
  linkComponent: Action,
  renderLink,
}: {
  action: SummaryListAction;
  linkComponent: LinkComponent;
  renderLink?: SummaryListLinkRenderer;
}) {
  const label = (
    <>
      {action.label}
      {action.visuallyHiddenText != null && (
        <>
          {' '}
          <span className="govbb-visually-hidden">
            {action.visuallyHiddenText}
          </span>
        </>
      )}
    </>
  );
  if (renderLink != null) {
    return renderLink({
      href: action.href,
      className: 'govbb-link',
      children: label,
    });
  }
  return (
    <Action className="govbb-link" href={action.href}>
      {label}
    </Action>
  );
}

export const SummaryList = forwardRef<HTMLDListElement, SummaryListProps>(
  function SummaryList(
    { rows, section, linkComponent = 'a', renderLink, className, ...props },
    ref,
  ) {
    const list = (
      <dl ref={ref} className={cx('govbb-summary-list', className)} {...props}>
        {rows.map((row, index) => {
          const actions =
            row.actions == null
              ? []
              : Array.isArray(row.actions)
                ? row.actions
                : [row.actions];
          return (
            <div className="govbb-summary-list__row" key={index}>
              <dt className="govbb-summary-list__key">{row.key}</dt>
              <dd className="govbb-summary-list__value">{row.value}</dd>
              {actions.length > 0 && (
                <dd className="govbb-summary-list__actions">
                  {actions.map((action, actionIndex) => (
                    <ActionLink
                      action={action}
                      key={actionIndex}
                      linkComponent={linkComponent}
                      renderLink={renderLink}
                    />
                  ))}
                </dd>
              )}
            </div>
          );
        })}
      </dl>
    );
    if (section == null) return list;
    const HeadingTag = section.headingLevel ?? 'h2';
    return (
      <section className="govbb-summary-section">
        <div className="govbb-summary-section__header">
          <HeadingTag className="govbb-summary-section__title">
            {section.title}
          </HeadingTag>
          {section.action != null && (
            <ActionLink
              action={section.action}
              linkComponent={linkComponent}
              renderLink={renderLink}
            />
          )}
        </div>
        {list}
      </section>
    );
  },
);
