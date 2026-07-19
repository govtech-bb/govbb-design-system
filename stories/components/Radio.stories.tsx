import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Radio, RadioGroup } from '../../packages/react/src/radio/radio';

const meta = {
  title: 'Components/Radio',
  component: RadioGroup,
  tags: ['autodocs'],
  render: (args) => {
    const [value, setValue] = useState('yes');
    return (
      <RadioGroup {...args} value={value} onValueChange={setValue}>
        <Radio value="yes" label="Yes" />
        <Radio value="no" label="No" />
        <Radio
          value="other"
          label="Another answer"
          conditional={<p>Tell us your answer.</p>}
        />
      </RadioGroup>
    );
  },
  args: {
    legend: 'Are you a Barbados citizen?',
    name: 'citizen',
    hint: 'Choose one option',
    children: null,
  },
} satisfies Meta<typeof RadioGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Group: Story = {
  args: {},
  play: async ({ canvas, userEvent }) => {
    const no = canvas.getByRole('radio', { name: 'No' });
    await userEvent.click(no);
    await expect(no).toBeChecked();
  },
};
export const Error: Story = {
  args: {
    legend: 'Are you a Barbados citizen?',
    name: 'citizen',
    children: null,
    hint: undefined,
    error: 'Select yes or no',
  },
};
