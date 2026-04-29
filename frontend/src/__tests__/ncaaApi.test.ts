import { ncaaApi } from '../services/ncaaApi'

const mockFetch = jest.fn()
globalThis.fetch = mockFetch

describe('ncaaApi', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('getScoreboard', () => {
    it('fetches the correct endpoint', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) })
      await ncaaApi.getScoreboard()
      expect(mockFetch).toHaveBeenCalledWith('/ncaa/scoreboard/basketball-men/d1')
    })

    it('returns parsed JSON on success', async () => {
      const mockData = { games: [{ id: 1 }] }
      mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockData) })
      const result = await ncaaApi.getScoreboard()
      expect(result).toEqual(mockData)
    })

    it('throws with message on non-ok response', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false })
      await expect(ncaaApi.getScoreboard()).rejects.toThrow('Failed to fetch scoreboard')
    })
  })

  describe('getBracket', () => {
    it('fetches the correct endpoint', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) })
      await ncaaApi.getBracket()
      expect(mockFetch).toHaveBeenCalledWith('/ncaa/brackets/basketball-men/d1/2026')
    })

    it('returns parsed JSON on success', async () => {
      const mockData = { championships: [] }
      mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockData) })
      const result = await ncaaApi.getBracket()
      expect(result).toEqual(mockData)
    })

    it('throws with message on non-ok response', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false })
      await expect(ncaaApi.getBracket()).rejects.toThrow('Failed to fetch bracket')
    })
  })

  describe('getStandings', () => {
    it('fetches the correct endpoint', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) })
      await ncaaApi.getStandings()
      expect(mockFetch).toHaveBeenCalledWith('/ncaa/standings/basketball-men/d1')
    })

    it('returns parsed JSON on success', async () => {
      const mockData = { standings: [{ team: 'Duke' }] }
      mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockData) })
      const result = await ncaaApi.getStandings()
      expect(result).toEqual(mockData)
    })

    it('throws with message on non-ok response', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false })
      await expect(ncaaApi.getStandings()).rejects.toThrow('Failed to fetch standings')
    })
  })
})
