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

  it('renders the dot, glyph, and blob cursor elements', async () => {
    const { container } = render(<CustomCursor />);
    await waitFor(() => {
      const cursorEls = container.querySelectorAll('[class*="cursor"]');
      expect(cursorEls.length).toBe(3);
    });
  });

  // Regression: the magnet writes `translate` inline, which outranks every
  // stylesheet rule, so it must leave the press its own term. Without the
  // `var(--press-*)` additions the `:active` press offset — the global 1px
  // baseline and the Button's carved 2px alike — is silently dead on every
  // control the magnet adopts, with nothing visible to reveal it.
  it('leaves room for the press offset when magnetising a control', async () => {
    render(<CustomCursor />);

    const button = document.createElement('button');
    document.body.appendChild(button);

    await waitFor(() => {
      button.dispatchEvent(
        new MouseEvent('mousemove', { bubbles: true, clientX: 50, clientY: 50 }),
      );
      expect(button.style.translate).toContain('var(--press-x');
    });

    expect(button.style.translate).toContain('var(--press-y');

    button.remove();
  });
});
