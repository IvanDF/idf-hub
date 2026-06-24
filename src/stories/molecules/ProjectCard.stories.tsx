import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ProjectCard from '@/components/molecules/project-card';
import type { Project } from '@/types/project';
import styles from '../story-frame.module.scss';

const mockProject: Project = {
  id: 'example-project',
  title: 'Example Project',
  description: 'A showcase interactive project with tilt effects and dynamic theming.',
  category: 'DEV',
  platform: 'github',
  tags: ['React', 'TypeScript', 'Framer Motion'],
  year: '2025',
  status: 'live',
  interaction: 'tilt',
  layout: 'tall',
  media: {
    thumbnail: '',
  },
  links: {},
};

const meta: Meta<typeof ProjectCard> = {
  title: 'Molecules/ProjectCard',
  component: ProjectCard,
  parameters: {
    docs: {
      description: {
        component:
          'Interactive portfolio card with tilt, spotlight, and glitch hover effects. Uses Framer Motion for GPU-accelerated 3D transforms.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className={styles.projectPreview}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof ProjectCard>;

export const Default: Story = {
  args: {
    project: mockProject,
    onClick: () => {},
  },
};

export const GlitchInteraction: Story = {
  args: {
    project: { ...mockProject, interaction: 'glitch' },
    onClick: () => {},
  },
};

export const SpotlightInteraction: Story = {
  args: {
    project: { ...mockProject, interaction: 'spotlight' },
    onClick: () => {},
  },
};

export const CreativeCategory: Story = {
  args: {
    project: {
      ...mockProject,
      id: 'creative-project',
      title: 'Creative Design',
      description: 'A design-focused creative project with rich visuals.',
      category: 'CREATIVE',
      interaction: 'spotlight',
      media: { thumbnail: '' },
    },
    onClick: () => {},
  },
};

export const MakerCategory: Story = {
  args: {
    project: {
      ...mockProject,
      id: 'maker-project',
      title: 'Hardware Prototype',
      description: 'A physical computing project with Arduino and sensors.',
      category: 'MAKER',
      interaction: 'tilt',
      media: { thumbnail: '' },
    },
    onClick: () => {},
  },
};

export const ArchivedStatus: Story = {
  args: {
    project: {
      ...mockProject,
      id: 'archived-project',
      title: 'Legacy Project',
      description: 'An older project that is no longer actively maintained.',
      status: 'archived',
      media: { thumbnail: '' },
    },
    onClick: () => {},
  },
};
