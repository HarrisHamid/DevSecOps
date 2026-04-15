import { useEffect, useMemo, useState } from 'react'
import { supabase } from './lib/supabase'

export default function TeamPage({ team }: { team: string }) {
  const [teamId, setTeamId] = useState<number | null>(null)
  const [players, setPlayers] = useState<Array<Record<string, unknown>>>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const statColumns = useMemo(
    () => [
      'Individual_GP',
      'Individual_MIN',
      'Individual_PTS',
      'Individual_REB',
      'Individual_AST',
      'Individual_STL',
      'Individual_BLK',
      'Individual_TO',
      'Individual_FG%',
      'Individual_FT%',
      'Individual_3P%',
      'Season_MIN',
      'Season_FGM',
      'Season_FGA',
      'Season_FTM',
      'Season_FTA',
      'Season_3PM',
      'Season_3PA',
      'Season_PTS',
      'Season_OR',
      'Season_DR',
      'Season_REB',
      'Season_AST',
      'Season_TO',
      'Season_STL',
      'Season_BLK',
    ],
    []
  )

  useEffect(() => {
    let cancelled = false

    async function getTeamId() {
      setError('')
      setTeamId(null)
      try {
        const { data, error } = await supabase.from('teams').select('id').eq('name', team).limit(1)
        if (error) throw new Error(error.message)

        const id = (data?.[0] as { id?: number } | undefined)?.id
        if (!cancelled) setTeamId(typeof id === 'number' ? id : null)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e))
      }
    }

    getTeamId()
    return () => {
      cancelled = true
    }
  }, [team])

  useEffect(() => {
    let cancelled = false

    async function getPlayers() {
      if (typeof teamId !== 'number') return
      setLoading(true)
      setError('')
      try {
        const selectCols = ['player_name', ...statColumns].map((c) => `"${c}"`).join(', ')
        const { data, error } = await supabase
          .from('players')
          .select(selectCols)
          .eq('team_id', teamId)
          .order('player_name', { ascending: true })

        if (error) throw new Error(error.message)
        if (!cancelled)
          setPlayers(Array.isArray(data) ? (data as unknown as Array<Record<string, unknown>>) : [])
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    getPlayers()
    return () => {
      cancelled = true
    }
  }, [statColumns, teamId])

  return (
    <main className="team-page">
      <h1 className="hero-title">{team}</h1>
      {error ? <p className="teams-empty">{error}</p> : null}
      {loading ? <p className="teams-empty">Loading players…</p> : null}

      <div className="teams-table-wrapper">
        <table className="teams-table">
          <thead>
            <tr>
              <th>Name</th>
              {statColumns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {players.map((p) => (
              <tr key={String(p.player_name ?? Math.random())}>
                <td>{String(p.player_name ?? '')}</td>
                {statColumns.map((col) => (
                  <td key={col}>{p[col] == null ? '' : String(p[col])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
