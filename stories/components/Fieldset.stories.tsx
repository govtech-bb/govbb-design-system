import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Fieldset, Hint } from '../../packages/react/src/form/form';
import { Input } from '../../packages/react/src/input/input';

const meta = {
  title: 'Components/Fieldset',
  component: Fieldset,
  tags: ['autodocs'],
  args: { legend: 'Your address' },
  render: (args) => (
    <Fieldset {...args}>
      <Hint>Enter the address where you usually live.</Hint>
      <Input
        label="Address line 1"
        name="address-line-1"
        description="Include the building number"
      />
      <Input label="Town or city" name="town" />
    </Fieldset>
  ),
} satisfies Meta<typeof Fieldset>;
export default meta;
type Story = StoryObj<typeof meta>;

const gapBelow = (heading: Element, hint: Element) =>
  hint.getBoundingClientRect().top - heading.getBoundingClientRect().bottom;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const legend = canvasElement.querySelector('.govbb-fieldset__legend');
    const label = canvasElement.querySelector('.govbb-label');

    await expect(gapBelow(legend!, legend!.nextElementSibling!)).toBeCloseTo(
      gapBelow(label!, label!.nextElementSibling!),
      0,
    );
  },
};
