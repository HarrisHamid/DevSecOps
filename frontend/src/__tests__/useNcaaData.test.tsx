import { renderHook, act } from '@testing-library/react'
import { useNcaaData } from '../hooks/useNcaaData'

describe('useNcaaData', () => {
  it('starts with loading=true, data=null, error=null', () => {
    const fetcher = jest.fn(() => new Promise(() => {}))
    const { result } = renderHook(() => useNcaaData(fetcher))
    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('sets data and loading=false after successful fetch', async () => {
    const mockData = { games: [] }
    const fetcher = jest.fn(() => Promise.resolve(mockData))
    const { result } = renderHook(() => useNcaaData(fetcher))

    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.data).toEqual(mockData)
    expect(result.current.error).toBeNull()
  })

  it('sets error and loading=false when fetch rejects', async () => {
    const fetcher = jest.fn(() => Promise.reject(new Error('Network error')))
    const { result } = renderHook(() => useNcaaData(fetcher))

    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBe('Network error')
  })

  it('calls the fetcher function exactly once', async () => {
    const fetcher = jest.fn(() => Promise.resolve(null))
    renderHook(() => useNcaaData(fetcher))

    await act(async () => {
      await Promise.resolve()
    })

    expect(fetcher).toHaveBeenCalledTimes(1)
  })
})
