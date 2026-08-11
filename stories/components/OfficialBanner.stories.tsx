import type { Meta, StoryObj } from '@storybook/react-vite';
import { OfficialBanner } from '../../packages/react/src/official-banner/official-banner';

const meta = {
  title: 'Components/Official banner',
  component: OfficialBanner,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    imageSrc: '/assets/images/govbb-crest.svg',
    imageAlt: '',
    children: 'Official government website',
    showLearnMore: true,
    learnMoreHref: '#learn-more',
    linkLabel: 'Learn more',
  },
} satisfies Meta<typeof OfficialBanner>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
