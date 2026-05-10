import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useAudio } from '@/context/AudioContext';
import AudioPrompt from '@/components/molecules/audio-prompt';

jest.mock('@/context/AudioContext');

jest.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children, ...props }: Record<string, unknown>) =>
      React.createElement('div', props, children),
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

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  (useAudio as jest.Mock).mockReturnValue(defaultAudioMock);
});

afterEach(() => {
  jest.useRealTimers();
});

describe('AudioPrompt', () => {
  it('shows prompt after delay when audio not enabled', () => {
    jest.useFakeTimers();
    render(<AudioPrompt />);
    expect(screen.queryByText('Immersive Audio')).not.toBeInTheDocument();
    act(() => { jest.advanceTimersByTime(3500); });
    expect(screen.getByText('Immersive Audio')).toBeInTheDocument();
    jest.useRealTimers();
  });

  it('does not show prompt if already seen', () => {
    localStorage.setItem('audioPromptSeen', 'true');
    jest.useFakeTimers();
    render(<AudioPrompt />);
    act(() => { jest.advanceTimersByTime(3500); });
    expect(screen.queryByText('Immersive Audio')).not.toBeInTheDocument();
    jest.useRealTimers();
  });

  it('does not show prompt if audio is already enabled', () => {
    (useAudio as jest.Mock).mockReturnValue({ ...defaultAudioMock, isEnabled: true });
    jest.useFakeTimers();
    render(<AudioPrompt />);
    act(() => { jest.advanceTimersByTime(3500); });
    expect(screen.queryByText('Immersive Audio')).not.toBeInTheDocument();
    jest.useRealTimers();
  });

  it('calls playClick and requestAudioAccess on accept', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<AudioPrompt />);
    act(() => { jest.advanceTimersByTime(3500); });
    await user.click(screen.getByText('Enable Audio'));
    expect(defaultAudioMock.playClick).toHaveBeenCalled();
    expect(defaultAudioMock.requestAudioAccess).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('hides on accept (via isEnabled flag change)', () => {
    jest.useFakeTimers();
    const { rerender } = render(<AudioPrompt />);
    act(() => { jest.advanceTimersByTime(3500); });
    expect(screen.getByText('Immersive Audio')).toBeInTheDocument();
    // Simulate audio being enabled after acceptance
    (useAudio as jest.Mock).mockReturnValue({ ...defaultAudioMock, isEnabled: true });
    rerender(<AudioPrompt />);
    expect(screen.queryByText('Immersive Audio')).not.toBeInTheDocument();
    jest.useRealTimers();
  });

  it('calls playClick on decline', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<AudioPrompt />);
    act(() => { jest.advanceTimersByTime(3500); });
    await user.click(screen.getByText('Maybe Later'));
    expect(defaultAudioMock.playClick).toHaveBeenCalled();
    expect(defaultAudioMock.requestAudioAccess).not.toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('renders feature list items', () => {
    jest.useFakeTimers();
    render(<AudioPrompt />);
    act(() => { jest.advanceTimersByTime(3500); });
    expect(screen.getByText('4 Ambient Tracks')).toBeInTheDocument();
    expect(screen.getByText('Sound Effects')).toBeInTheDocument();
    jest.useRealTimers();
  });

  it('renders accept and decline buttons', () => {
    jest.useFakeTimers();
    render(<AudioPrompt />);
    act(() => { jest.advanceTimersByTime(3500); });
    expect(screen.getByText('Enable Audio')).toBeInTheDocument();
    expect(screen.getByText('Maybe Later')).toBeInTheDocument();
    jest.useRealTimers();
  });
});
