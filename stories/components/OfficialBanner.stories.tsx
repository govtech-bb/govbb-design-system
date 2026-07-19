import type { Meta, StoryObj } from '@storybook/react-vite';
import { OfficialBanner } from '../../packages/react/src/official-banner/official-banner';

const meta = {
  title: 'Components/Official banner',
  component: OfficialBanner,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    crestSrc: '/assets/images/govbb-crest.svg',
    children: 'Official government website',
    linkHref: '#learn-more',
    linkLabel: 'Learn more',
  },
} satisfies Meta<typeof OfficialBanner>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
