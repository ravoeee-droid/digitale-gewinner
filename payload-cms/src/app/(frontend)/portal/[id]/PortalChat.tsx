'use client'

import { useState } from 'react'

type ChatMessage = { role: 'user' | 'assistant'; content: string }

export default function PortalChat({ pageId }: { pageId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [lastDraftSaved, setLastDraftSaved] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setLastDraftSaved(false)
    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: text }]
    setMessages(nextMessages)
    setLoading(true)

    try {
      const res = await fetch('/api/portal-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ pageId, messages: nextMessages.slice(-20) }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data?.error || 'Das hat gerade nicht geklappt.' },
        ])
        return
      }
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
      setLastDraftSaved(Boolean(data.draftSaved))
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Verbindung gerade nicht möglich.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="portal-chat">
      <div className="portal-chat-messages">
        {messages.length === 0 && (
          <p className="portal-chat-hint">Schreib einfach los, was sich ändern soll.</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`portal-chat-msg ${m.role}`}>
            {m.content}
          </div>
        ))}
        {loading && <div className="portal-chat-msg assistant typing">schreibt …</div>}
      </div>
      {lastDraftSaved && (
        <p className="portal-chat-draft-note">
          ✓ Entwurf gespeichert — wartet auf Freigabe durch Digitale Gewinner.
        </p>
      )}
      <form className="portal-chat-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Was soll sich ändern?"
          maxLength={2000}
          required
        />
        <button type="submit" disabled={loading}>
          →
        </button>
      </form>
    </div>
  )
}
