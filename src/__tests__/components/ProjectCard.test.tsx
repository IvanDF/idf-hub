import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useAudio } from '@/context/AudioContext';
import ProjectCard from '@/components/molecules/project-card';
import type { Project } from '@/types/project';

jest.mock('@/context/AudioContext');

const mockMotionValue = {
  get: jest.fn(() => 0),
  set: jest.fn(),
  onChange: jest.fn(),
  destroy: jest.fn(),
};

jest.mock('framer-motion', () => {
  const MockMotionDiv = React.forwardRef(
    (props: Record<string, unknown>, ref: React.Ref<HTMLDivElement>) => {
      const { ...rest } = props;
      return React.createElement('div', { ...rest, ref });
    },
  );
  MockMotionDiv.displayName = 'MotionDiv';

  return {
    motion: {
      div: MockMotionDiv,
    },
    useMotionValue: jest.fn(() => ({ ...mockMotionValue })),
    useSpring: jest.fn(() => ({ ...mockMotionValue })),
    useTransform: jest.fn(() => ({ ...mockMotionValue })),
    useMotionTemplate: jest.fn(() => 'radial-gradient(600px circle at 0px 0px, rgba(255,255,255,0.1), transparent 40%)'),
  };
});

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { ...rest } = props;
    return React.createElement('img', rest);
  },
}));

const defaultAudioMock = {
  isEnabled: false,
  isMuted: false,
  isPlaying: false,
  isStarting: false,
  currentTrack: '',
  availableTracks: [],
  toggleAudio: jest.fn(),
  toggleMute: jest.fn(),
  playClick: jest.fn(),
  playHover: jest.fn(),
  playLightOn: jest.fn(),
  requestAudioAccess: jest.fn().mockResolvedValue(undefined),
};

const mockProject: Project = {
  id: 'test-project',
  title: 'Test Project',
  description: 'A test project description',
  category: 'DEV',
  platform: 'web',
  tags: ['react', 'typescript'],
  year: '2024',
  status: 'live',
  interaction: 'tilt',
  layout: 'wide',
  media: {
    thumbnail: '/projects/test/thumb.jpg',
    fit: 'contain',
  },
};

const mockProjectNoThumbnail: Project = {
  id: 'no-thumb',
  title: 'No Thumbnail',
  description: 'A project without thumbnail',
  category: 'CREATIVE',
  platform: 'figma',
  tags: ['design'],
  year: '2024',
  media: {
    thumbnail: '/assets/placeholder.svg',
    fit: 'cover',
  },
};

const handleClick = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  (useAudio as jest.Mock).mockReturnValue(defaultAudioMock);
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
});

describe('ProjectCard', () => {
  it('renders project title', () => {
    render(<ProjectCard project={mockProject} onClick={handleClick} />);
    expect(screen.getByText('Test Project')).toBeInTheDocument();
  });

  it('renders project description', () => {
    render(<ProjectCard project={mockProject} onClick={handleClick} />);
    expect(screen.getByText('A test project description')).toBeInTheDocument();
  });

  it('renders project category', () => {
    render(<ProjectCard project={mockProject} onClick={handleClick} />);
    expect(screen.getByText('DEV')).toBeInTheDocument();
  });

  it('renders platform label', () => {
    render(<ProjectCard project={mockProject} onClick={handleClick} />);
    expect(screen.getByText('web')).toBeInTheDocument();
  });

  it('renders status badge', () => {
    render(<ProjectCard project={mockProject} onClick={handleClick} />);
    expect(screen.getByText('live')).toBeInTheDocument();
  });

  it('renders year', () => {
    render(<ProjectCard project={mockProject} onClick={handleClick} />);
    expect(screen.getByText('2024')).toBeInTheDocument();
  });

  it('renders tags with hash prefix', () => {
    render(<ProjectCard project={mockProject} onClick={handleClick} />);
    expect(screen.getByText('#react')).toBeInTheDocument();
    expect(screen.getByText('#typescript')).toBeInTheDocument();
  });

  it('renders thumbnail image when available', () => {
    render(<ProjectCard project={mockProject} onClick={handleClick} />);
    const img = screen.getByAltText('Test Project');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/projects/test/thumb.jpg');
  });

  it('renders generated cover when no thumbnail', () => {
    render(<ProjectCard project={mockProjectNoThumbnail} onClick={handleClick} />);
    const els = screen.getAllByText('No Thumbnail');
    expect(els.length).toBe(2);
    const figmaEls = screen.getAllByText('figma');
    expect(figmaEls.length).toBe(2);
  });

  it('has role button and tabIndex 0', () => {
    render(<ProjectCard project={mockProject} onClick={handleClick} />);
    const card = screen.getByRole('button');
    expect(card).toHaveAttribute('tabIndex', '0');
  });

  it('calls onClick and playClick on click', async () => {
    const user = userEvent.setup();
    render(<ProjectCard project={mockProject} onClick={handleClick} />);
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(defaultAudioMock.playClick).toHaveBeenCalledTimes(1);
  });

  it('calls playHover on mouse enter', async () => {
    const user = userEvent.setup();
    render(<ProjectCard project={mockProject} onClick={handleClick} />);
    await user.hover(screen.getByRole('button'));
    expect(defaultAudioMock.playHover).toHaveBeenCalledTimes(1);
  });

  it('triggers onClick on Enter key', () => {
    render(<ProjectCard project={mockProject} onClick={handleClick} />);
    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalled();
  });

  it('triggers onClick on Space key', () => {
    render(<ProjectCard project={mockProject} onClick={handleClick} />);
    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: ' ' });
    expect(handleClick).toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(<ProjectCard project={mockProject} onClick={handleClick} className="custom-card" />);
    const card = screen.getByRole('button');
    expect(card.className).toContain('custom-card');
  });

  it('renders category-specific CSS class', () => {
    render(<ProjectCard project={mockProject} onClick={handleClick} />);
    const card = screen.getByRole('button');
    expect(card.className).toContain('dev');
  });
});
