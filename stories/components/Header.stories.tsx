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
    const header = canvasElement.querySelector('.govbb-header');
    const nav = canvas.getByRole('navigation', { name: 'Menu' });
    const services = canvas.getByRole('link', { name: 'Services' });
    const assistant = canvas.getByRole('link', { name: 'Ask Assistant' });
    const inner = canvasElement.querySelector('.govbb-header__inner');
    const navInner = canvasElement.querySelector('.govbb-header__nav-inner');

    await expect(nav).toBeVisible();
    await expect(canvas.queryByRole('button', { name: 'Menu' })).toBeNull();
    await expect(nav.parentElement).toBe(inner);
    await expect(header).toHaveStyle({ backgroundColor: 'rgb(255, 199, 38)' });
    await expect(nav).toHaveStyle({ backgroundColor: 'rgba(0, 0, 0, 0)' });
    await expect(navInner).toHaveStyle({ flexDirection: 'row' });
    await expect(services).toHaveStyle({
      color: 'rgb(0, 0, 0)',
      textDecorationLine: 'none',
    });
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
    const navInner = canvasElement.querySelector('.govbb-header__nav-inner');

    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveStyle({
      color: 'rgb(0, 101, 74)',
      fontSize: '20px',
      textDecorationLine: 'underline',
    });
    await expect(nav).not.toBeVisible();
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(nav).toBeVisible();
    await expect(nav).toHaveStyle({
      backgroundColor: 'rgb(229, 233, 242)',
    });
    await expect(navInner).toHaveStyle({ flexDirection: 'column' });

    const services = canvas.getByRole('link', { name: 'Services' });
    const assistant = canvas.getByRole('link', { name: 'Ask Assistant' });
    await expect(assistant.getBoundingClientRect().top).toBeLessThan(
      services.getBoundingClientRect().top,
    );
    await expect(assistant.getBoundingClientRect().width).toBeCloseTo(
      navInner?.getBoundingClientRect().width ?? 0,
      0,
    );
  },
};
