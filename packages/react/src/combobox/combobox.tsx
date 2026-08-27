import { Combobox as ComboboxModule } from '@govtech-bb/frontend';
import { cx } from 'class-variance-authority';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type SelectHTMLAttributes,
} from 'react';
import { FieldShell, useFieldIds, type FieldExtras } from '../form/field';
import { has } from '../form/form';
import type { SelectOption } from '../select/select';

export type ComboboxProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'multiple'
> &
  FieldExtras & {
    /** Options for the underlying <select>; <option> children work too. */
    options?: SelectOption[];
    /** Text of the list's only row when nothing matches what was typed. */
    emptyLabel?: string;
  };

/*
 * Renders the frontend package's combobox markup — a native <select> inside
 * .govbb-combobox — and mounts the same progressive-enhancement module the
 * plain-HTML runtime uses, so the server output is the select and the
 * behaviour is not reimplemented here. The ref goes to the <select>, which
 * carries the form value: value, defaultValue and onChange work as on Select.
 */
export const Combobox = forwardRef<HTMLSelectElement, ComboboxProps>(
  function Combobox(
    {
      label,
      description,
      error,
      options,
      emptyLabel,
      id,
      className,
      children,
      'aria-describedby': describedBy,
      'aria-invalid': ariaInvalid,
      ...props
    },
    ref,
  ) {
    const rootRef = useRef<HTMLDivElement>(null);
    const selectRef = useRef<HTMLSelectElement>(null);
    const moduleRef = useRef<ComboboxModule | null>(null);
    useImperativeHandle(ref, () => selectRef.current!, []);
    const ids = useFieldIds(id ?? props.name, has(description), has(error));
    const composed = has(label) || has(description) || has(error);

    useEffect(() => {
      const module = new ComboboxModule(rootRef.current!);
      moduleRef.current = module;
      return () => {
        module.destroy();
        moduleRef.current = null;
      };
    }, []);
    // React writes the select on every render; the module mirrors it (value,
    // disabled, aria-*) onto the enhanced input.
    useEffect(() => {
      moduleRef.current?.sync();
    });

    const control = (
      <div
        ref={rootRef}
        className={cx('govbb-combobox', className)}
        data-govbb-module="combobox"
        data-govbb-init=""
        data-empty-label={emptyLabel}
      >
        <select
          ref={selectRef}
          id={composed ? ids.fieldId : id}
          className="govbb-select"
          aria-describedby={cx(ids.describedBy, describedBy) || undefined}
          aria-invalid={has(error) ? true : ariaInvalid}
          {...props}
          multiple={false}
        >
          {options?.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          )) ?? children}
        </select>
      </div>
    );
    if (!composed) return control;
    return (
      <FieldShell
        {...{ label, description, error, ...ids }}
        optional={props.required === false}
      >
        {control}
      </FieldShell>
    );
  },
);
