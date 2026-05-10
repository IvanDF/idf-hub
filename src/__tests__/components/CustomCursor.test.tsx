import React from 'react';
import { render } from '@testing-library/react';
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
  it('renders cursor elements', () => {
    render(<CustomCursor />);
    const cursorDots = document.querySelectorAll('[style*="pointer-events: none"]');
    expect(cursorDots.length).toBeGreaterThanOrEqual(1);
  });

  it('renders two div elements with fixed positioning', () => {
    render(<CustomCursor />);
    const fixedEls = document.querySelectorAll('[style*="position: fixed"]');
    expect(fixedEls.length).toBe(2);
  });
});
