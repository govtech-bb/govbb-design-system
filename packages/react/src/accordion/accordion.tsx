import { cva, cx, type VariantProps } from 'class-variance-authority';
import {
  createContext,
  forwardRef,
  useContext,
  useId,
  type DetailsHTMLAttributes,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';

type HeadingLevel = 2 | 3 | 4 | 5 | 6;

const accordion = cva('govbb-accordion', {
  variants: {
    /** How the group is framed. Quiet is a stack of pressable rows; the rest
        draw borders: rules between sections, one box around the group, or a
        card per section. */
    variant: {
      quiet: '',
      divided: 'govbb-accordion--divided',
      boxed: 'govbb-accordion--boxed',
      cards: 'govbb-accordion--cards',
    },
  },
  defaultVariants: { variant: 'quiet' },
});

/*
 * The group hands each section the shared `name` that makes the accordion
 * exclusive, and its disabled state. Sections can still set either themselves.
 */
const AccordionContext = createContext<{ name?: string; disabled?: boolean }>(
  {},
);

export interface AccordionProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof accordion> {
  /** Let users keep several sections open at once. Off keeps one open. */
  allowsMultipleExpanded?: boolean;
  /** Stop every section opening, for content that is not available yet. */
  disabled?: boolean;
  children?: ReactNode;
}

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  function Accordion(
    {
      variant,
      allowsMultipleExpanded = true,
      disabled,
      className,
      children,
      ...props
    },
    ref,
  ) {
    // The browser keeps one <details> of a given name open at a time, so the
    // exclusive behaviour needs no state of ours.
    const groupName = useId();
    return (
      <AccordionContext.Provider
        value={{
          name: allowsMultipleExpanded ? undefined : groupName,
          disabled,
        }}
      >
        <div
          ref={ref}
          className={cx(accordion({ variant }), className)}
          {...props}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    );
  },
);

export interface AccordionSectionProps extends Omit<
  DetailsHTMLAttributes<HTMLDetailsElement>,
  'title'
> {
  /** Section title, rendered inside the summary as a heading. */
  heading: ReactNode;
  /** Heading level, so the accordion fits the page outline. */
  headingLevel?: HeadingLevel;
  /** Decorative icon before the heading. Drawn in the row's colour when it
      uses currentColor. */
  icon?: ReactNode;
  /** One line under the heading, for when the heading alone cannot say what
      is inside. Screen readers announce it as part of the row. */
  hint?: ReactNode;
  /** Stop this section opening. */
  disabled?: boolean;
}

/*
 * A native <details> section: it opens, closes and takes keyboard focus with
 * no JavaScript.
 */
export const AccordionSection = forwardRef<
  HTMLDetailsElement,
  AccordionSectionProps
>(function AccordionSection(
  {
    heading,
    headingLevel = 3,
    icon,
    hint,
    disabled,
    name,
    className,
    children,
    ...props
  },
  ref,
) {
  const group = useContext(AccordionContext);
  const Heading = `h${headingLevel}` as const;
  const isDisabled = disabled ?? group.disabled;
  const title = (
    <Heading className="govbb-accordion__heading">{heading}</Heading>
  );

  return (
    <details
      ref={ref}
      className={cx('govbb-accordion__section', className)}
      name={name ?? group.name}
      {...props}
    >
      <summary
        className="govbb-accordion__summary"
        aria-disabled={isDisabled || undefined}
        // A <summary> has no disabled attribute, so a disabled section leaves
        // the tab order and swallows the click that would open it.
        tabIndex={isDisabled ? -1 : undefined}
        onClick={
          isDisabled
            ? (event: MouseEvent<HTMLElement>) => event.preventDefault()
            : undefined
        }
      >
        {icon != null && (
          <span className="govbb-accordion__icon" aria-hidden="true">
            {icon}
          </span>
        )}
        {hint != null ? (
          <span className="govbb-accordion__text">
            {title}
            <span className="govbb-accordion__hint">{hint}</span>
          </span>
        ) : (
          title
        )}
      </summary>
      <div className="govbb-accordion__content">{children}</div>
    </details>
  );
});
