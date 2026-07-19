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

export interface SummaryListProps extends HTMLAttributes<HTMLDListElement> {
  rows: SummaryListRow[];
  linkComponent?: LinkComponent;
}

export const SummaryList = forwardRef<HTMLDListElement, SummaryListProps>(
  function SummaryList(
    { rows, linkComponent: Action = 'a', className, ...props },
    ref,
  ) {
    return (
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
                    <Action
                      className="govbb-link"
                      href={action.href}
                      key={actionIndex}
                    >
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
                  ))}
                </dd>
              )}
            </div>
          );
        })}
      </dl>
    );
  },
);
