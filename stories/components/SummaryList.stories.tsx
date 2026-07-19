import type { Meta, StoryObj } from '@storybook/react-vite';
import { SummaryList } from '../../packages/react/src/summary-list/summary-list';

const rows = [
  {
    key: 'Name',
    value: 'Alex Nurse',
    actions: { href: '#name', label: 'Change', visuallyHiddenText: 'name' },
  },
  {
    key: 'Date of birth',
    value: '14 March 1990',
    actions: {
      href: '#dob',
      label: 'Change',
      visuallyHiddenText: 'date of birth',
    },
  },
  { key: 'Parish', value: 'Saint Michael' },
];
const meta = {
  title: 'Components/Summary list',
  component: SummaryList,
  tags: ['autodocs'],
  args: { rows },
} satisfies Meta<typeof SummaryList>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithSection: Story = {
  args: {
    section: {
      title: 'Personal details',
      action: {
        href: '#details',
        label: 'Change',
        visuallyHiddenText: 'personal details',
      },
    },
  },
};
