import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RightColumn from '@/components/templates/Layout/RightColumn';
import { useAudio } from '@/context/AudioContext';
import { useTheme } from '@/context/ThemeContext';

jest.mock('@/context/AudioContext');
jest.mock('@/context/ThemeContext');
jest.mock('@/hooks/useIsLabRoute', () => ({
  useIsLabRoute: () => false,
}));
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { ...rest } = props;
    return React.createElement('img', rest);
  },
}));

const mockToggleTheme = jest.fn();
const mockPlayLightOn = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  (useAudio as jest.Mock).mockReturnValue({
    playLightOn: mockPlayLightOn,
  });
  (useTheme as jest.Mock).mockReturnValue({
    theme: 'dark',
    toggleTheme: mockToggleTheme,
    superDarkMode: false,
    toggleSuperDarkMode: jest.fn(),
    clickHint: 0,
  });
});

describe('RightColumn', () => {
  it('renders aside element', () => {
    const { container } = render(<RightColumn />);
    const aside = container.querySelector('aside');
    expect(aside).toBeInTheDocument();
  });

  it('renders theme toggle button with DARK-MODE text when theme is light', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
      clickHint: 0,
      superDarkMode: false,
      toggleSuperDarkMode: jest.fn(),
    });
    render(<RightColumn />);
    expect(screen.getByText('DARK-MODE')).toBeInTheDocument();
  });

  it('renders theme toggle button with LIGHT-MODE text when theme is dark', () => {
    render(<RightColumn />);
    expect(screen.getByText('LIGHT-MODE')).toBeInTheDocument();
  });

  it('calls playLightOn and toggleTheme on button click', async () => {
    const user = userEvent.setup();
    render(<RightColumn />);
    const btn = screen.getByText('LIGHT-MODE');
    await user.click(btn);
    expect(mockPlayLightOn).toHaveBeenCalledTimes(1);
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('calls playLightOn and toggleTheme on Enter key', () => {
    render(<RightColumn />);
    const btn = screen.getByText('LIGHT-MODE');
    fireEvent.keyDown(btn, { key: 'Enter' });
    expect(mockPlayLightOn).toHaveBeenCalled();
    expect(mockToggleTheme).toHaveBeenCalled();
  });

  it('calls playLightOn and toggleTheme on Space key', () => {
    render(<RightColumn />);
    const btn = screen.getByText('LIGHT-MODE');
    fireEvent.keyDown(btn, { key: ' ' });
    expect(mockPlayLightOn).toHaveBeenCalled();
    expect(mockToggleTheme).toHaveBeenCalled();
  });

  it('renders social links', () => {
    render(<RightColumn />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThanOrEqual(4);
  });

  it('renders Instagram link', () => {
    render(<RightColumn />);
    const link = screen.getByRole('link', { name: /instagram/i });
    expect(link).toHaveAttribute('href', 'https://www.instagram.com/idf.me/');
  });

  it('renders LinkedIn link', () => {
    render(<RightColumn />);
    const link = screen.getByRole('link', { name: /linkedin/i });
    expect(link).toHaveAttribute('href', 'https://www.linkedin.com/in/ivandf/');
  });

  it('renders GitHub link', () => {
    render(<RightColumn />);
    const link = screen.getByRole('link', { name: /github/i });
    expect(link).toHaveAttribute('href', 'https://github.com/IvanDF');
  });

  it('renders Figma link', () => {
    render(<RightColumn />);
    const link = screen.getByRole('link', { name: /figma/i });
    expect(link).toHaveAttribute('href', 'https://www.figma.com/@ivandf');
  });

  it('applies rightColumn CSS class', () => {
    const { container } = render(<RightColumn />);
    const aside = container.querySelector('aside');
    expect(aside?.className).toContain('rightColumn');
  });
});
