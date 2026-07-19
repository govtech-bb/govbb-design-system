import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatusBanner } from '../../packages/react/src/status-banner/status-banner';

const meta = {
  title: 'Components/Status banner',
  component: StatusBanner,
  tags: ['autodocs'],
  args: {
    variant: 'beta',
    children: (
      <p>
        This service is in Beta. <a href="#feedback">Give feedback</a>.
      </p>
    ),
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['alpha', 'beta', 'migrated', 'service'],
    },
  },
} satisfies Meta<typeof StatusBanner>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Beta: Story = {};
export const Alpha: Story = { args: { variant: 'alpha' } };
export const Migrated: Story = {
  args: {
    variant: 'migrated',
    rounded: true,
    children: <p>This page has moved to a new service.</p>,
  },
};
export const FullWidth: Story = {
  args: { fullWidth: true },
  parameters: { layout: 'fullscreen' },
};
