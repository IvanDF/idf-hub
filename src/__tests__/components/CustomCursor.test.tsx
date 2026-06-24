import React from 'react';
import { render, waitFor } from '@testing-library/react';
import CustomCursor from '@/components/atoms/custom-cursor';

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

beforeEach(() => {
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches: query === '(hover: none) and (pointer: coarse)' ? false : false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
});

describe('CustomCursor', () => {
  it('renders cursor elements', async () => {
    const { container } = render(<CustomCursor />);
    await waitFor(() => {
      const divs = container.querySelectorAll('div');
      expect(divs.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('renders two cursor div elements', async () => {
    const { container } = render(<CustomCursor />);
    await waitFor(() => {
      const cursorEls = container.querySelectorAll('[class*="cursor"]');
      expect(cursorEls.length).toBe(2);
    });
  });
});
