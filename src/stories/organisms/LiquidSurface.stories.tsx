import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import LiquidSurface from '@/components/organisms/liquid-surface';

const meta: Meta<typeof LiquidSurface> = {
  title: 'Organisms/LiquidSurface',
  component: LiquidSurface,
  parameters: {
    docs: {
      description: {
        component:
          'WebGL liquid surface with custom shader material that responds to mouse interaction.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '100%', height: 500, position: 'relative' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof LiquidSurface>;

export const Default: Story = {
  args: {},
};
