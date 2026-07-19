import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../packages/react/src/button/button';
import { Payment } from '../../packages/react/src/payment/payment';

const rows = [
  { key: 'Service', value: 'Passport renewal' },
  { key: 'Amount', value: '$150.00' },
];
const meta = {
  title: 'Components/Payment',
  component: Payment,
  tags: ['autodocs'],
  args: {
    title: 'Complete your payment',
    description: 'Check the details before continuing.',
    rows,
    note: 'You will be redirected to EZ Pay.',
  },
  render: (args) => (
    <Payment {...args}>
      <Button>Continue to payment</Button>
    </Payment>
  ),
} satisfies Meta<typeof Payment>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Confirmation: Story = {};
export const Success: Story = {
  args: {
    outcome: 'success',
    title: 'Your payment was successful',
    description: 'Your reference is BB-10482.',
    note: undefined,
  },
  render: (args) => <Payment {...args} />,
};
export const Failed: Story = {
  args: {
    outcome: 'failed',
    title: 'Your payment was not completed',
    description: 'No money has been taken.',
    note: undefined,
  },
  render: (args) => (
    <Payment {...args}>
      <Button>Try again</Button>
    </Payment>
  ),
};
