import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import BusinessCard from '@/components/organisms/brand-page';

const meta: Meta<typeof BusinessCard> = {
  title: 'Organisms/BusinessCard',
  component: BusinessCard,
  parameters: {
    docs: {
      description: {
        component:
          'Brand identity card with four visual variants: dev, creative, general, and maker. Each variant has a unique background pattern.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BusinessCard>;

export const Developer: Story = {
  args: {
    variant: 'dev',
    name: 'Ivan D\'F',
    title: 'Full-stack Developer',
    email: 'ivan@idf.hub',
    website: 'idf-hub.vercel.app',
  },
};

export const Creative: Story = {
  args: {
    variant: 'creative',
    name: 'Ivan D\'F',
    title: 'Graphic Designer',
    email: 'creative@idf.hub',
    website: 'idf-hub.vercel.app',
  },
};

export const General: Story = {
  args: {
    variant: 'general',
    name: 'Ivan D\'F',
    title: 'Digital Craftsman',
    email: 'hello@idf.hub',
    website: 'idf-hub.vercel.app',
  },
};

export const Maker: Story = {
  args: {
    variant: 'maker',
    name: 'Ivan D\'F',
    title: 'Hardware Tinkerer',
    email: 'maker@idf.hub',
    website: 'idf-hub.vercel.app',
  },
};
