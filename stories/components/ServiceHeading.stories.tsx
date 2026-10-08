import type { Meta, StoryObj } from '@storybook/react-vite';
import { ServiceHeading } from '../../packages/react/src/service-heading/service-heading';

const meta = {
  title: 'Components/Service heading',
  component: ServiceHeading,
  tags: ['autodocs'],
  args: {
    service: 'Redirect my business',
    children: 'Tell us what position you hold in the business',
    description: 'We ask so we can check you are allowed to make this request.',
  },
  argTypes: {
    as: { control: 'inline-radio', options: ['h1', 'h2'] },
    size: { control: 'select', options: ['display', 'h1', 'h2'] },
  },
} satisfies Meta<typeof ServiceHeading>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A question that needs no extra explanation. */
export const QuestionOnly: Story = {
  args: { description: undefined },
};

/** Outside a service journey — no service name to sit above the heading. */
export const WithoutService: Story = {
  args: { service: undefined, description: undefined },
};
