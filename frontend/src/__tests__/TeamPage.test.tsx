import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import TeamPage from '../TeamPage'

// Mock the supabase client before any imports resolve it
jest.mock('../lib/supabase', () => ({
  supabase: { from: jest.fn() },
}))

import { supabase } from '../lib/supabase'
const mockFrom = supabase.from as jest.MockedFunction<typeof supabase.from>

function buildQueryChain({
  teamsResult = { data: [{ id: 42 }], error: null },
  playersResult = { data: [], error: null },
}: {
  teamsResult?: { data: unknown; error: unknown }
  playersResult?: { data: unknown; error: unknown }
} = {}) {
  // players chain: from('players').select(...).eq(...).order(...)
  const playersChain = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockResolvedValue(playersResult),
  }

  // teams chain: from('teams').select(...).eq(...).limit(...)
  const teamsChain = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    limit: jest.fn().mockResolvedValue(teamsResult),
  }

  mockFrom.mockImplementation((table: string) => {
    if (table === 'teams') return teamsChain as never
    if (table === 'players') return playersChain as never
    return teamsChain as never
  })

  return { teamsChain, playersChain }
}

describe('TeamPage', () => {
  beforeEach(() => {
    mockFrom.mockClear()
  })

  it('displays the team name as a heading', async () => {
    buildQueryChain()
    render(<TeamPage team="Duke" />)
    // waitFor lets async effects (Supabase calls) settle before the test exits,
    // suppressing the "not wrapped in act" warning
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Duke' })).toBeInTheDocument())
  })

  it('shows loading indicator while players are being fetched', async () => {
    // teams resolves immediately; players never resolves
    const teamsChain = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: [{ id: 42 }], error: null }),
    }
    const playersChain = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnValue(new Promise(() => {})),
    }
    mockFrom.mockImplementation((table: string) => {
      if (table === 'teams') return teamsChain as never
      return playersChain as never
    })

    render(<TeamPage team="Duke" />)
    // After teams resolves, players fetch starts → loading visible
    await waitFor(() => expect(screen.getByText(/Loading players/i)).toBeInTheDocument())
  })

  it('shows error message when teams query fails', async () => {
    buildQueryChain({ teamsResult: { data: null, error: { message: 'DB unavailable' } } })
    render(<TeamPage team="Duke" />)
    await waitFor(() => expect(screen.getByText('DB unavailable')).toBeInTheDocument())
  })

  it('shows error message when players query fails', async () => {
    buildQueryChain({
      teamsResult: { data: [{ id: 42 }], error: null },
      playersResult: { data: null, error: { message: 'Players table error' } },
    })
    render(<TeamPage team="Duke" />)
    await waitFor(() => expect(screen.getByText('Players table error')).toBeInTheDocument())
  })

  it('renders player rows in the stats table', async () => {
    buildQueryChain({
      playersResult: {
        data: [
          { player_name: 'Zion Williamson', Individual_PTS: 22, Individual_REB: 8 },
          { player_name: 'Jayson Tatum', Individual_PTS: 25, Individual_REB: 7 },
        ],
        error: null,
      },
    })
    render(<TeamPage team="Duke" />)
    await waitFor(() => expect(screen.getByText('Zion Williamson')).toBeInTheDocument())
    expect(screen.getByText('Jayson Tatum')).toBeInTheDocument()
  })

  it('renders all stat column headers', async () => {
    buildQueryChain()
    render(<TeamPage team="Duke" />)
    await waitFor(() => expect(screen.getByText('Name')).toBeInTheDocument())
    expect(screen.getByText('Individual_PTS')).toBeInTheDocument()
    expect(screen.getByText('Season_REB')).toBeInTheDocument()
  })

  it('shows no player rows when team has no data', async () => {
    buildQueryChain({ teamsResult: { data: [], error: null } })
    render(<TeamPage team="Unknown Team" />)
    // No players should be loaded since teamId remains null
    await waitFor(() => {
      expect(screen.queryByText(/Loading players/i)).not.toBeInTheDocument()
    })
    const tbody = document.querySelector('tbody')
    expect(tbody?.childElementCount).toBe(0)
  })

  it('queries teams table with the correct team name', async () => {
    const { teamsChain } = buildQueryChain()
    render(<TeamPage team="Kansas" />)
    await waitFor(() => expect(teamsChain.eq).toHaveBeenCalledWith('name', 'Kansas'))
  })

  it('queries players table with the resolved team id', async () => {
    const { playersChain } = buildQueryChain({ teamsResult: { data: [{ id: 7 }], error: null } })
    render(<TeamPage team="Kansas" />)
    await waitFor(() => expect(playersChain.eq).toHaveBeenCalledWith('team_id', 7))
  })
})
