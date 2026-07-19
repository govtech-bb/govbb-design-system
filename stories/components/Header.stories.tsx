import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Header } from '../../packages/react/src/header/header';
import { Link } from '../../packages/react/src/link/link';
import { Search } from '../../packages/react/src/search/search';

const meta = {
  title: 'Components/Header',
  component: Header,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    logoSrc: '/assets/images/govbb-logo.svg',
    nav: (
      <>
        <Link href="#services" noVisited>
          Services
        </Link>
        <Link href="#government" noVisited>
          Government
        </Link>
      </>
    ),
  },
  render: (args) => (
    <Header {...args}>
      <Search borderless />
    </Header>
  ),
} satisfies Meta<typeof Header>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const MenuToggle: Story = {
  play: async ({ canvas, userEvent }) => {
    const toggle = await canvas.findByRole('button', { name: 'Menu' });
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  },
};
