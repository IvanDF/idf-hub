import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MobileNav from '@/components/templates/Layout/MobileNav';
import { useAudio } from '@/context/AudioContext';
import { useTheme } from '@/context/ThemeContext';

jest.mock('@/context/AudioContext');
jest.mock('@/context/ThemeContext');
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
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
const mockOnToggle = jest.fn();
const mockOnClose = jest.fn();

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

describe('MobileNav', () => {
  it('renders burger button', () => {
    render(<MobileNav isOpen={false} onToggle={mockOnToggle} onClose={mockOnClose} />);
    const burger = screen.getByRole('button', { name: 'Open Menu' });
    expect(burger).toBeInTheDocument();
  });

  it('has correct aria-expanded when closed', () => {
    render(<MobileNav isOpen={false} onToggle={mockOnToggle} onClose={mockOnClose} />);
    const burger = screen.getByRole('button', { name: 'Open Menu' });
    expect(burger).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows overlay when open', () => {
    render(<MobileNav isOpen={true} onToggle={mockOnToggle} onClose={mockOnClose} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('burger button shows Close Menu when open', () => {
    render(<MobileNav isOpen={true} onToggle={mockOnToggle} onClose={mockOnClose} />);
    const burger = screen.getByRole('button', { name: 'Close Menu' });
    expect(burger).toBeInTheDocument();
    expect(burger).toHaveAttribute('aria-expanded', 'true');
  });

  it('calls onToggle when burger is clicked', async () => {
    const user = userEvent.setup();
    render(<MobileNav isOpen={false} onToggle={mockOnToggle} onClose={mockOnClose} />);
    await user.click(screen.getByRole('button', { name: 'Open Menu' }));
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it('renders theme toggle in overlay', () => {
    render(<MobileNav isOpen={true} onToggle={mockOnToggle} onClose={mockOnClose} />);
    expect(screen.getByText('LIGHT-MODE')).toBeInTheDocument();
  });

  it('calls playLightOn and toggleTheme on theme toggle click', async () => {
    const user = userEvent.setup();
    render(<MobileNav isOpen={true} onToggle={mockOnToggle} onClose={mockOnClose} />);
    await user.click(screen.getByText('LIGHT-MODE'));
    expect(mockPlayLightOn).toHaveBeenCalled();
    expect(mockToggleTheme).toHaveBeenCalled();
  });

  it('renders cmd button in overlay', () => {
    render(<MobileNav isOpen={true} onToggle={mockOnToggle} onClose={mockOnClose} />);
    const cmdBtn = screen.getByRole('button', { name: 'Open command palette' });
    expect(cmdBtn).toBeInTheDocument();
  });

  it('renders name and role in overlay', () => {
    render(<MobileNav isOpen={true} onToggle={mockOnToggle} onClose={mockOnClose} />);
    expect(screen.getByText('IVAN DEL FATTI')).toBeInTheDocument();
    expect(screen.getByText('⌘K')).toBeInTheDocument();
  });

  it('renders audio toggle in overlay', () => {
    render(<MobileNav isOpen={true} onToggle={mockOnToggle} onClose={mockOnClose} />);
    expect(screen.getByRole('button', { name: 'Enable audio' })).toBeInTheDocument();
  });

  it('renders social links in overlay', () => {
    render(<MobileNav isOpen={true} onToggle={mockOnToggle} onClose={mockOnClose} />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThanOrEqual(4);
  });

  it('renders LIGHT-MODE when theme is dark', () => {
    render(<MobileNav isOpen={true} onToggle={mockOnToggle} onClose={mockOnClose} />);
    expect(screen.getByText('LIGHT-MODE')).toBeInTheDocument();
  });

  it('renders DARK-MODE when theme is light', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
      superDarkMode: false,
      toggleSuperDarkMode: jest.fn(),
      clickHint: 0,
    });
    render(<MobileNav isOpen={true} onToggle={mockOnToggle} onClose={mockOnClose} />);
    expect(screen.getByText('DARK-MODE')).toBeInTheDocument();
  });
});
