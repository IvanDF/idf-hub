import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CustomCursor from '@/components/atoms/custom-cursor';

const meta: Meta<typeof CustomCursor> = {
  title: 'Atoms/CustomCursor',
  component: CustomCursor,
  parameters: {
    docs: {
      description: {
        component:
          'Replaces the default system cursor with an interactive, animated cursor. Uses Framer Motion for GPU-accelerated cursor tracking. Disappears on touch devices.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CustomCursor>;

export const Default: Story = {
  args: {},
};
