import type { Meta, StoryObj } from '@storybook/react-vite';
import { List } from '../../packages/react/src/list/list';

const meta = {
  title: 'Components/List',
  component: List,
  tags: ['autodocs'],
  args: {
    children: (
      <>
        <li>Passport</li>
        <li>Proof of address</li>
        <li>Application form</li>
      </>
    ),
  },
} satisfies Meta<typeof List>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Plain: Story = {};
export const Bulleted: Story = { args: { variant: 'bullet' } };
export const Numbered: Story = { args: { variant: 'number' } };
