import type { Meta, StoryObj } from '@storybook/react-vite';
import { BackButton } from '../../packages/react/src/back-button/back-button';

const meta = {
  title: 'Components/Back button',
  component: BackButton,
  tags: ['autodocs'],
  args: { href: '#previous', children: 'Back' },
} satisfies Meta<typeof BackButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const CustomLabel: Story = {
  args: { children: 'Back to your answers' },
};
