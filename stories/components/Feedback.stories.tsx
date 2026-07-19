import type { Meta, StoryObj } from '@storybook/react-vite';
import { Feedback } from '../../packages/react/src/feedback/feedback';
import { Link } from '../../packages/react/src/link/link';

const meta = {
  title: 'Components/Feedback',
  component: Feedback,
  tags: ['autodocs'],
  args: { heading: 'Was this helpful?' },
  render: (args) => (
    <Feedback {...args}>
      <p>Give us your feedback about this page.</p>
      <Link href="#feedback">Help us improve this service</Link>
    </Feedback>
  ),
} satisfies Meta<typeof Feedback>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
