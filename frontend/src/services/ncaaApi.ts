const BASE_URL = '/ncaa'

export const ncaaApi = {
  getScoreboard: async () => {
    const res = await fetch(`${BASE_URL}/scoreboard/basketball-men/d1`)
    if (!res.ok) throw new Error('Failed to fetch scoreboard')
    return res.json()
  },

  getBracket: async () => {
    const res = await fetch(`${BASE_URL}/brackets/basketball-men/d1/2026`)
    if (!res.ok) throw new Error('Failed to fetch bracket')
    return res.json()
  },

  getStandings: async () => {
    const res = await fetch(`${BASE_URL}/standings/basketball-men/d1`)
    if (!res.ok) throw new Error('Failed to fetch standings')
    return res.json()
  },
}
