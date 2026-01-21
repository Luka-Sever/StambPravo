import { useEffect, useMemo, useState } from 'react'
import { meetingService } from '../services/meetingService.js'

function Home() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [meetings, setMeetings] = useState([])

  const [selectedId, setSelectedId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await meetingService.getAll()
        if (!cancelled) setMeetings(Array.isArray(data) ? data : [])
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Greška pri dohvaćanju sastanaka.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const normalized = useMemo(() => {
    return (meetings || [])
      .map((m) => ({
        id: m.meetingId ?? m.id,
        title: m.title,
        summary: m.summary,
        status: m.status,
        meetingStartTime: m.meetingStartTime,
        meetingLocation: m.meetingLocation,
        items: m.items || [],
      }))
      .filter((m) => m.id != null)
      .sort((a, b) => new Date(b.meetingStartTime || 0) - new Date(a.meetingStartTime || 0))
  }, [meetings])

  const active = useMemo(
    () => normalized.filter((m) => m.status !== 'Archived'),
    [normalized]
  )

  const selected = useMemo(() => {
    if (!selectedId) return null
    return normalized.find((m) => m.id === selectedId) || null
  }, [normalized, selectedId])

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
          <span className="dashboard-pill">Sastanci</span>
          <span className="dashboard-meta">
            {active.length} ukupno
          </span>
        </div>
      </div>

      {loading ? (
        <section className="archive">
          <div className="archive-empty">Učitavanje...</div>
        </section>
      ) : error ? (
        <section className="archive">
          <div className="archive-empty">{error}</div>
        </section>
      ) : (
        <>
          <section className="archive">
            <div className="archive-block-title">Novi sastanci</div>
            <div className="archive-grid">
              <div className="archive-list" aria-label="Popis novih sastanaka">
                {active.length === 0 ? (
                  <div className="archive-empty">Nema novih sastanaka.</div>
                ) : (
                  active.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      className="archive-item"
                      onClick={() => {
                        setSelectedId(m.id)
                        setIsModalOpen(true)
                      }}
                    >
                      <div className="archive-item-top">
                        <div className="archive-item-title">{m.title}</div>
                        <span className="badge-unread">Novo</span>
                      </div>
                      <div className="archive-item-date">{formatDate(m.meetingStartTime)} • {m.meetingLocation}</div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </section>
        </>
      )}

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
                  {(selected.items || []).length === 0 ? (
                    <div className="archive-empty">Nema točaka dnevnog reda.</div>
                  ) : (
                    (selected.items || []).map((it) => {
                      const num = it.itemNumber ?? it.id?.itemNumber ?? it.item_number
                      return (
                        <div key={`${selected.id}-${num ?? it.title}`} className="agenda-item">
                          <div className="agenda-item-title">{num ? `${num}. ` : ''}{it.title}</div>
                          <div className="agenda-item-summary">{it.summary}</div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
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


