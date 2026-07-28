import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Header } from '../../packages/react/src/header/header';
import { Link } from '../../packages/react/src/link/link';
import { LinkButton } from '../../packages/react/src/button/button';

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
        <LinkButton href="#assistant">Ask Assistant</LinkButton>
      </>
    ),
  },
} satisfies Meta<typeof Header>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const nav = canvas.getByRole('navigation', { name: 'Menu' });
    const services = canvas.getByRole('link', { name: 'Services' });
    const assistant = canvas.getByRole('link', { name: 'Ask Assistant' });
    const inner = canvasElement.querySelector('.govbb-header__inner');

    await expect(nav).toBeVisible();
    await expect(canvas.queryByRole('button', { name: 'Menu' })).toBeNull();
    await expect(services).toHaveStyle({ fontSize: '20px' });
    await expect(assistant).toHaveStyle({ fontSize: '20px' });
    await expect(inner).toHaveStyle({
      paddingTop: '24px',
      paddingBottom: '24px',
    });
  },
};
export const MenuToggle: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const toggle = await canvas.findByRole('button', { name: 'Menu' });
    const nav = canvasElement.querySelector('.govbb-header__nav');

    await expect(toggle).toBeVisible();
    await expect(nav).not.toBeVisible();
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(nav).toBeVisible();
  },
};
