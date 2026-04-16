import React from 'react'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GlitchText from '@/components/atoms/GlitchText'

describe('GlitchText', () => {
  it('renders the provided text', () => {
    render(<GlitchText text="Hello World" />)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('renders as a span element', () => {
    render(<GlitchText text="Test" />)
    const el = screen.getByText('Test')
    expect(el.tagName).toBe('SPAN')
  })

  it('applies the glitchText CSS class', () => {
    render(<GlitchText text="Styled" />)
    const el = screen.getByText('Styled')
    // identity-obj-proxy returns the class name as a string key
    expect(el.className).toContain('glitchText')
  })

  it('applies an additional className when provided', () => {
    render(<GlitchText text="Extra" className="my-custom-class" />)
    const el = screen.getByText('Extra')
    expect(el.className).toContain('my-custom-class')
  })

  it('starts scrambling text on mouse enter', async () => {
    jest.useFakeTimers()
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })

    render(<GlitchText text="SCRAMBLE" scrambleSpeed={10} />)
    const el = screen.getByText('SCRAMBLE')

    await user.hover(el)
    // Wrap timer flush in act so React can process the state updates
    await act(async () => { jest.runAllTimers() })

    const finalText = screen.getByText('SCRAMBLE')
    expect(finalText).toBeInTheDocument()
    jest.useRealTimers()
  })

  it('matches snapshot', () => {
    const { container } = render(<GlitchText text="Snapshot" />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
