import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import AudioToggle from '@/components/atoms/audio-toggle';

const meta: Meta<typeof AudioToggle> = {
  title: 'Atoms/AudioToggle',
  component: AudioToggle,
  parameters: {
    docs: {
      description: {
        component:
          'Audio control widget with play/pause and mute toggle buttons. Requires AudioProvider context.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AudioToggle>;

export const Default: Story = {
  args: {},
};

export const WithClassName: Story = {
  args: {
    className: 'custom-class',
  },
};
