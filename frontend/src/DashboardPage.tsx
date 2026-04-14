import { useMemo } from 'react'
import { Link } from 'react-router-dom'

type Team = {
  nameShort?: string
  score?: number
  seed?: number
  isTop?: boolean
  isWinner?: boolean
}

type Game = {
  contestId?: number
  bracketPositionId?: number
  title?: string
  teams?: Team[]
}

type Championship = {
  games?: Game[]
}

const ROUND_LABELS: Record<number, string> = {
  1: 'First Four',
  2: 'First Round',
  3: 'Second Round',
  4: 'Sweet 16',
  5: 'Elite Eight',
  6: 'Final Four',
  7: 'Championship',
}

function getRoundNumber(game: Game) {
  const position = game.bracketPositionId ?? 0
  return Math.floor(position / 100)
}

export default function DashboardPage({ bracketData }: { bracketData: unknown }) {
  const groupedRounds = useMemo(() => {
    const championship = (bracketData as { championships?: Championship[] } | null)?.championships?.[0]
    const games = championship?.games ?? []

    const groups = new Map<number, Game[]>()
    games.forEach((game) => {
      const round = getRoundNumber(game)
      if (!groups.has(round)) groups.set(round, [])
      groups.get(round)?.push(game)
    })

    return Array.from(groups.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([round, roundGames]) => ({
        round,
        label: ROUND_LABELS[round] ?? `Round ${round}`,
        games: roundGames.sort(
          (a, b) => (a.bracketPositionId ?? Number.MAX_SAFE_INTEGER) - (b.bracketPositionId ?? Number.MAX_SAFE_INTEGER),
        ),
      }))
  }, [bracketData])

  const totalGames = groupedRounds.reduce((sum, round) => sum + round.games.length, 0)

  return (
    <main className="dashboard-page">
      <div className="dashboard-header">
        <h1>March Madness Bracket Dashboard</h1>
        <p>Live 2026 bracket results from NCAA data</p>
      </div>

      <div className="dashboard-actions">
        <Link to="/" className="btn-ghost teams-back-link">
          ← Back Home
        </Link>
      </div>

      {totalGames === 0 ? (
        <p className="teams-empty">Loading bracket dashboard...</p>
      ) : (
        <section className="bracket-board" aria-label="March Madness bracket board">
          {groupedRounds.map((roundGroup) => (
            <div key={roundGroup.round} className="bracket-round-column">
              <h2>{roundGroup.label}</h2>
              <span>{roundGroup.games.length} games</span>

              {roundGroup.games.map((game) => {
                const top = game.teams?.find((team) => team.isTop)
                const bottom = game.teams?.find((team) => !team.isTop)
                return (
                  <article key={game.contestId} className="bracket-game-card">
                    <div className="bracket-game-title">{game.title ?? 'Game'}</div>
                    <div className="bracket-team-row">
                      <span className={top?.isWinner ? 'team-name winner' : 'team-name'}>
                        ({top?.seed ?? '-'}) {top?.nameShort ?? 'TBD'}
                      </span>
                      <span className="team-score">{top?.score ?? '-'}</span>
                    </div>
                    <div className="bracket-team-row">
                      <span className={bottom?.isWinner ? 'team-name winner' : 'team-name'}>
                        ({bottom?.seed ?? '-'}) {bottom?.nameShort ?? 'TBD'}
                      </span>
                      <span className="team-score">{bottom?.score ?? '-'}</span>
                    </div>
                  </article>
                )
              })}
            </div>
          ))}
        </section>
      )}
    </main>
  )
}
