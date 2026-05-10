import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RotatingTitle from '@/components/atoms/rotating-title';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, back: jest.fn() }),
}));

jest.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    span: ({ children, ...props }: Record<string, unknown>) =>
      React.createElement('span', props, children),
  },
}));

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('RotatingTitle', () => {
  it('renders initial role text', () => {
    render(<RotatingTitle />);
    expect(screen.getByText('CREATIVO')).toBeInTheDocument();
  });

  it('cycles to next role after duration', () => {
    render(<RotatingTitle />);
    act(() => { jest.advanceTimersByTime(4000); });
    expect(screen.getByText('FRONT-END DEV')).toBeInTheDocument();
  });

  it('pauses cycling on mouse enter', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<RotatingTitle />);
    const container = screen.getByText('CREATIVO').closest('div')!;
    await user.hover(container);
    act(() => { jest.advanceTimersByTime(10000); });
    expect(screen.getByText('CREATIVO')).toBeInTheDocument();
  });

  it('resumes cycling on mouse leave', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<RotatingTitle />);
    const container = screen.getByText('CREATIVO').closest('div')!;
    await user.hover(container);
    act(() => { jest.advanceTimersByTime(2000); });
    await user.unhover(container);
    act(() => { jest.advanceTimersByTime(4000); });
    expect(screen.getByText('FRONT-END DEV')).toBeInTheDocument();
  });

  it('calls router.push for route action on click', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<RotatingTitle />);
    // Cycle through roles step by step
    act(() => { jest.advanceTimersByTime(4000); }); // → FRONT-END DEV
    act(() => { jest.advanceTimersByTime(2000); }); // → GRAPHIC DESIGNER
    act(() => { jest.advanceTimersByTime(2000); }); // → UI/UX DESIGNER
    act(() => { jest.advanceTimersByTime(2000); }); // → PROBLEM SOLVER
    expect(screen.getByText('PROBLEM SOLVER')).toBeInTheDocument();
    await user.click(screen.getByText('PROBLEM SOLVER'));
    expect(mockPush).toHaveBeenCalledWith('/secrets');
  });

  it('opens window for link action on click', async () => {
    const mockOpen = jest.spyOn(window, 'open').mockImplementation(() => null);
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<RotatingTitle />);
    act(() => { jest.advanceTimersByTime(4000); });
    expect(screen.getByText('FRONT-END DEV')).toBeInTheDocument();
    await user.click(screen.getByText('FRONT-END DEV'));
    expect(mockOpen).toHaveBeenCalledWith('https://github.com/IvanDF', '_blank');
    mockOpen.mockRestore();
  });

  it('applies custom className', () => {
    render(<RotatingTitle className="custom-title" />);
    const container = screen.getByText('CREATIVO').closest('div')!;
    expect(container.className).toContain('custom-title');
  });
});
