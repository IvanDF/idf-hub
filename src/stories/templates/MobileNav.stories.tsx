import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import MobileNav from '@/components/templates/Layout/MobileNav';
import { useState } from 'react';

const MobileNavWrapper = () => {
  const [isOpen, setIsOpen] = useState(true);
  return <MobileNav isOpen={isOpen} onToggle={() => setIsOpen((p) => !p)} onClose={() => setIsOpen(false)} />;
};

const meta: Meta<typeof MobileNavWrapper> = {
  title: 'Templates/MobileNav',
  component: MobileNavWrapper,
  parameters: {
    docs: {
      description: {
        component:
          'Mobile navigation overlay with theme toggle, audio toggle, glitch text, social links, and menu animations.',
      },
    },
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MobileNavWrapper>;

export const Open: Story = {
  args: {},
};
