import type { Meta, StoryObj } from '@storybook/react';
// import { fn } from '@storybook/test';
import { ClipCard } from './index';
import { IClipCard } from './ClipCard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/context';
import { BrowserRouter as Router } from 'react-router-dom';

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

const clipCardWithoutAttachments: IClipCard = {
  ...clipCardProps,
  attachmentsCount: undefined
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: Infinity, refetchOnMount: true } },
})


export const Primary: Story = {
  args: { ...clipCardProps },
  decorators: [
    (Story) => {
      queryClient.setQueryData([QUERY_KEYS.CREATE_CLIP], {
        //... set your mocked data here
      });
      return (
        <QueryClientProvider client={queryClient}>
          <Router><Story /></Router>
        </QueryClientProvider>
      )
    }
  ],
}

export const Secondary: Story = {
  args: clipCardWithoutAttachments,
  decorators: [
    (Story) => {
      queryClient.setQueryData(["cash-key"], {
        //... set your mocked data here
      });
      return (
        <QueryClientProvider client={queryClient}>
          <Router><Story /></Router>
        </QueryClientProvider>
      )
    }
  ],
}

export const ErrorClip: Story = {
  args: {
    ...clipCardProps,
    error: new Error('Something went wrong'),
    isLoading: false
  },
  decorators: [
    (Story) => {
      queryClient.setQueryData(["cash-key"], {
        //... set your mocked data here
      });
      return (
        <QueryClientProvider client={queryClient}>
          <Router><Story /></Router>
        </QueryClientProvider>
      )
    }
  ],
}