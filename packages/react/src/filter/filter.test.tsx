import { expectNoAxeViolations } from '../testing/axe';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from '../checkbox/checkbox';
import { FilterGroup } from '../filter-group/filter-group';
import { Filter } from './filter';

function ServiceFilter(props: { onSubmit?: () => void }) {
  return (
    <Filter
      formProps={{
        action: '/services',
        onSubmit: (e) => {
          e.preventDefault();
          props.onSubmit?.();
        },
      }}
    >
      <FilterGroup label="Service type" open>
        <Checkbox name="type" value="information" label="Information service" />
        <Checkbox name="type" value="digital" label="Digital service" />
      </FilterGroup>
    </Filter>
  );
}

describe('Filter', () => {
  it('renders a details/summary that toggles open', () => {
    const { container } = render(<ServiceFilter />);
    const details = container.querySelector('details')!;
    expect(details.className).toBe('govbb-filter');
    expect(details.open).toBe(false);
    fireEvent.click(screen.getByText('Filter'));
    expect(details.open).toBe(true);
  });

  it('puts the groups in a GET form that the Apply button submits', () => {
    const onSubmit = vi.fn();
    render(<ServiceFilter onSubmit={onSubmit} />);
    const apply = screen.getByRole('button', { name: 'Apply', hidden: true });
    const form = apply.closest('form')!;
    expect(form.className).toBe('govbb-filter__panel');
    expect(form.getAttribute('method')).toBe('get');
    expect(form.getAttribute('action')).toBe('/services');
    fireEvent.click(apply);
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it('reports its own toggle but not its groups', () => {
    const onToggle = vi.fn();
    const { container } = render(
      <Filter open onToggle={onToggle}>
        <FilterGroup label="Service type" open>
          <Checkbox name="type" value="digital" label="Digital service" />
        </FilterGroup>
      </Filter>,
    );
    const [filter, group] = container.querySelectorAll('details');
    fireEvent(group, new Event('toggle'));
    expect(onToggle).not.toHaveBeenCalled();
    fireEvent(filter, new Event('toggle'));
    expect(onToggle).toHaveBeenCalledOnce();
  });

  it('falls back to "Filter" and "Apply" for empty labels', () => {
    render(<Filter summary="" applyLabel="" open />);
    expect(screen.getByText('Filter')).toBeDefined();
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDefined();
  });
});

it('has no axe violations', async () => {
  const { container } = render(<ServiceFilter />);
  container.querySelector('details')!.open = true;
  await expectNoAxeViolations(container);
});
