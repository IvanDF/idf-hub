import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import BusinessCard3D from '@/components/organisms/business-card-3d';

const BusinessCard3DWrapper = (args: { style: 'normal' | 'code' | 'design' }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <div style={{ width: '100%', height: 500, position: 'relative' }}>
      <BusinessCard3D
        style={args.style}
        isFlipped={isFlipped}
        onFlip={() => setIsFlipped((p) => !p)}
        reducedMotion={false}
      />
    </div>
  );
};

const meta: Meta<typeof BusinessCard3DWrapper> = {
  title: 'Organisms/BusinessCard3D',
  component: BusinessCard3DWrapper,
  parameters: {
    docs: {
      description: {
        component:
          'Full-viewport Three.js Canvas rendering an interactive 3D business card with flip animation.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BusinessCard3DWrapper>;

export const Normal: Story = {
  args: { style: 'normal' },
};

export const Code: Story = {
  args: { style: 'code' },
};

export const Design: Story = {
  args: { style: 'design' },
};
