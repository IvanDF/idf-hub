import React from 'react';
import { render, screen } from '@testing-library/react';
import Magnetic from '@/components/atoms/Magnetic';

describe('Magnetic', () => {
  const MockChild = () => <div>Child Element</div>;

  it('renders children correctly', () => {
    render(
      <Magnetic>
        <MockChild />
      </Magnetic>
    );
    expect(screen.getByText('Child Element')).toBeInTheDocument();
  });

  it('applies cursor-none class to children', () => {
    render(
      <Magnetic>
        <div className="original-class">Test</div>
      </Magnetic>
    );
    const el = screen.getByText('Test');
    expect(el.className).toContain('original-class');
    expect(el.className).toContain('cursor-none');
  });

  it('accepts strength prop', () => {
    render(
      <Magnetic strength={0.8}>
        <div>Test</div>
      </Magnetic>
    );
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('renders without crashing with no props', () => {
    render(
      <Magnetic>
        <span>Default</span>
      </Magnetic>
    );
    expect(screen.getByText('Default')).toBeInTheDocument();
  });
});