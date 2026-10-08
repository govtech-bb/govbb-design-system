import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { Button } from '../../packages/react/src/button/button';
import { LinkButton } from '../../packages/react/src/button/button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'ghost', 'text'],
    },
  },
  args: {
    children: 'Continue',
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Cancel',
    variant: 'ghost',
  },
};

export const Text: Story = {
  args: {
    children: 'Remove',
    variant: 'text',
  },
};

export const Negative: Story = {
  args: {
    children: 'Delete application',
    negative: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Link: Story = {
  render: () => <LinkButton href="#start">Start now</LinkButton>,
};

export const ExternalLink: Story = {
  render: () => (
    <LinkButton href="https://www.gov.bb" external>
      Start on an external service
    </LinkButton>
  ),
};

export const Clicked: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};
