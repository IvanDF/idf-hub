import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import RightColumn from '@/components/templates/Layout/RightColumn';

const meta: Meta<typeof RightColumn> = {
  title: 'Templates/RightColumn',
  component: RightColumn,
  parameters: {
    docs: {
      description: {
        component:
          'Right sidebar column with theme toggle button and social media icon links.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RightColumn>;

export const Default: Story = {
  args: {},
};
