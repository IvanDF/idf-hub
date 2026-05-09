import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import AudioPrompt from '@/components/molecules/audio-prompt';

const meta: Meta<typeof AudioPrompt> = {
  title: 'Molecules/AudioPrompt',
  component: AudioPrompt,
  parameters: {
    docs: {
      description: {
        component:
          'Modal prompt that asks the user to enable ambient audio on their first visit. Requires AudioProvider context.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AudioPrompt>;

export const Default: Story = {
  args: {},
};
