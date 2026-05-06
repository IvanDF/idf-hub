import React from 'react'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, useTheme } from '@/context/ThemeContext'

// Helper component to expose context values
function ThemeConsumer() {
  const { theme, toggleTheme, superDarkMode, clickHint } = useTheme()
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="super-dark">{String(superDarkMode)}</span>
      <span data-testid="click-hint">{clickHint}</span>
      <button onClick={toggleTheme}>toggle</button>
    </div>
  )
}

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
    document.body.classList.remove('super-dark-mode')
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('useTheme outside provider', () => {
    it('throws an error when used outside ThemeProvider', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
      expect(() => render(<ThemeConsumer />)).toThrow(
        'useTheme must be used within a ThemeProvider'
      )
      spy.mockRestore()
    })
  })

  describe('default theme', () => {
    it('defaults to dark when system prefers dark', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query: string) => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          onchange: null,
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
        })),
      })

      render(
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>
      )

      act(() => { jest.runAllTimers() })
      expect(screen.getByTestId('theme').textContent).toBe('dark')
    })

    it('defaults to light when system prefers light', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query: string) => ({
          matches: false,
          media: query,
          onchange: null,
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
        })),
      })

      render(
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>
      )

      act(() => { jest.runAllTimers() })
      expect(screen.getByTestId('theme').textContent).toBe('light')
    })

    it('uses saved localStorage theme over system preference', () => {
      localStorage.setItem('theme', 'light')
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query: string) => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          onchange: null,
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
        })),
      })

      render(
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>
      )

      act(() => { jest.runAllTimers() })
      expect(screen.getByTestId('theme').textContent).toBe('light')
    })
  })

  describe('toggleTheme', () => {
    beforeEach(() => {
      localStorage.setItem('theme', 'light')
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query: string) => ({
          matches: false,
          media: query,
          onchange: null,
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
        })),
      })
    })

    it('switches from light to dark', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>
      )

      act(() => { jest.runAllTimers() })
      await user.click(screen.getByRole('button', { name: /toggle/i }))
      act(() => { jest.runAllTimers() })

      expect(screen.getByTestId('theme').textContent).toBe('dark')
    })

    it('switches from dark to light', async () => {
      localStorage.setItem('theme', 'dark')
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>
      )

      act(() => { jest.runAllTimers() })
      await user.click(screen.getByRole('button', { name: /toggle/i }))
      act(() => { jest.runAllTimers() })

      expect(screen.getByTestId('theme').textContent).toBe('light')
    })

    it('persists theme to localStorage on toggle', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>
      )

      act(() => { jest.runAllTimers() })
      await user.click(screen.getByRole('button', { name: /toggle/i }))
      act(() => { jest.runAllTimers() })

      expect(localStorage.getItem('theme')).toBe('dark')
    })

    it('sets data-theme attribute on documentElement', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>
      )

      act(() => { jest.runAllTimers() })
      await user.click(screen.getByRole('button', { name: /toggle/i }))
      act(() => { jest.runAllTimers() })

      expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    })
  })

  describe('superDarkMode', () => {
    it('activates after 5 rapid toggles', async () => {
      localStorage.setItem('theme', 'light')
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query: string) => ({
          matches: false,
          media: query,
          onchange: null,
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
        })),
      })

      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>
      )

      act(() => { jest.runAllTimers() })
      const btn = screen.getByRole('button', { name: /toggle/i })

      for (let i = 0; i < 5; i++) {
        await user.click(btn)
      }
      act(() => { jest.runAllTimers() })

      expect(screen.getByTestId('super-dark').textContent).toBe('true')
    })
  })
})
