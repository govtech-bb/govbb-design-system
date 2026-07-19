import type { Meta, StoryObj } from '@storybook/react-vite';
import { ErrorSummary } from '../../packages/react/src/error-summary/error-summary';

const meta = {
  title: 'Components/Error summary',
  component: ErrorSummary,
  tags: ['autodocs'],
  args: {
    errors: [
      { href: '#full-name', label: 'Enter your full name' },
      { href: '#email', label: 'Enter a valid email address' },
    ],
  },
  render: (args) => (
    <>
      <ErrorSummary {...args} />
      <label htmlFor="full-name">Full name</label>
      <input id="full-name" />
      <label htmlFor="email">Email</label>
      <input id="email" />
    </>
  ),
} satisfies Meta<typeof ErrorSummary>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
