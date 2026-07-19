import { cva, cx, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

const payment = cva('govbb-payment', {
  variants: {
    outcome: {
      success: 'govbb-payment--success',
      failed: 'govbb-payment--failed',
    },
  },
});

export interface PaymentRow {
  key: ReactNode;
  value: ReactNode;
}

export interface PaymentProps
  extends
    Omit<HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof payment> {
  title: ReactNode;
  description?: ReactNode;
  rows?: PaymentRow[];
  note?: ReactNode;
  children?: ReactNode;
}

export const Payment = forwardRef<HTMLDivElement, PaymentProps>(
  function Payment(
    { outcome, title, description, rows, note, children, className, ...props },
    ref,
  ) {
    return (
      <div ref={ref} className={cx(payment({ outcome }), className)} {...props}>
        <div className="govbb-payment__heading">
          <h2 className="govbb-payment__title">{title}</h2>
          {description != null && <p>{description}</p>}
        </div>
        {rows && rows.length > 0 && (
          <dl className="govbb-payment__items">
            {rows.map((row, index) => (
              <div className="govbb-payment__row" key={index}>
                <dt className="govbb-payment__key">{row.key}</dt>
                <dd className="govbb-payment__value">{row.value}</dd>
              </div>
            ))}
          </dl>
        )}
        {children}
        {note != null && <p className="govbb-payment__note">{note}</p>}
      </div>
    );
  },
);
