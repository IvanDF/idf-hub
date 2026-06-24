import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import GravityWell from '@/components/organisms/gravity-well';
import styles from '../story-frame.module.scss';

const meta: Meta<typeof GravityWell> = {
  title: 'Organisms/GravityWell',
  component: GravityWell,
  parameters: {
    docs: {
      description: {
        component:
          'Interactive Three.js particle field with gravitational attraction toward the cursor.',
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
type Story = StoryObj<typeof GravityWell>;

export const Default: Story = {
  args: {},
};
