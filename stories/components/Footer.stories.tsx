import type { Meta, StoryObj } from '@storybook/react-vite';
import { Footer } from '../../packages/react/src/footer/footer';

const meta = {
  title: 'Components/Footer',
  component: Footer,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    coatSrc: '/assets/images/govbb-crest.svg',
    copy: '© 2026 Government of Barbados',
    links: [
      { href: '#privacy', label: 'Privacy' },
      { href: '#cookies', label: 'Cookies' },
      { href: '#accessibility', label: 'Accessibility' },
    ],
  },
} satisfies Meta<typeof Footer>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
