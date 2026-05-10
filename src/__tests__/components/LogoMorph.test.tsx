import React from 'react';
import { render, screen } from '@testing-library/react';
import LogoMorph from '@/components/atoms/logo-morph';

describe('LogoMorph', () => {
  it('renders SVG with role img and correct aria-label', () => {
    render(<LogoMorph />);
    const logo = screen.getByRole('img', { name: 'iDF logo' });
    expect(logo).toBeInTheDocument();
  });

  it('renders root div element', () => {
    const { container } = render(<LogoMorph />);
    const rootDiv = container.firstElementChild;
    expect(rootDiv).toBeInTheDocument();
    expect(rootDiv?.tagName).toBe('DIV');
  });

  it('applies root CSS class', () => {
    const { container } = render(<LogoMorph />);
    const rootDiv = container.firstElementChild;
    expect(rootDiv?.className).toContain('root');
  });

  it('applies custom className', () => {
    const { container } = render(<LogoMorph className="custom-logo" />);
    const rootDiv = container.firstElementChild;
    expect(rootDiv?.className).toContain('custom-logo');
  });

  it('renders SVG with correct viewBox', () => {
    render(<LogoMorph />);
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 184 256');
  });

  it('accepts size prop and renders SVG with correct width', () => {
    render(<LogoMorph size={120} />);
    const svg = document.querySelector('svg');
    expect(svg).toHaveAttribute('width', '120');
  });

  it('renders with default size', () => {
    render(<LogoMorph />);
    const svg = document.querySelector('svg');
    expect(svg).toHaveAttribute('width', '80');
  });
});
