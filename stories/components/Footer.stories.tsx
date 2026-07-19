import type { Meta, StoryObj } from '@storybook/react-vite';
import { Footer, FooterLink } from '../../packages/react/src/footer/footer';

const meta = {
  title: 'Components/Footer',
  component: Footer,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    coatSrc: '/assets/images/govbb-crest.svg',
    copy: '© 2026 Government of Barbados',
  },
  render: (args) => (
    <Footer {...args}>
      <FooterLink href="#privacy">Privacy</FooterLink>
      <FooterLink href="#cookies">Cookies</FooterLink>
      <FooterLink href="#accessibility">Accessibility</FooterLink>
    </Footer>
  ),
} satisfies Meta<typeof Footer>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
