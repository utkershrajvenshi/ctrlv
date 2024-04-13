import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { InputField } from './index';

const meta: Meta<typeof InputField> = {
  component: InputField,
};

export default meta;

type Story = StoryObj<typeof InputField>;

export const Primary: Story = {
  args: {
    placeholder: 'Common placeholder text',
    type: 'text',
    className: 'w-fit',
    onChange: fn()
  },
}