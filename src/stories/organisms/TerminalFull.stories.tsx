import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Terminal from '@/components/organisms/Terminal';

const meta: Meta<typeof Terminal> = {
  title: 'Organisms/Terminal',
  component: Terminal,
  parameters: {
    docs: {
      description: {
        component:
          'Full terminal overlay with command execution, autocomplete, snake game, easter eggs, and voice shout integration.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Terminal>;

export const SiteContext: Story = {
  args: {
    context: 'site',
  },
};

export const AdminContext: Story = {
  args: {
    context: 'admin',
  },
};
