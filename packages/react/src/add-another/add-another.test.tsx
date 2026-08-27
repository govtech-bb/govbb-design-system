import { expectNoAxeViolations } from '../testing/axe';
import { Input } from '../input/input';
import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { AddAnother, AddAnotherItem } from './add-another';

function People({
  initial = ['Sara Williams'],
  max = 3,
  layout,
}: {
  initial?: string[];
  max?: number;
  layout?: 'stacked' | 'inline';
}) {
  const [people, setPeople] = useState(initial);
  return (
    <AddAnother
      itemLabel="Person"
      layout={layout}
      onAdd={() => setPeople([...people, ''])}
      canAdd={people.length < max}
    >
      {people.map((name, i) => (
        <AddAnotherItem
          key={`${i}-${name}`}
          index={i}
          onRemove={() => setPeople(people.filter((_, j) => j !== i))}
        >
          <Input
            label="Full name"
            name={`person[${i}][name]`}
            defaultValue={name}
          />
        </AddAnotherItem>
      ))}
    </AddAnother>
  );
}

const legends = () =>
  screen
    .getAllByRole('group')
    .map((g) => g.querySelector('legend')?.textContent);

describe('AddAnother', () => {
  it('numbers a single entry and offers no Remove for it', () => {
    render(<People />);
    expect(legends()).toEqual(['Person 1']);
    expect(screen.queryByRole('button', { name: /remove/i })).toBeNull();
    expect(
      screen.getByRole('button', { name: 'Add another person' }).className,
    ).toContain('govbb-button--text');
  });

  it('adds an entry, renumbers, moves focus to it and announces', () => {
    render(<People />);
    fireEvent.click(screen.getByRole('button', { name: 'Add another person' }));
    expect(legends()).toEqual(['Person 1 of 2', 'Person 2 of 2']);
    expect(document.activeElement).toBe(screen.getAllByRole('group')[1]);
    expect(screen.getByRole('status').textContent).toBe('Person 2 added');
    expect(
      screen
        .getAllByRole('button', { name: /^Remove person/ })
        .map((b) => b.textContent),
    ).toEqual(['Remove person 1', 'Remove person 2']);
    expect(
      screen.getByRole('button', { name: 'Remove person 2' }).className,
    ).toContain('govbb-button--negative');
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    expect(inputs.map((i) => i.name)).toEqual([
      'person[0][name]',
      'person[1][name]',
    ]);
    expect(inputs[1].value).toBe('');
  });

  it('removes an entry and focuses the one before it', () => {
    render(<People initial={['Sara', 'Kofi', 'Ama']} />);
    fireEvent.click(screen.getByRole('button', { name: 'Remove person 2' }));
    expect(legends()).toEqual(['Person 1 of 2', 'Person 2 of 2']);
    expect(document.activeElement).toBe(screen.getAllByRole('group')[0]);
    expect(screen.getByRole('status').textContent).toBe('Person 2 removed');
    fireEvent.click(screen.getByRole('button', { name: 'Remove person 1' }));
    expect(legends()).toEqual(['Person 1']);
    expect(document.activeElement).toBe(screen.getAllByRole('group')[0]);
  });

  it('hides Add at the maximum', () => {
    render(<People initial={['Sara', 'Kofi', 'Ama']} max={3} />);
    expect(
      screen.queryByRole('button', { name: 'Add another person' }),
    ).toBeNull();
  });

  it('applies the inline layout class', () => {
    const { container } = render(<People layout="inline" />);
    expect(
      container.querySelector('.govbb-add-another--inline'),
    ).not.toBeNull();
  });
});

it('has no axe violations', async () => {
  const { container } = render(<People initial={['Sara', 'Kofi']} />);
  await expectNoAxeViolations(container);
});
