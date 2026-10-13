'use client'

import { useState } from 'react'

export default function PortalLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        setError('E-Mail oder Passwort stimmt nicht.')
        setLoading(false)
        return
      }
      window.location.href = '/portal'
    } catch {
      setError('Verbindung gerade nicht möglich.')
      setLoading(false)
    }
  }

  return (
    <main className="cms-home">
      <section className="cms-card">
        <span className="eyebrow">Kundenportal</span>
        <h1>Anmelden.</h1>
        <p>Melde dich mit den Zugangsdaten an, die du von Digitale Gewinner erhalten hast.</p>
        <form className="portal-form" onSubmit={handleSubmit}>
          <label>
            E-Mail
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </label>
          <label>
            Passwort
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>
          {error && <p className="portal-error">{error}</p>}
          <button className="portal-submit" type="submit" disabled={loading}>
            {loading ? 'Einen Moment …' : 'Anmelden →'}
          </button>
        </form>
      </section>
    </main>
  )
}
