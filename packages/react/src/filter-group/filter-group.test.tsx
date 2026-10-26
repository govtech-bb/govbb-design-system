import { expectNoAxeViolations } from '../testing/axe';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Checkbox } from '../checkbox/checkbox';
import { FilterGroup } from './filter-group';

function ServiceType() {
  return (
    <FilterGroup label="Service type">
      <Checkbox name="type" value="information" label="Information service" />
      <Checkbox name="type" value="digital" label="Digital service" />
    </FilterGroup>
  );
}

describe('FilterGroup', () => {
  it('renders a details/summary that toggles open', () => {
    const { container } = render(<ServiceType />);
    const details = container.querySelector('details')!;
    expect(details.className).toBe('govbb-filter-group');
    expect(details.open).toBe(false);
    fireEvent.click(screen.getByText('Service type'));
    expect(details.open).toBe(true);
  });

  it('names the options group after the summary', () => {
    const { container } = render(<ServiceType />);
    container.querySelector('details')!.open = true;
    const group = screen.getByRole('group', { name: 'Service type' });
    expect(group.querySelectorAll('input[type="checkbox"]').length).toBe(2);
  });

  it('puts a given id on the summary that names the group', () => {
    const { container } = render(
      <FilterGroup label="Service type" id="filter-type" open>
        <Checkbox name="type" value="digital" label="Digital service" />
      </FilterGroup>,
    );
    const summary = screen.getByText('Service type');
    expect(summary.id).toBe('filter-type');
    const options = container.querySelector('.govbb-filter-group__options')!;
    expect(options.getAttribute('aria-labelledby')).toBe('filter-type');
  });

  it('generates an id when given an empty one, so the group keeps its name', () => {
    render(
      <FilterGroup label="Service type" id="" open>
        <Checkbox name="type" value="digital" label="Digital service" />
      </FilterGroup>,
    );
    expect(screen.getByText('Service type').id).not.toBe('');
    screen.getByRole('group', { name: 'Service type' });
  });

  it('rejects a missing label or a name at compile time', () => {
    // @ts-expect-error no label leaves the summary and group unnamed
    render(<FilterGroup label={null} />);
    // @ts-expect-error name would make the groups exclusive, not name options
    render(<FilterGroup label="Category" name="category" />);
  });
});

it('has no axe violations', async () => {
  const { container } = render(<ServiceType />);
  container.querySelector('details')!.open = true;
  await expectNoAxeViolations(container);
});
