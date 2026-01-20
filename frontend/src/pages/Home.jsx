import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import pastMeetingsData from '../mocks/pastMeetings.json'

function Home() {
  const { user, isAuthenticated } = useAuth()

  const userKey = useMemo(() => {
    const email = user?.email
    const username = user?.username
    const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim()
    return email || username || fullName || user?.role?.toLowerCase() || (isAuthenticated ? 'user' : 'anon')
  }, [user, isAuthenticated])

  const storageKey = useMemo(() => `pastMeetingsViewed:${userKey}`, [userKey])
  const [selectedId, setSelectedId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const [viewedOverrides, setViewedOverrides] = useState(() => {
    return JSON.parse(localStorage.getItem(storageKey)) ||  []
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(viewedOverrides)), [viewedOverrides];
  })

  /**
   * 
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      setViewedOverrides(raw ? JSON.parse(raw) : {})
    } catch {
      setViewedOverrides({})
    }
  }, [storageKey])
  
  */
/**
 * 
useEffect(() => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(viewedOverrides))
  } catch {
    // ignore
  }
}, [storageKey, viewedOverrides])

*/
  const meetings = useMemo(() => {
    const normalized = (pastMeetingsData || []).map((m) => ({
      ...m,
      dateObj: new Date(m.meetingStartTime),
    }))
    normalized.sort((a, b) => b.dateObj - a.dateObj)
    return normalized
  }, [])

  const isViewed = (meeting) => {
    if (!meeting?.id) return true
    if (viewedOverrides[meeting.id] !== undefined) return viewedOverrides[meeting.id]
    const fromMock = meeting?.viewedBy?.[userKey]
    if (fromMock !== undefined) return fromMock
    // fallback: if userKey isn't present in mock, treat as not viewed
    return false
  }

  const filtered = useMemo(() => {
    return meetings
  }, [meetings])

  const unreadCount = useMemo(() => filtered.filter((m) => !isViewed(m)).length, [filtered, viewedOverrides, userKey])

  const selected = useMemo(() => {
    if (!selectedId) return null
    return meetings.find((m) => m.id === selectedId) || null
  }, [meetings, selectedId])

  useEffect(() => {
    if (!isModalOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsModalOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isModalOpen])

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    if (Number.isNaN(d.getTime())) return dateStr
    return d.toLocaleString('hr-HR')
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-subtitle">
          <span className="dashboard-pill">Arhiva sastanaka</span>
          <span className="dashboard-meta">
            {filtered.length} ukupno • {unreadCount} nepročitano
          </span>
        </div>
      </div>

      <section className="archive">


        <div className="archive-grid">
          <div className="archive-list" aria-label="Popis proteklih sastanaka">
            {filtered.map((m) => {
              const unread = !isViewed(m)
              return (
                <button
                  key={m.id}
                  type="button"
                  className="archive-item"
                  onClick={() => {
                    setSelectedId(m.id)
                    setIsModalOpen(true)
                    // otvaranje modala = smatra se pročitanim
                    setViewedOverrides((prev) => ({ ...prev, [m.id]: true }))
                  }}
                >
                  <div className="archive-item-top">
                    <div className="archive-item-title">{m.title}</div>
                    {unread && <span className="badge-unread">Novo</span>}
                  </div>
                  <div className="archive-item-date">{formatDate(m.meetingStartTime)} • {m.meetingLocation}</div>
                </button>
              )
            })}

            {filtered.length === 0 && (
              <div className="archive-empty">
                Nema dostupnih sastanaka u arhivi.
              </div>
            )}
          </div>
        </div>
      </section>

      {isModalOpen && selected && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={`Detalji sastanka: ${selected.title}`}
          onClick={() => setIsModalOpen(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <div className="modal-title">{selected.title}</div>
                <div className="modal-subtitle">{formatDate(selected.meetingStartTime)} • {selected.meetingLocation}</div>
              </div>

              <button type="button" className="modal-close" onClick={() => setIsModalOpen(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="archive-block">
                <div className="archive-block-title">Opis</div>
                <div className="archive-pre">{selected.summary}</div>
              </div>

              <div className="archive-block">
                <div className="archive-block-title">Točke dnevnog reda</div>
                <div className="agenda-list">
                  {(selected.items || []).map((it) => (
                    <div key={`${selected.id}-${it.item_number}`} className="agenda-item">
                      <div className="agenda-item-title">{it.item_number}. {it.title}</div>
                      <div className="agenda-item-summary">{it.summary}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="auth-button outline"
                onClick={() => {
                  setViewedOverrides((prev) => ({ ...prev, [selected.id]: false }))
                  setIsModalOpen(false)
                }}
              >
                Označi kao nepročitano
              </button>
              <button type="button" className="auth-button dark" onClick={() => setIsModalOpen(false)}>
                Zatvori
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home


