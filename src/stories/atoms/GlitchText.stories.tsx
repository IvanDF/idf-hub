import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import GlitchText from '@/components/atoms/glitch-text';

const meta: Meta<typeof GlitchText> = {
  title: 'Atoms/GlitchText',
  component: GlitchText,
  parameters: {
    docs: {
      description: {
        component:
          'Text element that scrambles characters on hover, progressively revealing the original string.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof GlitchText>;

export const Default: Story = {
  args: {
    text: 'Hello World',
  },
};

export const ShortText: Story = {
  args: {
    text: 'iDF',
  },
};

export const LongText: Story = {
  args: {
    text: 'FRONT-END DEVELOPER',
  },
};

export const FastScramble: Story = {
  args: {
    text: 'FAST MODE',
    scrambleSpeed: 15,
  },
};

export const SlowScramble: Story = {
  args: {
    text: 'SLOW MODE',
    scrambleSpeed: 60,
  },
};
