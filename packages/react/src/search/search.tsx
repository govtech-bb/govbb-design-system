import { cva, cx, type VariantProps } from 'class-variance-authority';
import {
  forwardRef,
  useId,
  useRef,
  type ComponentPropsWithRef,
  type FormHTMLAttributes,
  type ReactNode,
} from 'react';
import {
  SuggestionList,
  useSuggestions,
  type AutocompleteSuggestion,
} from '../autocomplete/autocomplete';
import { has } from '../form/form';

const search = cva('govbb-search', {
  variants: {
    borderless: { true: 'govbb-search--borderless' },
  },
});

export interface SearchProps
  extends FormHTMLAttributes<HTMLFormElement>, VariantProps<typeof search> {
  /** Visually hidden label for the input. Empty falls back to "Search". */
  label?: ReactNode;
  /** Submit button text; keep it to one word. Empty falls back to "Search". */
  buttonLabel?: ReactNode;
  /** Reaches the <input> (name, value, onChange, ref, …). */
  inputProps?: ComponentPropsWithRef<'input'>;
  /** Suggestions for the typed text, listed beneath the bar in the page flow:
   *  what follows moves down while the list is open, nothing is covered. The
   *  page owns them — filter, fetch, debounce and cap them (five is plenty).
   *  Leave undefined for a plain search. */
  suggestions?: AutocompleteSuggestion[];
  /** Called after the input's onChange when the user picks a suggestion —
   *  where a site search submits the query. */
  onSuggestionSelect?: (
    suggestion: AutocompleteSuggestion,
    index: number,
  ) => void;
}

/** Ref goes to the <form>; use inputProps.ref for the input. */
export const Search = forwardRef<HTMLFormElement, SearchProps>(function Search(
  {
    label,
    buttonLabel,
    borderless,
    inputProps,
    suggestions,
    onSuggestionSelect,
    className,
    ...props
  },
  ref,
) {
  const autoId = useId();
  const inputId = inputProps?.id ?? autoId;
  const listId = `${inputId}-suggestions`;
  const rootRef = useRef<HTMLDivElement>(null);
  useSuggestions(rootRef, suggestions, onSuggestionSelect);
  const input = {
    name: 'q',
    ...inputProps,
    className: cx('govbb-search__input', inputProps?.className),
    id: inputId,
  };
  return (
    <form
      ref={ref}
      role="search"
      className={search({ borderless, className })}
      {...props}
    >
      <label className="govbb-visually-hidden" htmlFor={inputId}>
        {has(label) ? label : 'Search'}
      </label>
      {suggestions ? (
        // The frontend combobox module, inline: type="text" because the
        // enhanced input is a combobox, a role a search input may not take;
        // enterKeyHint keeps the Search key on touch keyboards.
        <div
          ref={rootRef}
          className="govbb-combobox govbb-combobox--inline"
          data-govbb-module="combobox"
          data-govbb-init=""
        >
          <input type="text" enterKeyHint="search" {...input} list={listId} />
          <SuggestionList id={listId} suggestions={suggestions} />
        </div>
      ) : (
        <input type="search" {...input} />
      )}
      <button className="govbb-search__button" type="submit">
        {has(buttonLabel) ? buttonLabel : 'Search'}
      </button>
    </form>
  );
});
