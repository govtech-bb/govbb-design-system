import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from '../../packages/react/src/select/select';

const options = [
  { value: '', label: 'Select a parish', disabled: true },
  { value: 'christ-church', label: 'Christ Church' },
  { value: 'st-michael', label: 'Saint Michael' },
  { value: 'st-james', label: 'Saint James' },
];
const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  args: { label: 'Parish', name: 'parish', options, defaultValue: '' },
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Error: Story = { args: { error: 'Select a parish' } };
