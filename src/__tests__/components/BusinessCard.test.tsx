import React from 'react';
import { render, screen } from '@testing-library/react';
import BusinessCard from '@/components/organisms/brand-page/BusinessCard';

describe('BusinessCard', () => {
  it('renders SVG with role img and correct aria-label for dev variant', () => {
    render(<BusinessCard variant="dev" />);
    const svg = screen.getByRole('img');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-label', expect.stringContaining('Developer business card'));
  });

  it('renders default name', () => {
    render(<BusinessCard variant="dev" />);
    const svg = screen.getByRole('img');
    expect(svg.innerHTML).toContain('Ivan Del Fatti');
  });

  it('renders custom name', () => {
    render(<BusinessCard variant="dev" name="John Doe" />);
    const svg = screen.getByRole('img');
    expect(svg.innerHTML).toContain('John Doe');
  });

  it('renders custom title', () => {
    render(<BusinessCard variant="dev" title="Software Engineer" />);
    const svg = screen.getByRole('img');
    expect(svg.innerHTML).toContain('Software Engineer');
  });

  it('renders custom email', () => {
    render(<BusinessCard variant="dev" email="test@example.com" />);
    const svg = screen.getByRole('img');
    expect(svg.innerHTML).toContain('test@example.com');
  });

  it('renders custom website', () => {
    render(<BusinessCard variant="dev" website="https://example.com" />);
    const svg = screen.getByRole('img');
    expect(svg.innerHTML).toContain('https://example.com');
  });

  it('renders badge label for each variant', () => {
    const variants = ['dev', 'creative', 'general', 'maker'] as const;
    const labels = ['Developer', 'Creative', 'General', 'Maker'];
    variants.forEach((variant, i) => {
      const { unmount } = render(<BusinessCard variant={variant} />);
      expect(screen.getByText(labels[i])).toBeInTheDocument();
      unmount();
    });
  });

  it('sets data-variant attribute on card outer', () => {
    const { container } = render(<BusinessCard variant="maker" />);
    const cardOuter = container.querySelector('[data-variant="maker"]');
    expect(cardOuter).toBeInTheDocument();
  });

  it('applies wrapper CSS class', () => {
    const { container } = render(<BusinessCard variant="dev" />);
    const wrapper = container.firstElementChild;
    expect(wrapper?.className).toContain('wrapper');
  });
});
