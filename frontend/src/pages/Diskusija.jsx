import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { meetingService } from '../services/meetingService';

export default function Diskusija() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [discussions, setDiscussions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const STANBLOG_BASE_URL = 'https://progistanblog.azurewebsites.net';

    const canCreateMeeting = user?.role === 'ADMIN' || user?.role === 'REP';

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [draft, setDraft] = useState({
        title: '',
        summary: '',
        meetingLocation: '',
        meetingStartTime: '',
        firstItemTitle: '',
        firstItemSummary: '',
    });

    useEffect(() => {
        const apiKey = import.meta.env.VITE_STANBLOG_API_KEY;

        (async () => {
            try {
                setLoading(true);
                setError(null);

                // relative path to the backend endpoint
                const res = await fetch('https://stanplan-136r.onrender.com/diskusije', {
                    method: 'GET',
                    headers: apiKey ? { 'x-api-key': apiKey } : undefined,
                });

                if (!res.ok) {
                    const text = await res.text().catch(() => '');
                    throw new Error(text || res.statusText || 'Request failed');
                }
                console.log(res);
                const data = await res.json();
                setDiscussions(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Greška pri dohvaćanju diskusija:", err);
                setError(err?.message || 'Greška pri dohvaćanju diskusija.');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        if (!isCreateModalOpen) return;
        const onKeyDown = (e) => {
            if (e.key === 'Escape') setIsCreateModalOpen(false);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isCreateModalOpen]);

    if (loading) return <div className="page-container">Učitavanje diskusija...</div>;

    const formatDate = (iso) => {
        if (!iso) return '';
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return iso;
        return d.toLocaleString('hr-HR');
    };

    const toStanBlogUrl = (link) => {
        if (!link) return '';
        if (/^https?:\/\//i.test(link)) return link;
        const normalized = link.startsWith('/') ? link : `/${link}`;
        return `${STANBLOG_BASE_URL}${normalized}`;
    };

    const openCreateMeeting = (d) => {
        setDraft({
            title: d?.title || '',
            summary: d?.description || '',
            meetingLocation: '',
            meetingStartTime: '',
            firstItemTitle: d?.question || '',
            firstItemSummary: '',
        });
        setIsCreateModalOpen(true);
    };

    const buildingId = user?.building?.buildingId ?? user?.buildingId ?? null;

    const handleCreateSubmit = async (e) => {
        e.preventDefault();

        if (!draft.title || !draft.meetingLocation || !draft.meetingStartTime || !draft.summary) {
            alert("Sva polja moraju biti popunjena!");
            return;
        }

        try {
            setCreating(true);

            const start = new Date(draft.meetingStartTime);
            const end = new Date(start);
            start.setHours(start.getHours() + 1);
            end.setHours(start.getHours() + 1);

            const payload = {
                meetingStartTime: start.toISOString(),
                meetingEndTime: end.toISOString(),
                meetingLocation: draft.meetingLocation,
                summary: draft.summary,
                title: draft.title,
                status: 'Pending',
                items: [],
                building_id: buildingId || 1,
            };

            const created = await meetingService.create(payload);
            const createdId = created?.meetingId ?? created?.id;

            if (createdId && draft.firstItemTitle?.trim()) {
                await meetingService.addItem(createdId, {
                    title: draft.firstItemTitle.trim(),
                    summary: (draft.firstItemSummary || '').trim(),
                    legal: 0,
                });
            }

            alert("Sastanak uspješno kreiran!");
            setIsCreateModalOpen(false);
            navigate('/sastanci');
        } catch (err) {
            alert("Greška pri kreiranju sastanka: " + (err?.message || 'Nepoznata greška'));
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="page-container">
            <h1 className="admin-title">StanBlog - Diskusije</h1>
            <div className="news-list">
                {error ? (
                    <p className="empty-message">{error}</p>
                ) : discussions.length === 0 ? (
                    <p>Trenutno nema otvorenih diskusija.</p>
                ) : (
                    discussions.map(d => (
                        <div key={d.link || d.createdAt || d.title} className="news-card">
                            <div className="news-header">
                                <h3 className="news-title">{d.title}</h3>
                                <span className="news-date">{formatDate(d.createdAt)}</span>
                            </div>

                            {d.description && <p className="news-content">{d.description}</p>}

                            {d.question && (
                                <p className="news-content">
                                    <b>Pitanje:</b> {d.question}
                                </p>
                            )}

                            {d.link && (
                                <a className="auth-link" href={toStanBlogUrl(d.link)} target="_blank" rel="noreferrer">
                                    Otvori diskusiju
                                </a>
                            )}

                            {(d.link || canCreateMeeting) && (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', gap: '12px' }}>
                                    <div>
                                        {d.link && (
                                            <a className="auth-link" href={toStanBlogUrl(d.link)} target="_blank" rel="noreferrer">
                                                Otvori diskusiju
                                            </a>
                                        )}
                                    </div>
                                    {canCreateMeeting && (
                                        <button
                                            type="button"
                                            className="auth-button"
                                            onClick={() => openCreateMeeting(d)}
                                        >
                                            Kreiraj sastanak iz diskusije
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {isCreateModalOpen && (
                <div
                    className="modal-overlay"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Kreiranje sastanka iz diskusije"
                    onClick={() => !creating && setIsCreateModalOpen(false)}
                >
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title-wrap">
                                <div className="modal-title">Novi sastanak (iz diskusije)</div>
                                <div className="modal-subtitle">Dopunite vrijeme i mjesto, po potrebi prilagodite sadržaj.</div>
                            </div>
                            <button
                                type="button"
                                className="modal-close"
                                onClick={() => setIsCreateModalOpen(false)}
                                disabled={creating}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="modal-body">
                            <form onSubmit={handleCreateSubmit} className="auth-form wide-form">
                                <div className="auth-field">
                                    <label>NASLOV</label>
                                    <input
                                        type="text"
                                        value={draft.title}
                                        onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                                        required
                                        disabled={creating}
                                    />
                                </div>
                                <div className="auth-field">
                                    <label>MJESTO</label>
                                    <input
                                        type="text"
                                        value={draft.meetingLocation}
                                        onChange={(e) => setDraft({ ...draft, meetingLocation: e.target.value })}
                                        required
                                        disabled={creating}
                                    />
                                </div>
                                <div className="auth-field">
                                    <label>VRIJEME</label>
                                    <input
                                        type="datetime-local"
                                        value={draft.meetingStartTime}
                                        onChange={(e) => setDraft({ ...draft, meetingStartTime: e.target.value })}
                                        required
                                        disabled={creating}
                                    />
                                </div>
                                <div className="auth-field">
                                    <label>OPIS</label>
                                    <input
                                        type="text"
                                        value={draft.summary}
                                        onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
                                        required
                                        disabled={creating}
                                    />
                                </div>

                                <div className="auth-field">
                                    <label>PRVA TOČKA DNEVNOG REDA (iz pitanja)</label>
                                    <input
                                        type="text"
                                        value={draft.firstItemTitle}
                                        onChange={(e) => setDraft({ ...draft, firstItemTitle: e.target.value })}
                                        placeholder="Naslov točke"
                                        disabled={creating}
                                    />
                                </div>
                                <div className="auth-field">
                                    <label>OPIS TOČKE (opcionalno)</label>
                                    <input
                                        type="text"
                                        value={draft.firstItemSummary}
                                        onChange={(e) => setDraft({ ...draft, firstItemSummary: e.target.value })}
                                        placeholder="Opis točke"
                                        disabled={creating}
                                    />
                                </div>

                                <div className="modal-footer" style={{ justifyContent: 'flex-end' }}>
                                    <button
                                        type="button"
                                        className="auth-button dark"
                                        onClick={() => setIsCreateModalOpen(false)}
                                        disabled={creating}
                                    >
                                        Odustani
                                    </button>
                                    <button type="submit" className="auth-button primary" disabled={creating}>
                                        {creating ? 'Kreiram...' : 'Kreiraj sastanak'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
