import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { meetingService } from '../services/meetingService';

export default function Sastanci() {
    const { user } = useAuth();
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [conclusions, setConclusions] = useState({});
    const [newItem, setNewItem] = useState({ title: '', summary: '', legal: 0 });
    const [joiningId, setJoiningId] = useState(null);
    const [busyByKey, setBusyByKey] = useState({});

    const hasPrivileges = user?.role === 'ADMIN' || user?.role === 'REP';
    const userBuildingIdRaw = user?.building?.buildingId ?? user?.buildingId ?? null;
    const userBuildingId = userBuildingIdRaw == null ? null : String(userBuildingIdRaw);

    const isBusy = (key) => !!busyByKey[key];
    const setBusy = (key, val) => {
        setBusyByKey(prev => ({ ...prev, [key]: !!val }));
    };

    const isUserAttending = (meeting) => {
        if (!user?.email || !Array.isArray(meeting?.attendingCoOwners)) return false;
        return meeting.attendingCoOwners.some(co => co?.email === user.email);
    };

    const getMeetingBuildingId = (meeting) => {
        const id =
            meeting?.building?.buildingId ??
            meeting?.buildingId ??
            meeting?.building_id ??
            meeting?.building?.id ??
            null;
        return id == null ? null : String(id);
    };

    const getParticipantsCount = (meeting) => {
        return Array.isArray(meeting?.attendingCoOwners) ? meeting.attendingCoOwners.length : 0;
    };

    useEffect(() => {
        loadMeetings();
    }, []);

    const loadMeetings = async () => {
        try {
            const data = await meetingService.getAll();
            setMeetings(data || []);
        } catch (err) {
            console.error("Greška pri dohvaćanju sastanaka:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (actionFn, id, successMsg, opts = {}) => {
        const { isParticipation = false, busyKey = null } = opts || {};
        try {
            if (isParticipation) setJoiningId(id);
            if (busyKey) setBusy(busyKey, true);
            await actionFn(id);
            alert(successMsg);
            loadMeetings();
        } catch (err) {
            alert(err.message);
        } finally {
            if (isParticipation) setJoiningId(null);
            if (busyKey) setBusy(busyKey, false);
        }
    };

    const handlePublish = async (mId, items) => {
        if (!items || items.length === 0) {
            alert("Sastanak mora imati barem jednu točku dnevnog reda da bi se objavio!");
            return;
        }
        handleAction(meetingService.publish, mId, "Sastanak objavljen!", { busyKey: `publish-${mId}` });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Jeste li sigurni da želite trajno obrisati ovaj sastanak?")) {
            try {
                await meetingService.remove(id);
                alert("Sastanak uspješno obrisan!");
                loadMeetings();
            } catch (err) {
                alert("Greška pri brisanju: " + err.message);
            }
        }
    };

    const handleAddItem = async (mId) => {
        if (!newItem.title || !newItem.summary) {
            alert("Točka mora imati naslov i opis!");
            return;
        }
        try {
            await meetingService.addItem(mId, newItem);
            alert("Točka dodana!");
            setNewItem({ title: '', summary: '', legal: 0 });
            loadMeetings();
        } catch (err) {
            alert("Greška pri dodavanju točke: " + err.message);
        }
    };

    const canArchive = (meeting) => {
        if (!meeting.items || meeting.items.length === 0) return true;
        const legalItemsMissingConclusion = meeting.items.filter(
            it => it.legal === 1 && (!it.conclusion || it.conclusion.trim() === "")
        );
        return legalItemsMissingConclusion.length === 0;
    };

    const saveConclusion = async (mId, itemNumber, item) => {
        const key = `${mId}-${itemNumber}`;
        const text = (conclusions[key] !== undefined ? conclusions[key] : item.conclusion) || '';
        if (!text) {
            alert("Unesite zaključak!");
            return;
        }
        try {
            await meetingService.updateItemConclusion(mId, itemNumber, {
                conclusion: text
            });
            alert("Zaključak spremljen!");
            loadMeetings();
        } catch (err) { alert(err.message); }
    };

    if (loading) return <div className="page-container">Učitavanje...</div>;

    return (
        <div className="page-container">
            <h1 className="admin-title">Sastanci stanara</h1>

            {hasPrivileges && (
                <div className="admin-actions mb-20">
                    <button className="auth-button primary" onClick={() => window.location.href = '/sastanci/novi'}>
                        + KREIRAJ NOVI SASTANAK
                    </button>
                </div>
            )}

            <div className="meeting-list">
                {meetings.map(m => {
                    if (m.status === 'Archived') return null;
                    if (!hasPrivileges && m.status !== 'Public') return null;

                    if (userBuildingId) {
                        const meetingBuildingId = getMeetingBuildingId(m);
                        if (!meetingBuildingId || meetingBuildingId !== userBuildingId) return null;
                    }

                    const mId = m.meetingId;

                    return (
                        <div key={mId} className={`meeting-card status-${m.status?.toLowerCase()}`}>
                            <div className="meeting-header">
                                <h2>{m.title}</h2>
                                <span className="status-badge">{m.status}</span>
                            </div>

                            <p className="meeting-summary">{m.summary}</p>

                            <div className="meeting-info">
                                <span className="info-item">📅 {new Date(m.meetingStartTime).toLocaleString('hr-HR')}</span>
                                <span className="info-item">📍 {m.meetingLocation}</span>
                                {(m.status === 'Public' || m.status === 'Obavljen') && (
                                    <span className="info-item participant-count">
                                        Sudionika: <strong>{getParticipantsCount(m)}</strong>
                                    </span>
                                )}
                            </div>

                            {expandedId === mId && (
                                <div className="meeting-items-section">
                                    <h4>Točke dnevnog reda:</h4>

                                    {m.status === 'Pending' && hasPrivileges && (
                                        <div className="add-item-inline-box">
                                            <input type="text" placeholder="Naslov točke" value={newItem.title} onChange={e => setNewItem({ ...newItem, title: e.target.value })} />
                                            <input type="text" placeholder="Opis točke" value={newItem.summary} onChange={e => setNewItem({ ...newItem, summary: e.target.value })} />
                                            <label className="checkbox-label">
                                                <input type="checkbox" checked={newItem.legal === 1} onChange={e => setNewItem({ ...newItem, legal: e.target.checked ? 1 : 0 })} />Pravni učinak
                                            </label>
                                            <button className="auth-button small-btn primary" onClick={() => handleAddItem(mId)}>Dodaj</button>
                                        </div>
                                    )}

                                    <div className="items-group">
                                        {m.items?.map((item) => {
                                            const itemNum = item.itemNumber;
                                            return (
                                                <div key={itemNum} className="item-display-simple">
                                                    <strong>{itemNum}. {item.title} {item.legal === 1 && <span className="legal-mark">(pravni učinak)</span>}</strong>
                                                    <p className="item-description-text">{item.summary}</p>

                                                    {m.status === 'Obavljen' && hasPrivileges && item.legal === 1 ? (
                                                        <div className="conclusion-input-box">
                                                            <div className="vote-select-row">
                                                                <label> Upišite Ishod (Izglasan/Odbijen):
                                                                </label>
                                                            </div>
                                                            <textarea
                                                                placeholder="Izglasan/Odbijen."
                                                                defaultValue={item.conclusion}
                                                                onChange={(e) => setConclusions({ ...conclusions, [`${mId}-${itemNum}`]: e.target.value })}
                                                            />
                                                            <div className="vote-buttons">
                                                                <button className="auth-button small-btn success" onClick={() => saveConclusion(mId, itemNum, item)}>Spremi</button>
                                                            </div>
                                                        </div>
                                                    ) : m.status === 'Archived' && item.legal === 1 && item.conclusion ? (
                                                        <p className="conclusion-text">
                                                            <b>Zaključak:</b> {item.conclusion}
                                                        </p>
                                                    ) : null}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="meeting-footer">
                                <button className="auth-button outline small-btn" onClick={() => setExpandedId(expandedId === mId ? null : mId)}>
                                    {expandedId === mId ? 'Zatvori' : 'Detalji'}
                                </button>

                                {hasPrivileges && (
                                    <div className="admin-footer-btns">
                                        {m.status === 'Pending' && (
                                            <>
                                                <button
                                                    className="auth-button dark small-btn"
                                                    onClick={() => handlePublish(mId, m.items)}
                                                    disabled={isBusy(`publish-${mId}`)}
                                                >
                                                    {isBusy(`publish-${mId}`) ? 'Objavljujem...' : 'Objavi'}
                                                </button>
                                                <button className="auth-button danger small-btn" onClick={() => handleDelete(mId)}>
                                                    Obriši
                                                </button>
                                            </>
                                        )}

                                        {m.status === 'Public' && (
                                            <button className="auth-button dark small-btn" onClick={() => handleAction(meetingService.finish, mId, "Sastanak je obavljen!")}>
                                                Označi kao obavljen
                                            </button>
                                        )}

                                        {m.status === 'Obavljen' && (
                                            <button
                                                className="auth-button primary small-btn"
                                                title={!canArchive(m) ? "Morate popuniti zaključke za sve pravne točke!" : ""}
                                                onClick={() => handleAction(meetingService.archive, mId, "Sastanak arhiviran i mail poslan!", { busyKey: `archive-${mId}` })}
                                                disabled={!canArchive(m) || isBusy(`archive-${mId}`)}
                                            >
                                                {isBusy(`archive-${mId}`) ? 'Arhiviram...' : 'Arhiviraj'}
                                            </button>
                                        )}
                                    </div>
                                )}

                                {!hasPrivileges && m.status === 'Public' && (
                                    isUserAttending(m) ? (
                                        <span className="status-badge joined">✓ Prijavljeni</span>
                                    ) : (
                                        <button
                                            className="auth-button primary small-btn"
                                            disabled={joiningId === mId}
                                            onClick={() => handleAction(meetingService.confirmParticipation, mId, "Sudjelovanje uspješno potvrđeno!", { isParticipation: true })}
                                        >
                                            {joiningId === mId ? 'Prijava...' : '✅ Sudjelovat ću'}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}