import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { FileUpload } from '../../packages/react/src/file-upload/file-upload';

const removeFile = fn();
const meta = {
  title: 'Components/File upload',
  component: FileUpload,
  tags: ['autodocs'],
  args: {
    title: 'Upload proof of address',
    subtitle: 'Attach a PDF or image file',
    maxSize: 'Maximum size: 25MB',
  },
} satisfies Meta<typeof FileUpload>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const WithFile: Story = {
  args: { files: [{ name: 'proof-of-address.pdf', onRemove: removeFile }] },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: 'Remove proof-of-address.pdf' }),
    );
    await expect(removeFile).toHaveBeenCalledOnce();
  },
};
