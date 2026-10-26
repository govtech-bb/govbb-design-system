import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { Checkbox } from '../../packages/react/src/checkbox/checkbox';
import { Filter } from '../../packages/react/src/filter/filter';
import { FilterGroup } from '../../packages/react/src/filter-group/filter-group';

const submit = fn((event: React.FormEvent) => event.preventDefault());
const meta = {
  title: 'Components/Filter',
  component: Filter,
  tags: ['autodocs'],
  args: { formProps: { onSubmit: submit } },
  render: (args) => (
    <Filter {...args}>
      <FilterGroup label="Service type">
        <Checkbox name="type" value="information" label="Information service" />
        <Checkbox name="type" value="digital" label="Digital service" />
      </FilterGroup>
      <FilterGroup label="Category">
        <Checkbox name="category" value="travel" label="Travel" />
        <Checkbox name="category" value="business" label="Business" />
      </FilterGroup>
    </Filter>
  ),
} satisfies Meta<typeof Filter>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, canvasElement, userEvent }) => {
    const [filter, serviceType] = canvasElement.querySelectorAll('details');

    await userEvent.click(canvas.getByText('Filter'));
    await expect(filter.open).toBe(true);
    await userEvent.click(canvas.getByText('Service type'));
    await expect(serviceType.open).toBe(true);
    await userEvent.click(canvas.getByRole('button', { name: 'Apply' }));
    await expect(submit).toHaveBeenCalled();
  },
};

export const Open: Story = { args: { open: true } };
