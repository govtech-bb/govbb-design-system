import type { Meta, StoryObj } from '@storybook/react-vite';
import { SkipLink } from '../../packages/react/src/skip-link/skip-link';

const meta = {
  title: 'Components/Skip link',
  component: SkipLink,
  tags: ['autodocs'],
  args: { href: '#main-content' },
} satisfies Meta<typeof SkipLink>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
