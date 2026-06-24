import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import TimeVortex from '@/components/organisms/time-vortex';
import styles from '../story-frame.module.scss';

const meta: Meta<typeof TimeVortex> = {
  title: 'Organisms/TimeVortex',
  component: TimeVortex,
  parameters: {
    docs: {
      description: {
        component:
          'WebGL shader-based time vortex animation with particle system and nebula colors.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className={styles.frameWide}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TimeVortex>;

export const Default: Story = {
  args: {},
};
