import { cx } from 'class-variance-authority';
import { useId, type ReactNode } from 'react';
import { ErrorMessage, FormGroup, Hint, Label } from './form';

/*
 * Internal helper shared by the composed fields (Input, TextArea, Select).
 * When a field is given a label/description/error it self-composes the GOV.UK
 * form-group scaffolding; without them the control renders bare. Not part of
 * the public API — compose FormGroup/Label/Hint/ErrorMessage directly for
 * anything this doesn't cover.
 */

export interface FieldFeedback {
  /** Persistent help text, announced via aria-describedby. */
  description?: ReactNode;
  /** Actionable validation error, announced after the description when present. */
  error?: ReactNode;
}

export type FieldExtras = {
  /** Field label. Provide it to switch the control into self-composing mode. */
  label?: ReactNode;
} & FieldFeedback;

/** Stable ids for the control and its description/error, wired for aria-describedby. */
export function useFieldIds(
  id: string | undefined,
  hasDescription: boolean,
  hasError: boolean,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const descriptionId = hasDescription ? `${fieldId}-description` : undefined;
  const errorId = hasError ? `${fieldId}-error` : undefined;
  return {
    fieldId,
    descriptionId,
    errorId,
    describedBy: cx(descriptionId, errorId) || undefined,
  };
}

export function FieldShell({
  label,
  description,
  error,
  fieldId,
  labelId,
  descriptionId,
  errorId,
  children,
}: {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  fieldId: string;
  labelId?: string;
  descriptionId?: string;
  errorId?: string;
  children: ReactNode;
}) {
  return (
    <FormGroup>
      {label != null && (
        <Label id={labelId} htmlFor={fieldId}>
          {label}
        </Label>
      )}
      {description != null && <Hint id={descriptionId}>{description}</Hint>}
      {error != null && (
        <ErrorMessage id={errorId} role="alert">
          {error}
        </ErrorMessage>
      )}
      {children}
    </FormGroup>
  );
}
