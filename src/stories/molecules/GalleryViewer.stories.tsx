import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import GalleryViewer from '@/components/molecules/gallery-viewer';

const meta: Meta<typeof GalleryViewer> = {
  title: 'Molecules/GalleryViewer',
  component: GalleryViewer,
  parameters: {
    docs: {
      description: {
        component:
          'Image gallery with thumbnail-strip navigation; renders a side-by-side compare layout for exactly two images.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof GalleryViewer>;

export const SingleImage: Story = {
  args: {
    images: ['/assets/placeholder.svg'],
    projectTitle: 'Example Project',
  },
};

export const TwoImages: Story = {
  args: {
    images: [
      '/assets/placeholder.svg',
      '/assets/placeholder.svg',
    ],
    projectTitle: 'Compare Mode',
  },
};

export const MultipleImages: Story = {
  args: {
    images: [
      '/assets/placeholder.svg',
      '/assets/placeholder.svg',
      '/assets/placeholder.svg',
    ],
    projectTitle: 'Gallery Demo',
  },
};
