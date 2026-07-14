import { cva, cx, type VariantProps } from 'class-variance-authority';
import {
  forwardRef,
  useId,
  type ComponentPropsWithRef,
  type FormHTMLAttributes,
  type ReactNode,
} from 'react';

const search = cva('govbb-search', {
  variants: {
    borderless: { true: 'govbb-search--borderless' },
  },
});

export interface SearchProps
  extends FormHTMLAttributes<HTMLFormElement>, VariantProps<typeof search> {
  /** Visually hidden label for the input. */
  label?: ReactNode;
  buttonLabel?: ReactNode;
  /** Reaches the <input> (name, value, onChange, ref, …). */
  inputProps?: ComponentPropsWithRef<'input'>;
}

/** Ref goes to the <form>; use inputProps.ref for the input. */
export const Search = forwardRef<HTMLFormElement, SearchProps>(function Search(
  {
    label = 'Search',
    buttonLabel = 'Search',
    borderless,
    inputProps,
    className,
    ...props
  },
  ref,
) {
  const autoId = useId();
  const inputId = inputProps?.id ?? autoId;
  return (
    <form
      ref={ref}
      role="search"
      className={search({ borderless, className })}
      {...props}
    >
      <label className="govbb-visually-hidden" htmlFor={inputId}>
        {label}
      </label>
      <input
        type="search"
        name="q"
        {...inputProps}
        className={cx('govbb-search__input', inputProps?.className)}
        id={inputId}
      />
      <button className="govbb-search__button" type="submit">
        {buttonLabel}
      </button>
    </form>
  );
});
