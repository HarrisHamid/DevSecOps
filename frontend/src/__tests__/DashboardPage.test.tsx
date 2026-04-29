import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import DashboardPage from '../DashboardPage'

const renderWithRouter = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>)

// bracketPositionId / 100 (floor) = round number
// 201 → round 2 = "First Round", 601 → round 6 = "Final Four"
const makeBracketData = (games: object[]) => ({
  championships: [{ games }],
})

const sampleGame = {
  contestId: 1,
  bracketPositionId: 201,
  title: 'South Region Game 1',
  teams: [
    { nameShort: 'Duke', score: 80, seed: 1, isTop: true, isWinner: true },
    { nameShort: 'UNC', score: 72, seed: 2, isTop: false, isWinner: false },
  ],
}

describe('DashboardPage', () => {
  it('shows loading message when bracketData is null', () => {
    renderWithRouter(<DashboardPage bracketData={null} />)
    expect(screen.getByText(/Loading bracket dashboard/i)).toBeInTheDocument()
  })

  it('shows loading message when championships array is empty', () => {
    renderWithRouter(<DashboardPage bracketData={{ championships: [] }} />)
    expect(screen.getByText(/Loading bracket dashboard/i)).toBeInTheDocument()
  })

  it('shows loading message when games array is empty', () => {
    renderWithRouter(<DashboardPage bracketData={makeBracketData([])} />)
    expect(screen.getByText(/Loading bracket dashboard/i)).toBeInTheDocument()
  })

  it('renders a round label for the correct round number', () => {
    renderWithRouter(<DashboardPage bracketData={makeBracketData([sampleGame])} />)
    expect(screen.getByText('First Round')).toBeInTheDocument()
  })

  it('renders game title in a card', () => {
    renderWithRouter(<DashboardPage bracketData={makeBracketData([sampleGame])} />)
    expect(screen.getByText('South Region Game 1')).toBeInTheDocument()
  })

  it('renders both team names in a game card', () => {
    renderWithRouter(<DashboardPage bracketData={makeBracketData([sampleGame])} />)
    expect(screen.getByText(/Duke/)).toBeInTheDocument()
    expect(screen.getByText(/UNC/)).toBeInTheDocument()
  })

  it('applies winner class only to the winning team', () => {
    renderWithRouter(<DashboardPage bracketData={makeBracketData([sampleGame])} />)
    const winnerEl = screen.getByText(/\(1\) Duke/)
    const loserEl = screen.getByText(/\(2\) UNC/)
    expect(winnerEl).toHaveClass('winner')
    expect(loserEl).not.toHaveClass('winner')
  })

  it('renders team scores', () => {
    renderWithRouter(<DashboardPage bracketData={makeBracketData([sampleGame])} />)
    expect(screen.getByText('80')).toBeInTheDocument()
    expect(screen.getByText('72')).toBeInTheDocument()
  })

  it('groups games by round and shows game count', () => {
    const games = [
      { ...sampleGame, contestId: 1 },
      { ...sampleGame, contestId: 2 },
    ]
    renderWithRouter(<DashboardPage bracketData={makeBracketData(games)} />)
    expect(screen.getByText('2 games')).toBeInTheDocument()
  })

  it('renders correct label for each known round', () => {
    const roundCases = [
      { bracketPositionId: 101, label: 'First Four' },
      { bracketPositionId: 201, label: 'First Round' },
      { bracketPositionId: 301, label: 'Second Round' },
      { bracketPositionId: 401, label: 'Sweet 16' },
      { bracketPositionId: 501, label: 'Elite Eight' },
      { bracketPositionId: 601, label: 'Final Four' },
      { bracketPositionId: 701, label: 'Championship' },
    ]

    for (const { bracketPositionId, label } of roundCases) {
      const { unmount } = renderWithRouter(
        <DashboardPage bracketData={makeBracketData([{ ...sampleGame, bracketPositionId }])} />
      )
      expect(screen.getByText(label)).toBeInTheDocument()
      unmount()
    }
  })

  it('renders the back home link', () => {
    renderWithRouter(<DashboardPage bracketData={null} />)
    expect(screen.getByRole('link', { name: /back home/i })).toBeInTheDocument()
  })

  it('renders the page heading', () => {
    renderWithRouter(<DashboardPage bracketData={null} />)
    expect(
      screen.getByRole('heading', { name: /March Madness Bracket Dashboard/i })
    ).toBeInTheDocument()
  })
})
