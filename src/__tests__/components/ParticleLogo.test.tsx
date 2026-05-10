import React from 'react';
import { render, screen } from '@testing-library/react';
import ParticleLogo from '@/components/molecules/particle-logo';
import { useTheme } from '@/context/ThemeContext';

jest.mock('@/context/ThemeContext');
jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="r3f-canvas">{children}</div>,
  useFrame: jest.fn(),
}));
jest.mock('@react-three/drei', () => ({
  Html: ({ children }: { children: React.ReactNode }) => <div data-testid="drei-html">{children}</div>,
}));
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { ...rest } = props;
    return React.createElement('img', rest);
  },
}));

beforeEach(() => {
  (useTheme as jest.Mock).mockReturnValue({ theme: 'dark' });
});

describe('ParticleLogo', () => {
  it('renders outer container div', () => {
    const { container } = render(<ParticleLogo />);
    const outerDiv = container.firstElementChild;
    expect(outerDiv).toBeInTheDocument();
    expect(outerDiv?.tagName).toBe('DIV');
  });

  it('renders R3F Canvas mock', () => {
    render(<ParticleLogo />);
    expect(screen.getByTestId('r3f-canvas')).toBeInTheDocument();
  });

  it('renders Html overlay with logo image', () => {
    render(<ParticleLogo />);
    expect(screen.getByTestId('drei-html')).toBeInTheDocument();
    const logoImg = screen.getByAltText('iDF Logo');
    expect(logoImg).toBeInTheDocument();
  });
});
