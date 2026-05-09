import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import FusRoDah from '@/components/organisms/fus-ro-dah/FusRoDah';

const meta: Meta<typeof FusRoDah> = {
  title: 'Organisms/FusRoDah',
  component: FusRoDah,
  parameters: {
    docs: {
      description: {
        component:
          'Visual effects overlay for the Skyrim "Fus Ro Dah" easter egg. Shows shockwave rings and wind streaks at different shout levels. Requires VoiceShoutProvider.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FusRoDah>;

export const Default: Story = {
  args: {},
};
