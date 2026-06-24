import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import RotatingTitle from '@/components/atoms/rotating-title';
import styles from '../story-frame.module.scss';

const meta: Meta<typeof RotatingTitle> = {
  title: 'Atoms/RotatingTitle',
  component: RotatingTitle,
  parameters: {
    docs: {
      description: {
        component:
          'Animated title cycling through professional roles, pausing on hover and navigating on click.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className={styles.centered}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof RotatingTitle>;

export const Default: Story = {
  args: {},
};

export const WithClassName: Story = {
  args: {
    className: 'custom-class',
  },
};
