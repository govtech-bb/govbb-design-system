import { Combobox as ComboboxModule } from '@govtech-bb/frontend';
import { cva, cx, type VariantProps } from 'class-variance-authority';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type InputHTMLAttributes,
  type RefObject,
} from 'react';
import { FieldShell, useFieldIds, type FieldExtras } from '../form/field';
import { has } from '../form/form';

export interface AutocompleteSuggestion {
  /** What the field holds when this suggestion is chosen. */
  value: string;
  /** What the list shows; defaults to the value. */
  label?: string;
}

const combobox = cva('govbb-combobox', {
  variants: {
    inline: { true: 'govbb-combobox--inline' },
  },
});

export type AutocompleteProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'list' | 'type'
> &
  FieldExtras &
  VariantProps<typeof combobox> & {
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

/**
 * Mounts the frontend combobox module on the .govbb-combobox wrapper after
 * hydration, keeps it in step with every render (new suggestions land in the
 * datalist on render; the module follows) and reports picks against the
 * current suggestions. Undefined suggestions mean the wrapper is not rendered,
 * so nothing is mounted. Shared with Search.
 */
export function useSuggestions(
  rootRef: RefObject<HTMLElement | null>,
  suggestions: AutocompleteSuggestion[] | undefined,
  onSuggestionSelect?: (
    suggestion: AutocompleteSuggestion,
    index: number,
  ) => void,
) {
  const moduleRef = useRef<ComboboxModule | null>(null);
  // Latest props for the module's select event without re-subscribing.
  const latest = useRef({ suggestions, onSuggestionSelect });
  latest.current = { suggestions, onSuggestionSelect };
  const enhanced = suggestions !== undefined;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const module = new ComboboxModule(root);
    moduleRef.current = module;
    const onSelect = (event: Event) => {
      const { index } = (event as CustomEvent<{ index: number }>).detail;
      const suggestion = latest.current.suggestions?.[index];
      if (suggestion) latest.current.onSuggestionSelect?.(suggestion, index);
    };
    root.addEventListener('govbb-combobox-select', onSelect);
    return () => {
      root.removeEventListener('govbb-combobox-select', onSelect);
      module.destroy();
      moduleRef.current = null;
    };
  }, [rootRef, enhanced]);
  useEffect(() => {
    moduleRef.current?.sync();
  });
}

/** The datalist the module reads the suggestions from — and the browser's own
 *  suggestion popup before it mounts, or without JavaScript. */
export function SuggestionList({
  id,
  suggestions,
}: {
  id: string;
  suggestions: AutocompleteSuggestion[];
}) {
  return (
    <datalist id={id}>
      {suggestions.map((suggestion, index) => (
        <option
          key={`${suggestion.value}-${index}`}
          value={suggestion.value}
          label={suggestion.label}
        />
      ))}
    </datalist>
  );
}

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
      inline,
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
    useImperativeHandle(ref, () => inputRef.current!, []);
    const ids = useFieldIds(id ?? props.name, has(description), has(error));
    const composed = has(label) || has(description) || has(error);
    const listId = `${ids.fieldId}-suggestions`;
    useSuggestions(rootRef, suggestions, onSuggestionSelect);

    const control = (
      <div
        ref={rootRef}
        className={combobox({ inline })}
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
        <SuggestionList id={listId} suggestions={suggestions} />
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
