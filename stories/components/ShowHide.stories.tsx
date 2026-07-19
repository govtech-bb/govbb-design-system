import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { ShowHide } from '../../packages/react/src/show-hide/show-hide';

const meta = {
  title: 'Components/Show hide',
  component: ShowHide,
  tags: ['autodocs'],
  args: {
    summary: 'Help with this form',
    children: (
      <p>Find the document number on the photo page of your passport.</p>
    ),
  },
} satisfies Meta<typeof ShowHide>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {};
export const Opens: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByText('Help with this form'));
    await expect(canvas.getByText(/Find the document number/)).toBeVisible();
  },
};
