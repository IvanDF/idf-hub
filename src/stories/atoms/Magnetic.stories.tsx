import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Magnetic from '@/components/atoms/magnetic';

const meta: Meta<typeof Magnetic> = {
  title: 'Atoms/Magnetic',
  component: Magnetic,
  parameters: {
    docs: {
      description: {
        component:
          'Magnetic hover effect wrapper — pulls children toward the cursor using spring physics.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200, padding: 40 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Magnetic>;

export const Default: Story = {
  args: {
    children: <button style={{ padding: '12px 24px', border: '2px solid #8b5cf6', borderRadius: 8, background: 'transparent', color: '#8b5cf6', cursor: 'pointer', fontSize: 16 }}>Hover Me</button>,
    strength: 0.5,
  },
};

export const StrongPull: Story = {
  args: {
    children: <button style={{ padding: '12px 24px', border: '2px solid #a78bfa', borderRadius: 8, background: 'transparent', color: '#a78bfa', cursor: 'pointer', fontSize: 16 }}>Strong Pull</button>,
    strength: 0.8,
  },
};

export const Subtle: Story = {
  args: {
    children: <button style={{ padding: '12px 24px', border: '2px solid #3b82f6', borderRadius: 8, background: 'transparent', color: '#3b82f6', cursor: 'pointer', fontSize: 16 }}>Subtle</button>,
    strength: 0.2,
  },
};
