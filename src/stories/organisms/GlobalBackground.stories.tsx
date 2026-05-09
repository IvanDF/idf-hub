import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import GlobalBackground from '@/components/organisms/Background';

const meta: Meta<typeof GlobalBackground> = {
  title: 'Organisms/GlobalBackground',
  component: GlobalBackground,
  parameters: {
    docs: {
      description: {
        component:
          'Full-screen background layer with animated gradient effects. Renders behind all page content.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof GlobalBackground>;

export const Default: Story = {
  args: {},
};
