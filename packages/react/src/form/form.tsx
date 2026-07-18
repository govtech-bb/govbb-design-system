import { cx } from 'class-variance-authority';
import {
  forwardRef,
  type FieldsetHTMLAttributes,
  type HTMLAttributes,
  type LabelHTMLAttributes,
  type ReactNode,
} from 'react';

/*
 * Form scaffolding — the pieces around a control: group, label, hint, error
 * message, fieldset. Compose them; nothing here holds state.
 */

export interface FormGroupProps extends HTMLAttributes<HTMLDivElement> {}

export const FormGroup = forwardRef<HTMLDivElement, FormGroupProps>(
  function FormGroup({ className, ...props }, ref) {
    return (
      <div ref={ref} className={cx('govbb-form-group', className)} {...props} />
    );
  },
);

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { className, ...props },
  ref,
) {
  return (
    <label ref={ref} className={cx('govbb-label', className)} {...props} />
  );
});

export interface HintProps extends HTMLAttributes<HTMLSpanElement> {}

export const Hint = forwardRef<HTMLSpanElement, HintProps>(function Hint(
  { className, ...props },
  ref,
) {
  return <span ref={ref} className={cx('govbb-hint', className)} {...props} />;
});

export interface ErrorMessageProps extends HTMLAttributes<HTMLSpanElement> {}

export const ErrorMessage = forwardRef<HTMLSpanElement, ErrorMessageProps>(
  function ErrorMessage({ className, ...props }, ref) {
    return (
      <span
        ref={ref}
        className={cx('govbb-error-message', className)}
        {...props}
      />
    );
  },
);

export interface FieldsetProps extends FieldsetHTMLAttributes<HTMLFieldSetElement> {
  legend?: ReactNode;
}

export const Fieldset = forwardRef<HTMLFieldSetElement, FieldsetProps>(
  function Fieldset({ legend, className, children, ...props }, ref) {
    return (
      <FormGroup>
        <fieldset
          ref={ref}
          className={cx('govbb-fieldset', className)}
          {...props}
        >
          {legend != null && (
            <legend className="govbb-fieldset__legend">{legend}</legend>
          )}
          {children}
        </fieldset>
      </FormGroup>
    );
  },
);
