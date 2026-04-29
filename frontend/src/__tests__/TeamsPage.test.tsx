import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import TeamsPage from '../TeamsPage'

const renderWithRouter = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>)

const makeBracketData = (teams: { nameShort: string; score: number }[][]) => ({
  championships: [
    {
      games: teams.map((gameteams, i) => ({
        contestId: i,
        bracketPositionId: 100 + i,
        title: `Game ${i}`,
        teams: gameteams,
      })),
    },
  ],
})

describe('TeamsPage', () => {
  it('shows empty-state message when bracketData is null', () => {
    renderWithRouter(<TeamsPage bracketData={null} />)
    expect(screen.getByText(/Loading teams from bracket data/i)).toBeInTheDocument()
  })

  it('shows empty-state message when bracketData has no teams', () => {
    renderWithRouter(<TeamsPage bracketData={{}} />)
    expect(screen.getByText(/Loading teams from bracket data/i)).toBeInTheDocument()
  })

  it('renders a row for each unique team in the bracket', () => {
    const data = makeBracketData([
      [
        { nameShort: 'Duke', score: 80 },
        { nameShort: 'UNC', score: 72 },
      ],
    ])
    renderWithRouter(<TeamsPage bracketData={data} />)
    expect(screen.getByText('Duke')).toBeInTheDocument()
    expect(screen.getByText('UNC')).toBeInTheDocument()
  })

  it('accumulates scores across multiple appearances and shows averaged value', () => {
    // Duke appears twice: 80 + 90 = 170, avg = 85
    const data = makeBracketData([
      [
        { nameShort: 'Duke', score: 80 },
        { nameShort: 'UNC', score: 72 },
      ],
      [
        { nameShort: 'Kansas', score: 75 },
        { nameShort: 'Duke', score: 90 },
      ],
    ])
    renderWithRouter(<TeamsPage bracketData={data} />)
    expect(screen.getByText('85')).toBeInTheDocument()
  })

  it('sorts teams by average score descending', () => {
    const data = makeBracketData([
      [
        { nameShort: 'LowTeam', score: 50 },
        { nameShort: 'HighTeam', score: 95 },
      ],
    ])
    renderWithRouter(<TeamsPage bracketData={data} />)
    const rows = screen.getAllByRole('row')
    // rows[0] = header, rows[1] = highest avg, rows[2] = lowest avg
    expect(rows[1]).toHaveTextContent('HighTeam')
    expect(rows[2]).toHaveTextContent('LowTeam')
  })

  it('renders team links pointing to /teams/:name', () => {
    const data = makeBracketData([[{ nameShort: 'Duke', score: 80 }]])
    renderWithRouter(<TeamsPage bracketData={data} />)
    const link = screen.getByRole('link', { name: 'Duke' })
    expect(link).toHaveAttribute('href', '/teams/Duke')
  })

  it('renders the page header', () => {
    renderWithRouter(<TeamsPage bracketData={null} />)
    expect(screen.getByRole('heading', { name: /teams/i })).toBeInTheDocument()
  })

  it('renders the back home link', () => {
    renderWithRouter(<TeamsPage bracketData={null} />)
    expect(screen.getByRole('link', { name: /back home/i })).toBeInTheDocument()
  })
})
