import React from 'react';
import { render, screen } from '@testing-library/react';
import LeftColumn from '@/components/templates/Layout/LeftColumn';

jest.mock('@/context/AudioContext', () => ({
  useAudio: () => ({
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
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
  usePathname: () => '/',
}));

jest.mock('@/hooks/useIsLabRoute', () => ({
  useIsLabRoute: () => false,
}));

describe('LeftColumn', () => {
  it('renders aside element', () => {
    const { container } = render(<LeftColumn />);
    const aside = container.querySelector('aside');
    expect(aside).toBeInTheDocument();
  });

  it('renders nav section', () => {
    render(<LeftColumn />);
    const nav = document.querySelector('nav');
    expect(nav).toBeInTheDocument();
  });

  it('renders cmd hint button', () => {
    render(<LeftColumn />);
    expect(screen.getByText('⌘K')).toBeInTheDocument();
    expect(screen.getByText('<_')).toBeInTheDocument();
  });

  it('renders footer section', () => {
    render(<LeftColumn />);
    const footer = document.querySelector('footer');
    expect(footer).toBeInTheDocument();
  });

  it('renders audio toggle button', () => {
    render(<LeftColumn />);
    expect(screen.getByRole('button', { name: 'Enable audio' })).toBeInTheDocument();
  });

  it('renders name text', () => {
    render(<LeftColumn />);
    expect(screen.getByText('IVAN DEL FATTI')).toBeInTheDocument();
  });

  it('applies leftColumn CSS class', () => {
    const { container } = render(<LeftColumn />);
    const aside = container.querySelector('aside');
    expect(aside?.className).toContain('leftColumn');
  });
});
