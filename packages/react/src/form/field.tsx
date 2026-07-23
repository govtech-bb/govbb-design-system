import { cx } from 'class-variance-authority';
import { useId, type ReactNode } from 'react';
import { ErrorMessage, FormGroup, Hint, Label } from './form';

/*
 * Internal helper shared by the composed fields (Input, Textarea, Select).
 * When a field is given a label/hint/error it self-composes the GOV.UK
 * form-group scaffolding; without them the control renders bare. Not part of
 * the public API — compose FormGroup/Label/Hint/ErrorMessage directly for
 * anything this doesn't cover.
 */

export type HintOrError =
  { hint?: ReactNode; error?: never } | { error?: ReactNode; hint?: never };

export type FieldExtras = {
  /** Field label. Provide it to switch the control into self-composing mode. */
  label?: ReactNode;
} & HintOrError;

/** Stable ids for the control and its hint/error, wired for aria-describedby. */
export function useFieldIds(
  id: string | undefined,
  hasHint: boolean,
  hasError: boolean,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const hintId = hasHint ? `${fieldId}-hint` : undefined;
  const errorId = hasError ? `${fieldId}-error` : undefined;
  return {
    fieldId,
    hintId,
    errorId,
    describedBy: cx(hintId, errorId) || undefined,
  };
}

export function FieldShell({
  label,
  hint,
  error,
  fieldId,
  labelId,
  hintId,
  errorId,
  children,
}: {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  fieldId: string;
  labelId?: string;
  hintId?: string;
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
      {hint != null && error == null && <Hint id={hintId}>{hint}</Hint>}
      {error != null && (
        <ErrorMessage id={errorId} role="alert">
          {error}
        </ErrorMessage>
      )}
      {children}
    </FormGroup>
  );
}
