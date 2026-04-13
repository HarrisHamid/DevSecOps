import { useMemo } from 'react'
import { Link } from 'react-router-dom'

type TeamScore = {
  name: string
  total: number
  games: number
}

function collectTeamScores(node: unknown, scores: Map<string, TeamScore>) {
  if (Array.isArray(node)) {
    node.forEach((item) => collectTeamScores(item, scores))
    return
  }

  if (!node || typeof node !== 'object') {
    return
  }

  const record = node as Record<string, unknown>
  const nameValue = record.nameShort ?? record.name
  const scoreValue = record.score

  if (typeof nameValue === 'string' && typeof scoreValue === 'number') {
    const existing = scores.get(nameValue) ?? { name: nameValue, total: 0, games: 0 }
    existing.total += scoreValue
    existing.games += 1
    scores.set(nameValue, existing)
  }

  Object.values(record).forEach((value) => collectTeamScores(value, scores))
}

export default function TeamsPage({ bracketData }: { bracketData: unknown }) {
  const teams = useMemo(() => {
    const scores = new Map<string, TeamScore>()
    collectTeamScores(bracketData, scores)

    return Array.from(scores.values())
      .map((team) => ({
        name: team.name,
        avgScore: Number((team.total / team.games).toFixed(2)),
      }))
      .sort((a, b) => b.avgScore - a.avgScore)
  }, [bracketData])

  return (
    <main className="teams-page">
      <div className="teams-page-header">
        <h1>Teams</h1>
        <p>Average scores from bracket data</p>
      </div>

      <div className="teams-actions">
        <Link to="/" className="btn-ghost teams-back-link">
          ← Back Home
        </Link>
      </div>

      {teams.length === 0 ? (
        <p className="teams-empty">Loading teams from bracket data...</p>
      ) : (
        <div className="teams-table-wrapper">
          <table className="teams-table">
            <thead>
              <tr>
                <th>Team</th>
                <th>Avg Score</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team.name}>
                  <td>{team.name}</td>
                  <td>{team.avgScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
