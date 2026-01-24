import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { meetingService } from '../services/meetingService.js'

export default function Arhiva() {
    const { user } = useAuth()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [meetings, setMeetings] = useState([])

    const [selectedId, setSelectedId] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        let cancelled = false
            ; (async () => {
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
        return () => { cancelled = true }
    }, [])

    const userBuildingId = useMemo(() => {
        const id = user?.building?.buildingId ?? user?.buildingId
        return id == null ? null : String(id)
    }, [user])

    useEffect(() => {
        if (!isModalOpen) return
        const onKeyDown = (e) => {
            if (e.key === 'Escape') setIsModalOpen(false)
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [isModalOpen])

    const archivedMeetings = useMemo(() => {
        return (meetings || [])
            .map((m) => ({
                id: m.meetingId ?? m.id,
                title: m.title,
                summary: m.summary,
                status: m.status,
                meetingStartTime: m.meetingStartTime,
                meetingLocation: m.meetingLocation,
                buildingId: (() => {
                    const id = m.buildingId ?? m.building_id ?? m.building?.buildingId ?? m.building?.id
                    return id == null ? null : String(id)
                })(),
                items: m.items || [],
            }))
            .filter((m) => {
                if (m.id == null || m.status !== 'Archived') return false
                if (!userBuildingId) return true
                return m.buildingId != null && m.buildingId === userBuildingId
            })
            .sort((a, b) => new Date(b.meetingStartTime || 0) - new Date(a.meetingStartTime || 0))
    }, [meetings, userBuildingId])

    const selected = useMemo(() => {
        if (!selectedId) return null
        return archivedMeetings.find((m) => m.id === selectedId) || null
    }, [archivedMeetings, selectedId])

    const formatDate = (dateStr) => {
        const d = new Date(dateStr)
        if (Number.isNaN(d.getTime())) return dateStr
        return d.toLocaleString('hr-HR')
    }

    return (
        <div className="page-container">
            <h1 className="admin-title">Arhivirani sastanci</h1>

            {loading ? (
                <div className="archive">
                    <div className="archive-empty">Učitavanje...</div>
                </div>
            ) : error ? (
                <div className="archive">
                    <div className="archive-empty">{error}</div>
                </div>
            ) : (
                <div className="archive">
                    <div className="archive-grid">
                        <div className="archive-list">
                            {archivedMeetings.length === 0 ? (
                                <div className="archive-empty">Nema arhiviranih sastanaka.</div>
                            ) : (
                                archivedMeetings.map((m) => (
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
                                            <span className="status-badge status-badge--arhiviran">ARHIVIRAN</span>
                                        </div>
                                        <div className="archive-item-date">
                                            {formatDate(m.meetingStartTime)} • {m.meetingLocation}
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {isModalOpen && selected && (
                <div className="modal-overlay" role="dialog" aria-modal="true" onClick={() => setIsModalOpen(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title-wrap">
                                <div className="modal-title">{selected.title}</div>
                                <div className="modal-subtitle">
                                    {formatDate(selected.meetingStartTime)} • {selected.meetingLocation}
                                </div>
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
    );
}