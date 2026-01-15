import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import pastMeetingsData from '../mocks/pastMeetings.json'

export default function Obavijesti() {
    const { user, isAuthenticated } = useAuth()
    const [loading, setLoading] = useState(true)
    const [viewedOverrides, setViewedOverrides] = useState({})
    const [selectedId, setSelectedId] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const userKey = useMemo(() => {
        const email = user?.email
        const username = user?.username
        const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim()
        return email || username || fullName || user?.role?.toLowerCase() || (isAuthenticated ? 'user' : 'anon')
    }, [user, isAuthenticated])

    const storageKey = useMemo(() => `pastMeetingsViewed:${userKey}`, [userKey])

    useEffect(() => {
        try {
            const raw = localStorage.getItem(storageKey)
            setViewedOverrides(raw ? JSON.parse(raw) : {})
        } catch {
            setViewedOverrides({})
        } finally {
            setLoading(false)
        }
    }, [storageKey])

    useEffect(() => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(viewedOverrides))
        } catch {
            // ignore
        }
    }, [storageKey, viewedOverrides])

    useEffect(() => {
        if (!isModalOpen) return
        const onKeyDown = (e) => {
            if (e.key === 'Escape') setIsModalOpen(false)
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [isModalOpen])

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
        if (viewedOverrides[meeting.id] !== undefined) return !!viewedOverrides[meeting.id]
        const fromMock = meeting?.viewedBy?.[userKey]
        if (fromMock !== undefined) return !!fromMock
        return false
    }

    const unreadMeetings = useMemo(() => meetings.filter((m) => !isViewed(m)), [meetings, viewedOverrides, userKey])

    const selected = useMemo(() => {
        if (!selectedId) return null
        return meetings.find((m) => m.id === selectedId) || null
    }, [meetings, selectedId])

    const formatDate = (dateStr) => {
        const d = new Date(dateStr)
        if (Number.isNaN(d.getTime())) return dateStr
        return d.toLocaleString('hr-HR')
    }

    return (
        <div className="page-container">
            <h1 className="admin-title">Obavijesti</h1>

            {loading ? (
                <div className="archive">
                    <div className="archive-empty">Učitavanje...</div>
                </div>
            ) : (
                <div className="archive">
                    <div className="archive-grid">
                        <div className="archive-list">
                            {unreadMeetings.length === 0 ? (
                                <div className="archive-empty">Nema nepročitanih sastanaka.</div>
                            ) : (
                                unreadMeetings.map((m) => (
                                    <button
                                        key={m.id}
                                        type="button"
                                        className="archive-item"
                                        onClick={() => {
                                            setSelectedId(m.id)
                                            setIsModalOpen(true)
                                            setViewedOverrides((prev) => ({ ...prev, [m.id]: true }))
                                        }}
                                    >
                                        <div className="archive-item-top">
                                            <div className="archive-item-title">{m.title}</div>
                                            <span className="badge-unread">Novo</span>
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