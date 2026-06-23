import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useAudio } from '@/context/AudioContext';
import AudioToggle from '@/components/atoms/audio-toggle';

jest.mock('@/context/AudioContext');

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
  playTrack: jest.fn(),
  nextTrack: jest.fn(),
  prevTrack: jest.fn(),
  playSuccess: jest.fn(),
  playError: jest.fn(),
  playType: jest.fn(),
  playCommand: jest.fn(),
  playEasterEgg: jest.fn(),
  playGlitch: jest.fn(),
  requestAudioAccess: jest.fn().mockResolvedValue(undefined),
};

beforeEach(() => {
  jest.clearAllMocks();
  (useAudio as jest.Mock).mockReturnValue(defaultAudioMock);
});

describe('AudioToggle', () => {
  it('renders enable button when audio is not enabled', () => {
    render(<AudioToggle />);
    expect(screen.getByRole('button', { name: 'Enable audio' })).toBeInTheDocument();
  });

  it('has correct aria-label on enable button', () => {
    render(<AudioToggle />);
    const btn = screen.getByRole('button', { name: 'Enable audio' });
    expect(btn).toHaveAttribute('aria-label', 'Enable audio');
  });

  it('calls playClick and toggleAudio on enable click', async () => {
    const user = userEvent.setup();
    render(<AudioToggle />);
    await user.click(screen.getByRole('button', { name: 'Enable audio' }));
    expect(defaultAudioMock.playClick).toHaveBeenCalledTimes(1);
    expect(defaultAudioMock.toggleAudio).toHaveBeenCalledTimes(1);
  });

  it('renders play and mute buttons when enabled', () => {
    (useAudio as jest.Mock).mockReturnValue({ ...defaultAudioMock, isEnabled: true });
    render(<AudioToggle />);
    expect(screen.getByRole('button', { name: 'Play music' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mute' })).toBeInTheDocument();
  });

  it('renders pause button when playing', () => {
    (useAudio as jest.Mock).mockReturnValue({ ...defaultAudioMock, isEnabled: true, isPlaying: true });
    render(<AudioToggle />);
    expect(screen.getByRole('button', { name: 'Pause music' })).toBeInTheDocument();
  });

  it('renders pause button when starting', () => {
    (useAudio as jest.Mock).mockReturnValue({ ...defaultAudioMock, isEnabled: true, isStarting: true });
    render(<AudioToggle />);
    expect(screen.getByRole('button', { name: 'Pause music' })).toBeInTheDocument();
  });

  it('renders unmute button when muted', () => {
    (useAudio as jest.Mock).mockReturnValue({
      ...defaultAudioMock, isEnabled: true, isPlaying: true, isMuted: true,
    });
    render(<AudioToggle />);
    expect(screen.getByRole('button', { name: 'Unmute' })).toBeInTheDocument();
  });

  it('calls playClick and toggleMute on mute click', async () => {
    (useAudio as jest.Mock).mockReturnValue({ ...defaultAudioMock, isEnabled: true, isPlaying: true });
    const user = userEvent.setup();
    render(<AudioToggle />);
    await user.click(screen.getByRole('button', { name: 'Mute' }));
    expect(defaultAudioMock.playClick).toHaveBeenCalled();
    expect(defaultAudioMock.toggleMute).toHaveBeenCalled();
  });

  it('applies className to container', () => {
    (useAudio as jest.Mock).mockReturnValue({ ...defaultAudioMock, isEnabled: true });
    const { container } = render(<AudioToggle className="custom-class" />);
    const containerEl = container.querySelector('.custom-class');
    expect(containerEl).toBeInTheDocument();
  });
});
