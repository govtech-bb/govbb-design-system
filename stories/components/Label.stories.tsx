import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ErrorMessage,
  FormGroup,
  Hint,
  Label,
} from '../../packages/react/src/form/form';
import { Input } from '../../packages/react/src/input/input';

const meta = {
  title: 'Components/Label',
  component: Label,
  tags: ['autodocs'],
  render: () => (
    <FormGroup>
      <Label htmlFor="email">Email address</Label>
      <Hint id="email-description">We will only use this to contact you.</Hint>
      <Input id="email" type="email" aria-describedby="email-description" />
    </FormGroup>
  ),
} satisfies Meta<typeof Label>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithHint: Story = {};
export const WithError: Story = {
  render: () => (
    <FormGroup>
      <Label htmlFor="email-error">Email address</Label>
      <ErrorMessage id="email-error-message">
        Enter a valid email address
      </ErrorMessage>
      <Input
        id="email-error"
        aria-describedby="email-error-message"
        aria-invalid="true"
      />
    </FormGroup>
  ),
};
