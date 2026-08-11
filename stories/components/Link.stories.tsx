import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link } from '../../packages/react/src/link/link';

const meta = {
  title: 'Components/Link',
  component: Link,
  tags: ['autodocs'],
  args: { href: '#service', children: 'Register a birth' },
} satisfies Meta<typeof Link>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const NoVisitedColour: Story = { args: { noVisited: true } };
export const UnderlineOnHover: Story = { args: { noUnderline: true } };
export const External: Story = {
  args: {
    children: 'Visit an external service',
    href: 'https://www.gov.bb',
    external: true,
  },
};
