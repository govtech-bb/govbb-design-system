import { Combobox as ComboboxModule } from '@govtech-bb/frontend';
import { cx } from 'class-variance-authority';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type InputHTMLAttributes,
} from 'react';
import { FieldShell, useFieldIds, type FieldExtras } from '../form/field';
import { has } from '../form/form';

export interface AutocompleteSuggestion {
  /** What the field holds when this suggestion is chosen. */
  value: string;
  /** What the list shows; defaults to the value. */
  label?: string;
}

export type AutocompleteProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'list' | 'type'
> &
  FieldExtras & {
    /** Suggestions for the current text. The page owns them — filter, fetch
     *  and debounce as the service needs; the list shows exactly what is
     *  passed, and closes when this is empty. */
    suggestions?: AutocompleteSuggestion[];
    /** Called after onChange when the user picks a suggestion from the list. */
    onSuggestionSelect?: (
      suggestion: AutocompleteSuggestion,
      index: number,
    ) => void;
  };

/*
 * Free-text input with suggestions: the frontend combobox module in its
 * input mode. Renders <input> + <datalist> — the no-JS baseline is the
 * browser's own datalist popup — and mounts the module after hydration. The
 * ref goes to the <input>, which carries the value: value, defaultValue and
 * onChange work as on Input. For a value that must be one of a fixed list,
 * use Combobox instead.
 */
export const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
  function Autocomplete(
    {
      label,
      description,
      error,
      suggestions = [],
      onSuggestionSelect,
      id,
      className,
      'aria-describedby': describedBy,
      'aria-invalid': ariaInvalid,
      ...props
    },
    ref,
  ) {
    const rootRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const moduleRef = useRef<ComboboxModule | null>(null);
    // Latest props for the module's select event without re-subscribing.
    const latest = useRef({ suggestions, onSuggestionSelect });
    latest.current = { suggestions, onSuggestionSelect };
    useImperativeHandle(ref, () => inputRef.current!, []);
    const ids = useFieldIds(id ?? props.name, has(description), has(error));
    const composed = has(label) || has(description) || has(error);
    const listId = `${ids.fieldId}-suggestions`;

    useEffect(() => {
      const root = rootRef.current!;
      const module = new ComboboxModule(root);
      moduleRef.current = module;
      const onSelect = (event: Event) => {
        const { index } = (event as CustomEvent<{ index: number }>).detail;
        const suggestion = latest.current.suggestions[index];
        if (suggestion) latest.current.onSuggestionSelect?.(suggestion, index);
      };
      root.addEventListener('govbb-combobox-select', onSelect);
      return () => {
        root.removeEventListener('govbb-combobox-select', onSelect);
        module.destroy();
        moduleRef.current = null;
      };
    }, []);
    // New suggestions land in the datalist on render; the module follows.
    useEffect(() => {
      moduleRef.current?.sync();
    });

    const control = (
      <div
        ref={rootRef}
        className="govbb-combobox"
        data-govbb-module="combobox"
        data-govbb-init=""
      >
        <input
          ref={inputRef}
          id={composed ? ids.fieldId : id}
          className={cx('govbb-input', className)}
          type="text"
          list={listId}
          aria-describedby={cx(ids.describedBy, describedBy) || undefined}
          aria-invalid={has(error) ? true : ariaInvalid}
          {...props}
        />
        <datalist id={listId}>
          {suggestions.map((suggestion, index) => (
            <option
              key={`${suggestion.value}-${index}`}
              value={suggestion.value}
              label={suggestion.label}
            />
          ))}
        </datalist>
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
