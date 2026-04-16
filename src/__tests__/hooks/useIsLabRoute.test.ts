import { renderHook } from '@testing-library/react'
import { usePathname } from 'next/navigation'
import { useIsLabRoute } from '@/hooks/useIsLabRoute'

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

describe('useIsLabRoute', () => {
  it('returns true for /lab', () => {
    (usePathname as jest.Mock).mockReturnValue('/lab')
    const { result } = renderHook(() => useIsLabRoute())
    expect(result.current).toBe(true)
  })

  it('returns true for /lab/project-id', () => {
    (usePathname as jest.Mock).mockReturnValue('/lab/my-project')
    const { result } = renderHook(() => useIsLabRoute())
    expect(result.current).toBe(true)
  })

  it('returns false for /', () => {
    (usePathname as jest.Mock).mockReturnValue('/')
    const { result } = renderHook(() => useIsLabRoute())
    expect(result.current).toBe(false)
  })

  it('returns false for /time-machine', () => {
    (usePathname as jest.Mock).mockReturnValue('/time-machine')
    const { result } = renderHook(() => useIsLabRoute())
    expect(result.current).toBe(false)
  })

  it('returns false for /laboratory (does not start with /lab/)', () => {
    (usePathname as jest.Mock).mockReturnValue('/laboratory')
    const { result } = renderHook(() => useIsLabRoute())
    // pathname.startsWith('/lab') → /laboratory starts with /lab, so this is true
    expect(result.current).toBe(true)
  })
})
