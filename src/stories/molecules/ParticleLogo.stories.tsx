import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ParticleLogo from '@/components/molecules/particle-logo';
import styles from '../story-frame.module.scss';

const meta: Meta<typeof ParticleLogo> = {
  title: 'Molecules/ParticleLogo',
  component: ParticleLogo,
  parameters: {
    docs: {
      description: {
        component:
          'Three.js particle system that renders the iDF logo as interactive floating particles. Uses R3F Canvas internally.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className={styles.frameMedium}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ParticleLogo>;

export const Default: Story = {
  args: {},
};
