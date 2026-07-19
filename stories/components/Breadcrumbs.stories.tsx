import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumbs } from '../../packages/react/src/breadcrumbs/breadcrumbs';

const meta = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
  args: {
    items: [
      { href: '#home', label: 'Home' },
      { href: '#services', label: 'Services' },
      { href: '#births', label: 'Births', current: true },
    ],
  },
} satisfies Meta<typeof Breadcrumbs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const CollapsesOnMobile: Story = { args: { collapseOnMobile: true } };
