import type { Meta, StoryObj } from '@storybook/react';
// import { fn } from '@storybook/test';
import { ClipCard } from './index';
import { IClipCard } from './ClipCard';

const meta: Meta<typeof ClipCard> = {
  component: ClipCard,
};

export default meta;

type Story = StoryObj<typeof ClipCard>;

const clipCardProps: IClipCard = {
  title: 'Clip Title',
  description: 'Clip Description',
  timestamp: '09-09-2002',
  attachmentsCount: 5
}

export const Primary: Story = {
  args: { ...clipCardProps },
}