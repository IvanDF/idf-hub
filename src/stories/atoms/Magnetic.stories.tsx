import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Magnetic from '@/components/atoms/magnetic';
import styles from '../story-frame.module.scss';

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
      <div className={styles.centeredTall}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Magnetic>;

export const Default: Story = {
  args: {
    children: <button className={styles.buttonVolta}>Hover Me</button>,
    strength: 0.5,
  },
};

export const StrongPull: Story = {
  args: {
    children: <button className={styles.buttonVoltaSoft}>Strong Pull</button>,
    strength: 0.8,
  },
};

export const Subtle: Story = {
  args: {
    children: <button className={styles.buttonBlue}>Subtle</button>,
    strength: 0.2,
  },
};
