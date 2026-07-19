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

export interface SummaryListSection {
  title: ReactNode;
  headingLevel?: 'h2' | 'h3' | 'h4';
  action?: SummaryListAction;
}

export interface SummaryListProps extends HTMLAttributes<HTMLDListElement> {
  rows: SummaryListRow[];
  section?: SummaryListSection;
  linkComponent?: LinkComponent;
}

function ActionLink({
  action,
  linkComponent: Action,
}: {
  action: SummaryListAction;
  linkComponent: LinkComponent;
}) {
  return (
    <Action className="govbb-link" href={action.href}>
      {action.label}
      {action.visuallyHiddenText != null && (
        <>
          {' '}
          <span className="govbb-visually-hidden">
            {action.visuallyHiddenText}
          </span>
        </>
      )}
    </Action>
  );
}

export const SummaryList = forwardRef<HTMLDListElement, SummaryListProps>(
  function SummaryList(
    { rows, section, linkComponent = 'a', className, ...props },
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
                      linkComponent={linkComponent}
                      key={actionIndex}
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
            <ActionLink action={section.action} linkComponent={linkComponent} />
          )}
        </div>
        {list}
      </section>
    );
  },
);
