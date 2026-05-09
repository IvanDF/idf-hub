import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import LeftColumn from '@/components/templates/Layout/LeftColumn';

const meta: Meta<typeof LeftColumn> = {
  title: 'Templates/LeftColumn',
  component: LeftColumn,
  parameters: {
    docs: {
      description: {
        component:
          'Left sidebar column with command palette trigger, logo, name, and rotating role title.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof LeftColumn>;

export const Default: Story = {
  args: {},
};
