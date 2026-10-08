import { cx } from 'class-variance-authority';
import {
  Children,
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { Button } from '../button/button';

/*
 * Add another — a repeatable group of fields. Unlike the frontend module,
 * which clones DOM, the React version leaves the list of items to the
 * consumer's state: render one AddAnotherItem per entry, append on onAdd and
 * drop on onRemove. The wrapper owns what the module owns otherwise: numbered
 * legends, the Remove/Add buttons, focus after a change and the announcement.
 * Both buttons are flush text buttons, as gov.bb forms already renders them;
 * Remove throws away what the user typed, so it takes the negative modifier.
 */

interface AddAnotherContextValue {
  itemLabel: string;
  count: number;
  /** Queue a focus target and announcement for after the next render. */
  request: (focus: number | 'add', message: string) => void;
}

const AddAnotherContext = createContext<AddAnotherContextValue | null>(null);

export interface AddAnotherProps extends HTMLAttributes<HTMLDivElement> {
  /** Name for one entry, in sentence case ("Person", "Bank account"). Numbers
   *  the legends and the buttons: "Person 2 of 3", "Remove person 2". */
  itemLabel: string;
  /** The user asked for another entry: append one to your list. */
  onAdd: () => void;
  /** Set false at your maximum to hide the Add button. */
  canAdd?: boolean;
  /** Defaults to "Add another <item label>". */
  addLabel?: ReactNode;
  /** Inline puts each entry's fields in one row from tablet up. */
  layout?: 'stacked' | 'inline';
  /** One AddAnotherItem per entry, passed directly (not in a fragment). */
  children: ReactNode;
}

export const AddAnother = forwardRef<HTMLDivElement, AddAnotherProps>(
  function AddAnother(
    {
      itemLabel,
      onAdd,
      canAdd = true,
      addLabel,
      layout = 'stacked',
      className,
      children,
      ...props
    },
    ref,
  ) {
    const rootRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => rootRef.current!, []);
    const count = Children.toArray(children).length;
    const pending = useRef<{ focus: number | 'add'; message: string } | null>(
      null,
    );
    const [message, setMessage] = useState('');
    const request = (focus: number | 'add', text: string) => {
      pending.current = { focus, message: text };
    };
    // After the consumer's state change has rendered, move focus to the new
    // entry (or the neighbour of a removed one) and say what happened.
    useEffect(() => {
      const job = pending.current;
      if (!job) return;
      pending.current = null;
      const root = rootRef.current!;
      const fieldsets = root.querySelectorAll<HTMLElement>(
        '.govbb-add-another__fieldset',
      );
      const add = root.querySelector<HTMLElement>('.govbb-add-another__add');
      const target =
        job.focus === 'add'
          ? add
          : (fieldsets[Math.min(job.focus, fieldsets.length - 1)] ?? add);
      target?.focus();
      setMessage(job.message);
    });

    return (
      <AddAnotherContext.Provider value={{ itemLabel, count, request }}>
        <div
          ref={rootRef}
          className={cx(
            'govbb-add-another',
            layout === 'inline' && 'govbb-add-another--inline',
            className,
          )}
          {...props}
        >
          <div className="govbb-add-another__items">{children}</div>
          {canAdd && (
            <Button
              variant="text"
              className="govbb-add-another__add"
              onClick={() => {
                request(count, `${itemLabel} ${count + 1} added`);
                onAdd();
              }}
            >
              {addLabel ?? `Add another ${itemLabel.toLocaleLowerCase()}`}
            </Button>
          )}
          <div className="govbb-visually-hidden" role="status">
            {message}
          </div>
        </div>
      </AddAnotherContext.Provider>
    );
  },
);

export interface AddAnotherItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Position in the list, from 0. */
  index: number;
  /** The user removed this entry: drop it from your list. */
  onRemove?: () => void;
  /** Whether Remove shows; defaults to onRemove being set and more than one
   *  entry existing. Pass false at your minimum. */
  removable?: boolean;
  /** Defaults to "Remove <item label> <number>". */
  removeLabel?: ReactNode;
  /** The entry's fields. Give each a unique name (and id) per entry. */
  children: ReactNode;
}

export const AddAnotherItem = forwardRef<HTMLDivElement, AddAnotherItemProps>(
  function AddAnotherItem(
    { index, onRemove, removable, removeLabel, className, children, ...props },
    ref,
  ) {
    const group = useContext(AddAnotherContext);
    if (!group) throw new Error('AddAnotherItem must be inside AddAnother');
    const { itemLabel, count, request } = group;
    const number = index + 1;
    const canRemove = removable ?? (onRemove !== undefined && count > 1);
    return (
      <div
        ref={ref}
        className={cx('govbb-add-another__item', className)}
        {...props}
      >
        <fieldset
          className="govbb-fieldset govbb-add-another__fieldset"
          tabIndex={-1}
        >
          <legend className="govbb-fieldset__legend govbb-add-another__legend">
            {count > 1
              ? `${itemLabel} ${number} of ${count}`
              : `${itemLabel} ${number}`}
          </legend>
          {children}
          {canRemove && (
            <Button
              variant="text"
              negative
              className="govbb-add-another__remove"
              onClick={() => {
                request(
                  Math.max(index - 1, 0),
                  `${itemLabel} ${number} removed`,
                );
                onRemove?.();
              }}
            >
              {removeLabel ??
                `Remove ${itemLabel.toLocaleLowerCase()} ${number}`}
            </Button>
          )}
        </fieldset>
      </div>
    );
  },
);
