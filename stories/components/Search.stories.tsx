import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { Search } from '../../packages/react/src/search/search';

const submit = fn((event: React.FormEvent) => event.preventDefault());
const meta = {
  title: 'Components/Search',
  component: Search,
  tags: ['autodocs'],
  args: { onSubmit: submit },
} satisfies Meta<typeof Search>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByRole('searchbox'), 'passport');
    await userEvent.click(canvas.getByRole('button', { name: 'Search' }));
    await expect(submit).toHaveBeenCalled();
  },
};
export const Borderless: Story = { args: { borderless: true } };
