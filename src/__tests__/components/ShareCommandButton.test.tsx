import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ShareCommandButton from '@/components/atoms/share-command-button';

beforeEach(() => {
  jest.useRealTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('ShareCommandButton', () => {
  it('renders inline button by default', () => {
    render(<ShareCommandButton command="test-cmd" />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('has correct aria-label', () => {
    render(<ShareCommandButton command="my-command" />);
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      'Copy shareable link for command: my-command',
    );
  });

  it('renders label in standalone variant', () => {
    render(<ShareCommandButton command="test" variant="standalone" />);
    expect(screen.getByText('Share')).toBeInTheDocument();
  });

  it('renders custom label in standalone variant', () => {
    render(<ShareCommandButton command="test" variant="standalone" label="Share Now" />);
    expect(screen.getByText('Share Now')).toBeInTheDocument();
  });

  it('shows copied state after click', async () => {
    const user = userEvent.setup();
    render(<ShareCommandButton command="hello-world" variant="standalone" />);
    await act(async () => {
      await user.click(screen.getByRole('button'));
    });
    expect(screen.getByText('Link copied!')).toBeInTheDocument();
  });

  it('reverts to original label after 2 seconds', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<ShareCommandButton command="test" variant="standalone" />);
    await act(async () => {
      await user.click(screen.getByRole('button'));
    });

    expect(screen.getByText('Link copied!')).toBeInTheDocument();

    act(() => { jest.advanceTimersByTime(2000); });
    expect(screen.getByText('Share')).toBeInTheDocument();
  });

  it('uses Web Share API when available', async () => {
    const shareMock = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(window.navigator, 'share', {
      get: () => shareMock,
      configurable: true,
    });

    const user = userEvent.setup();
    render(<ShareCommandButton command="test-share" />);
    await act(async () => {
      await user.click(screen.getByRole('button'));
    });

    expect(shareMock).toHaveBeenCalled();
  });

  it('falls back to clipboard when Web Share fails', async () => {
    const shareMock = jest.fn().mockRejectedValue(new Error('Abort'));
    Object.defineProperty(window.navigator, 'share', {
      get: () => shareMock,
      configurable: true,
    });

    const user = userEvent.setup();
    render(<ShareCommandButton command="fallback-test" variant="standalone" />);
    await act(async () => {
      await user.click(screen.getByRole('button'));
    });

    expect(shareMock).toHaveBeenCalled();
    // After Web Share fails, clipboard fallback runs -> "Link copied!" appears
    expect(screen.getByText('Link copied!')).toBeInTheDocument();
  });

  it('has accessible status announcement for screen readers', () => {
    render(<ShareCommandButton command="test" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
