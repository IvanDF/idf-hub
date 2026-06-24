import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import PageTransition from '@/components/templates/Layout/PageTransition';
import styles from '../story-frame.module.scss';

const meta: Meta<typeof PageTransition> = {
  title: 'Templates/PageTransition',
  component: PageTransition,
  parameters: {
    docs: {
      description: {
        component:
          'Page transition wrapper that animates opacity and vertical position on route changes using Framer Motion.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PageTransition>;

export const Default: Story = {
  args: {
    children: <div className={styles.pageContent}>Page content with fade-in animation</div>,
  },
};
