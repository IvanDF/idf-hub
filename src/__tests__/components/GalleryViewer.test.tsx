import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GalleryViewer from '@/components/molecules/gallery-viewer';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { ...rest } = props;
    return React.createElement('img', rest);
  },
}));

const mockImages = [
  '/projects/test/image1.jpg',
  '/projects/test/image2.jpg',
  '/projects/test/image3.jpg',
];

describe('GalleryViewer', () => {
  it('renders gallery header with storyboard title', () => {
    render(<GalleryViewer images={mockImages} projectTitle="Test Project" />);
    expect(screen.getByText('Storyboard')).toBeInTheDocument();
  });

  it('renders correct number of thumbnails', () => {
    render(<GalleryViewer images={mockImages} projectTitle="Test" />);
    const thumbnails = screen.getAllByRole('button');
    expect(thumbnails).toHaveLength(3);
  });

  it('marks first thumbnail as active by default', () => {
    render(<GalleryViewer images={mockImages} projectTitle="Test" />);
    const buttons = screen.getAllByRole('button');
    expect(buttons[0].className).toContain('active');
  });

  it('switches image on thumbnail click', async () => {
    const user = userEvent.setup();
    render(<GalleryViewer images={mockImages} projectTitle="Test" />);
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[1]);
    expect(buttons[1].className).toContain('active');
    expect(buttons[0].className).not.toContain('active');
  });

  it('navigates with arrow right key', () => {
    render(<GalleryViewer images={mockImages} projectTitle="Test" />);
    const container = screen.getByText('Storyboard').closest('div')!;
    fireEvent.keyDown(container, { key: 'ArrowRight' });
    const buttons = screen.getAllByRole('button');
    expect(buttons[1].className).toContain('active');
  });

  it('wraps around on arrow left at first image', () => {
    render(<GalleryViewer images={mockImages} projectTitle="Test" />);
    const container = screen.getByText('Storyboard').closest('div')!;
    fireEvent.keyDown(container, { key: 'ArrowLeft' });
    const buttons = screen.getAllByRole('button');
    expect(buttons[2].className).toContain('active');
  });

  it('wraps around on arrow right at last image', () => {
    render(<GalleryViewer images={mockImages} projectTitle="Test" />);
    const container = screen.getByText('Storyboard').closest('div')!;
    fireEvent.keyDown(container, { key: 'ArrowRight' });
    fireEvent.keyDown(container, { key: 'ArrowRight' });
    fireEvent.keyDown(container, { key: 'ArrowRight' });
    const buttons = screen.getAllByRole('button');
    expect(buttons[0].className).toContain('active');
  });

  it('shows compare mode for exactly 2 images', () => {
    render(<GalleryViewer images={mockImages.slice(0, 2)} projectTitle="Test" />);
    expect(screen.getByText('Compare A // B')).toBeInTheDocument();
    expect(screen.getByText('Project Lenses')).toBeInTheDocument();
  });

  it('renders thumbnail aria-labels', () => {
    render(<GalleryViewer images={mockImages} projectTitle="Test" />);
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveAttribute('aria-label', 'View frame 1');
    expect(buttons[1]).toHaveAttribute('aria-label', 'View frame 2');
  });

  it('renders frame counter', () => {
    render(<GalleryViewer images={mockImages} projectTitle="Test" />);
    expect(screen.getByText('01 // 03')).toBeInTheDocument();
  });
});
