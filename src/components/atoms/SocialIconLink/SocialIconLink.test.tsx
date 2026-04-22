import React from 'react';
import { render, screen } from '@testing-library/react';
import SocialIconLink from '@/components/atoms/SocialIconLink';

describe('SocialIconLink', () => {
  it('renders an anchor element with correct href', () => {
    render(
      <SocialIconLink
        href="https://github.com/test"
        src="/github.svg"
        alt="GitHub"
      />
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://github.com/test');
  });

  it('opens link in new tab with noopener', () => {
    render(
      <SocialIconLink
        href="https://github.com/test"
        src="/github.svg"
        alt="GitHub"
      />
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders the image with correct alt text', () => {
    render(
      <SocialIconLink
        href="https://github.com"
        src="/github.svg"
        alt="GitHub Profile"
      />
    );
    const img = screen.getByAltText('GitHub Profile');
    expect(img).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    render(
      <SocialIconLink
        href="https://github.com"
        src="/github.svg"
        alt="GitHub"
        className="custom-link"
      />
    );
    const link = screen.getByRole('link');
    expect(link.className).toContain('custom-link');
  });

  it('applies inverted class when invertOnDark is true', () => {
    render(
      <SocialIconLink
        href="https://github.com"
        src="/github.svg"
        alt="GitHub"
        invertOnDark={true}
      />
    );
    const img = screen.getByAltText('GitHub');
    expect(img.className).toContain('inverted');
  });

  it('does not apply inverted class when invertOnDark is false', () => {
    render(
      <SocialIconLink
        href="https://github.com"
        src="/github.svg"
        alt="GitHub"
        invertOnDark={false}
      />
    );
    const img = screen.getByAltText('GitHub');
    expect(img.className).not.toContain('inverted');
  });
});