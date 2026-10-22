import type { Meta, StoryObj } from '@storybook/react-vite';
import { Freshness } from '../../packages/react/src/freshness/freshness';

const meta = {
  title: 'Components/Freshness',
  component: Freshness,
  tags: ['autodocs'],
  args: {
    children: (
      <>
        Last updated on <time dateTime="2026-03-12">12 March 2026</time>
      </>
    ),
  },
} satisfies Meta<typeof Freshness>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
