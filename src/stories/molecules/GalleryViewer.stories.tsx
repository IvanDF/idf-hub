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
    images: ['https://raw.githubusercontent.com/IvanDF/proj-gabberg-icard/main/public/screenshot.png'],
    projectTitle: 'Example Project',
  },
};

export const TwoImages: Story = {
  args: {
    images: [
      'https://raw.githubusercontent.com/IvanDF/proj-gabberg-icard/main/public/screenshot.png',
      'https://raw.githubusercontent.com/IvanDF/proj-gabberg-icard/main/public/screenshot.png',
    ],
    projectTitle: 'Compare Mode',
  },
};

export const MultipleImages: Story = {
  args: {
    images: [
      'https://raw.githubusercontent.com/IvanDF/proj-gabberg-icard/main/public/screenshot.png',
      'https://raw.githubusercontent.com/IvanDF/proj-gabberg-icard/main/public/screenshot.png',
      'https://raw.githubusercontent.com/IvanDF/proj-gabberg-icard/main/public/screenshot.png',
    ],
    projectTitle: 'Gallery Demo',
  },
};
