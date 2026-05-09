import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SocialIconLink from '@/components/atoms/social-icon-link';

const meta: Meta<typeof SocialIconLink> = {
  title: 'Atoms/SocialIconLink',
  component: SocialIconLink,
  parameters: {
    docs: {
      description: {
        component:
          'Icon-based social link that opens in a new tab. Uses dynamic filter prop for theme-aware icon inversion.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SocialIconLink>;

export const GitHub: Story = {
  args: {
    href: 'https://github.com/IvanDF',
    src: '/icons/github.svg',
    alt: 'GitHub',
  },
};

export const LargeIcon: Story = {
  args: {
    href: 'https://github.com/IvanDF',
    src: '/icons/github.svg',
    alt: 'GitHub',
    iconSize: 32,
  },
};

export const InvertedOnDark: Story = {
  args: {
    href: 'https://dribbble.com/',
    src: '/icons/dribbble.svg',
    alt: 'Dribbble',
    invertOnDark: true,
  },
};
