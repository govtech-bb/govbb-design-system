import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../packages/react/src/button/button';
import { ButtonGroup } from '../../packages/react/src/button-group/button-group';

const meta = {
  title: 'Components/Button group',
  component: ButtonGroup,
  tags: ['autodocs'],
  render: (args) => (
    <ButtonGroup {...args}>
      <Button>Save and continue</Button>
      <Button variant="secondary">Save as draft</Button>
    </ButtonGroup>
  ),
} satisfies Meta<typeof ButtonGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Vertical: Story = { args: { vertical: true } };
