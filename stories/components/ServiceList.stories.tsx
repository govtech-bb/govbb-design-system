import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ServiceList,
  ServiceListItem,
} from '../../packages/react/src/service-list/service-list';

const meta = {
  title: 'Components/Service list',
  component: ServiceList,
  tags: ['autodocs'],
  render: (args) => (
    <ServiceList {...args}>
      <ServiceListItem
        href="#family"
        description="Managing key life events and family responsibilities"
        tag="Information service"
      >
        Family, birth and relationships
      </ServiceListItem>
      <ServiceListItem
        href="#travel"
        description="Passports, vehicles and getting around Barbados"
      >
        Travel and transport
      </ServiceListItem>
    </ServiceList>
  ),
} satisfies Meta<typeof ServiceList>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Cards: Story = {};
export const Signposts: Story = { args: { variant: 'signpost' } };
