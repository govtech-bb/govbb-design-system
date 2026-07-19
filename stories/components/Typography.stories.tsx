import type { Meta, StoryObj } from '@storybook/react-vite';
import { Heading, Text } from '../../packages/react/src/typography/typography';

const meta = {
  title: 'Styles/Typography',
  component: Heading,
  tags: ['autodocs'],
  render: () => (
    <div>
      <Heading as="h1" size="display">
        Government services
      </Heading>
      <Heading as="h2">Apply for a passport</Heading>
      <Heading as="h3">Before you start</Heading>
      <Text size="body-lg">
        Use this service to apply for or renew a Barbados passport.
      </Text>
      <Text>Standard body text supports the main guidance on a page.</Text>
      <Text size="caption">Last updated 19 July 2026</Text>
    </div>
  ),
} satisfies Meta<typeof Heading>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Scale: Story = {};
