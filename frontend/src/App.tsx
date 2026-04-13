import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import type { User } from '@supabase/supabase-js'
import { useLocation, useNavigate } from 'react-router-dom'
import { ncaaApi } from './services/ncaaApi.ts'
import { useNcaaData } from './hooks/useNcaaData.ts'
import TeamsPage from './TeamsPage.tsx'
import './App.css'

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [count, setCount] = useState(0)
  const [prismaTestResult, setPrismaTestResult] = useState<string>('')
  const [prismaTestLoading, setPrismaTestLoading] = useState(false)

  // NCAA API data
  const { data: scoreboardData } = useNcaaData(ncaaApi.getScoreboard)
  const { data: bracketData } = useNcaaData(ncaaApi.getBracket)

  async function testPrismaUsers() {
    setPrismaTestLoading(true)
    setPrismaTestResult('')
    try {
      const { data, error } = await supabase
        .from('users')
        .upsert({
          username: 'user123',
          password: 'password123',
          email: 'user123@gmail.com',
        })
        .select()

      if (error) {
        throw new Error(error.message)
      }
      setPrismaTestResult(JSON.stringify(data))
    } catch (e) {
      setPrismaTestResult(e instanceof Error ? e.message : String(e))
    } finally {
      setPrismaTestLoading(false)
    }
  }

  // Build ticker from real API data, fallback to hardcoded if loading
  const fallbackTickerItems = [
    'DUKE 87 — KANSAS 74',
    'GONZAGA 91 — ARIZONA 88 OT',
    'HOUSTON 76 — TENNESSEE 69',
    'PURDUE 83 — IOWA ST 71',
    'UCONN 95 — SAN DIEGO ST 80',
    'ALABAMA 102 — CLEMSON 90',
  ]

  const liveTickerItems: string[] =
    scoreboardData?.games?.map((game: any) => {
      const home = game.home?.names?.short ?? 'HOME'
      const away = game.away?.names?.short ?? 'AWAY'
      const homeScore = game.home?.score ?? ''
      const awayScore = game.away?.score ?? ''
      const status = game.gameState === 'live' ? ' 🔴' : ''
      return `${home} ${homeScore} — ${away} ${awayScore}${status}`
    }) ?? fallbackTickerItems

  const tickerItems = [...liveTickerItems, ...liveTickerItems]

  const liveGameCount =
    scoreboardData?.games?.filter((g: any) => g.gameState === 'live').length ?? 14

  const topScorer = bracketData?.regions?.[0]?.games?.[0]?.home?.names?.short ?? 'Cooper Flagg'

  const stats = [
    { label: 'Teams Tracked', value: '364', delta: '+12 this week', type: '' },
    {
      label: 'Live Games',
      value: String(liveGameCount),
      delta: '● broadcasting',
      type: 'up',
    },
    { label: 'Pts/Game Leader', value: '31.2', delta: topScorer, type: 'hot' },
    { label: 'Model Accuracy', value: '87%', delta: '↑ 2.4% vs last yr', type: 'up' },
  ]

  const features = [
    {
      icon: '📡',
      title: 'Real-Time Data',
      desc: 'Live score ingestion with sub-second latency. Every possession, every stat update — streamed directly to your dashboard.',
      tag: 'Powered by Supabase Realtime',
    },
    {
      icon: '📊',
      title: 'Deep Analytics',
      desc: 'Offensive rating, defensive efficiency, pace, true shooting %. The metrics that actually predict tournament outcomes.',
      tag: 'Advanced Metrics',
    },
    {
      icon: '🏆',
      title: 'Bracket Intelligence',
      desc: 'Seed matchup analytics and historical upset patterns so you stop picking your alma mater to win the whole thing.',
      tag: 'ML-Assisted',
    },
  ]

  const marqueeItems = [
    { num: '68', label: 'Tournament Teams' },
    { num: '63', label: 'Games Played' },
    { num: '2.4M', label: 'Data Points' },
    { num: '99.9%', label: 'Uptime SLA' },
    { num: '364', label: 'Teams Indexed' },
    { num: '<50ms', label: 'Avg Latency' },
    { num: '68', label: 'Tournament Teams' },
    { num: '63', label: 'Games Played' },
    { num: '2.4M', label: 'Data Points' },
    { num: '99.9%', label: 'Uptime SLA' },
    { num: '364', label: 'Teams Indexed' },
    { num: '<50ms', label: 'Avg Latency' },
  ]

  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (location.pathname === '/teams') {
    return <TeamsPage bracketData={bracketData} />
  }

  return (
    <>
      {/* NAV */}
      <nav>
        <div className="nav-logo">
          M<span>3</span>
        </div>
        <ul className="nav-links">
          <li>
            <a href="#features">Features</a>
          </li>
          <li>
            <a href="#stats">Stats</a>
          </li>
          <li>
            <a href="#bracket">Bracket</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
        </ul>
        <button className="nav-cta">{user ? 'Log In →' : 'Sign Up →'}</button>
      </nav>

      {/* LIVE TICKER */}
      <div className="ticker">
        <div className="ticker-track">
          {tickerItems.map((item, i) => (
            <span key={i} className="ticker-item">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-grid-bg" />

        <div className="hero-left">
          <div className="hero-badge">
            {scoreboardData ? '● Live NCAA Data' : '● Live Season Data'}
          </div>
          <h1 className="hero-title">
            March
            <span className="accent">Madness</span>
            Metrics.
          </h1>
          <p className="hero-sub">
            The analytics platform college basketball deserved all along. Real-time stats, bracket
            intelligence, and team insights — all in one terminal.
          </p>
          <div className="hero-actions">
            <button className="btn-primary">View Dashboard →</button>
            <button className="btn-ghost" onClick={() => navigate('/teams')}>
              Explore Teams
            </button>
          </div>
        </div>
        <button className="counter" onClick={() => setCount((count) => count + 1)}>
          Count is {count}
        </button>

        <button className="counter" onClick={testPrismaUsers} disabled={prismaTestLoading}>
          {prismaTestLoading ? 'Testing Prisma…' : 'Test Prisma (users table)'}
        </button>

        {prismaTestResult ? (
          <pre
            style={{
              marginTop: 12,
              maxWidth: 720,
              textAlign: 'left',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              background: 'rgba(0,0,0,0.4)',
              padding: 12,
              borderRadius: 8,
            }}
          >
            {prismaTestResult}
          </pre>
        ) : null}
      </section>

      <div className="hero-right">
        <div className="terminal">
          <div className="terminal-body">
            {stats.map((s) => (
              <div key={s.label} className="stat-cell">
                <span className="stat-label">{s.label}</span>
                <span className={`stat-value ${s.type}`}>{s.value}</span>
                <span className="stat-delta">{s.delta}</span>
              </div>
            ))}
          </div>
          <div className="terminal-footer">
            <span>SRC: NCAA API</span>
            <span>{scoreboardData ? 'LIVE DATA' : 'UPDATED 0.4s AGO'}</span>
          </div>
        </div>
      </div>

      {/* MARQUEE */}
      <div className="stats-marquee">
        <div className="marquee-track">
          {marqueeItems.map((item, i) => (
            <div key={i} className="marquee-item">
              <span className="marquee-num">{item.num}</span>
              <span className="marquee-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section className="features" id="features">
        <p className="section-label">// core platform</p>
        <h2 className="section-title">
          Built Different.
          <br />
          For the Data-Obsessed.
        </h2>
        <div className="features-grid">
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <span className="feature-icon">{f.icon}</span>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
              <span className="feature-tag">{f.tag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* BRACKET */}
      <section id="bracket" style={{ padding: '60px 40px', maxWidth: '700px', margin: '0 auto' }}>
        <p className="section-label">// 2026 tournament</p>
        <h2 className="section-title">Bracket Results.</h2>
        {bracketData?.championships?.[0]?.games?.map((game: any) => {
          const top = game.teams.find((t: any) => t.isTop)
          const bot = game.teams.find((t: any) => !t.isTop)
          return (
          <div key={game.contestId} style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.07)', fontSize: '14px' }}>
            <span style={{ color: top?.isWinner ? '#fff' : 'rgba(255,255,255,0.4)' }}>{top?.nameShort} {top?.score}</span>
            <span style={{ color: 'rgba(255,255,255,0.3)', margin: '0 8px' }}>vs</span>
            <span style={{ color: bot?.isWinner ? '#fff' : 'rgba(255,255,255,0.4)' }}>{bot?.nameShort} {bot?.score}</span>
            </div>
            )
            })}
            </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">
          M<span>3</span> — March Madness Metrics
        </div>
        <p className="footer-copy">SSW 590-WS · Stevens Institute of Technology · 2025</p>
      </footer>
    </>
  )
}