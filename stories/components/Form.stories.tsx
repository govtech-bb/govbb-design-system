import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ErrorMessage,
  FormGroup,
  Hint,
  Label,
} from '../../packages/react/src/form/form';
import { Input } from '../../packages/react/src/input/input';

const meta = {
  title: 'Components/Form',
  component: FormGroup,
  tags: ['autodocs'],
  render: () => (
    <FormGroup>
      <Label htmlFor="passport-number">Passport number</Label>
      <Hint id="passport-number-description">For example, BB123456</Hint>
      <ErrorMessage id="passport-number-error">
        Enter a passport number
      </ErrorMessage>
      <Input
        id="passport-number"
        aria-describedby="passport-number-description passport-number-error"
        aria-invalid="true"
      />
    </FormGroup>
  ),
} satisfies Meta<typeof FormGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const ErrorState: Story = {};
