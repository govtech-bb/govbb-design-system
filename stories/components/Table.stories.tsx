import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Table,
  TableCell,
  TableHeader,
} from '../../packages/react/src/table/table';

const meta = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  args: { caption: 'Application fees' },
  render: (args) => (
    <Table {...args}>
      <thead>
        <tr>
          <TableHeader scope="col">Service</TableHeader>
          <TableHeader scope="col" numeric>
            Fee
          </TableHeader>
        </tr>
      </thead>
      <tbody>
        <tr>
          <TableHeader scope="row">Passport renewal</TableHeader>
          <TableCell numeric>$150.00</TableCell>
        </tr>
        <tr>
          <TableHeader scope="row">Birth certificate</TableHeader>
          <TableCell numeric>$25.00</TableCell>
        </tr>
      </tbody>
    </Table>
  ),
} satisfies Meta<typeof Table>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Scrollable: Story = { args: { scrollable: true } };
