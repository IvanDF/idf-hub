import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import LogoMorph from '@/components/atoms/logo-morph';

const meta: Meta<typeof LogoMorph> = {
  title: 'Atoms/LogoMorph',
  component: LogoMorph,
  parameters: {
    docs: {
      description: {
        component:
          'Animated iDF logo mark with stroke path-draw animation. In assemble mode each path draws itself stroke-first then fills in. Respects prefers-reduced-motion.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 40 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof LogoMorph>;

export const Default: Story = {
  args: {
    size: 80,
  },
};

export const Small: Story = {
  args: {
    size: 40,
  },
};

export const Large: Story = {
  args: {
    size: 160,
  },
};

export const CustomColor: Story = {
  args: {
    size: 80,
    color: '#a78bfa',
  },
};

export const SecondaryColor: Story = {
  args: {
    size: 80,
    color: '#3b82f6',
  },
};
