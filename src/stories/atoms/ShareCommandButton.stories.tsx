import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ShareCommandButton from '@/components/atoms/share-command-button';

const meta: Meta<typeof ShareCommandButton> = {
  title: 'Atoms/ShareCommandButton',
  component: ShareCommandButton,
  parameters: {
    docs: {
      description: {
        component:
          'Generates a shareable deep-link URL for a terminal command and copies it to the clipboard or triggers the Web Share API.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ShareCommandButton>;

export const Inline: Story = {
  args: {
    command: 'theme',
    variant: 'inline',
  },
};

export const Standalone: Story = {
  args: {
    command: 'lab',
    variant: 'standalone',
    label: 'Share Lab',
  },
};

export const StandaloneDefaultLabel: Story = {
  args: {
    command: 'snake',
    variant: 'standalone',
  },
};
