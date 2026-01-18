import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { meetingService } from '../services/meetingService';

export default function Sastanci() {
    const { user } = useAuth();
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);

    const hasPrivileges = user?.role === 'ADMIN' || user?.role === 'REP';

    useEffect(() => {
        loadMeetings();
    }, []);

    const loadMeetings = async () => {
        try {
            const data = await meetingService.getAll();
            setMeetings(data || []);
        } catch (err) {
            console.error("Greška pri dohvaćanju:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (actionFn, id, successMsg) => {
        try {
            await actionFn(id); 
            alert(successMsg);
            loadMeetings(); 
        } catch (err) {
            alert(err.message);
        }
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

    if (loading) return <div className="page-container">Učitavanje...</div>;

    return (
        <div className="page-container">
            <h1 className="admin-title">Sastanci stanara</h1>

            {hasPrivileges && (
                <div className="admin-actions mb-20">
                    <button className="auth-button primary" onClick={() => window.location.href='/sastanci/novi'}>
                        + KREIRAJ NOVI SASTANAK
                    </button>
                </div>
            )}

            <div className="meeting-list">
                {meetings.map(m => {
                    if (!hasPrivileges && m.status !== 'OBJAVLJEN' && m.status !== 'ARHIVIRAN') return null;
                    const mId = m.meetingId || m.id;

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
                            </div>

                            {expandedId === mId && (
                                <div className="meeting-items-section">
                                    <h4>Točke dnevnog reda:</h4>
                                    <div className="items-group">
                                        {m.items?.map((item) => (
                                            <div key={item.itemNumber || item.id?.itemNumber} className="item-display-simple">
                                                <strong>{item.itemNumber || item.id?.itemNumber}. {item.title} {item.legal === 1 && <span>(Glasanje)</span>}</strong>
                                                <p className="item-description-text">{item.summary}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="meeting-footer">
                                <button className="auth-button outline small-btn" onClick={() => setExpandedId(expandedId === mId ? null : mId)}>
                                    {expandedId === mId ? 'Zatvori' : 'Detalji'}
                                </button>

                                {hasPrivileges && (
                                    <div className="admin-footer-btns">
                                        {(m.status === 'PLANIRAN' || m.status === 'Pending') && (
                                            <>
                                                <button className="auth-button dark small-btn" onClick={() => handleAction(meetingService.publish, mId, "Sastanak objavljen!")}>
                                                    Objavi
                                                </button>
                                                <button className="auth-button danger small-btn" onClick={() => handleDelete(mId)}>
                                                    Obriši
                                                </button>
                                            </>
                                        )}

                                        {m.status === 'OBJAVLJEN' && (
                                            <button className="auth-button primary small-btn" onClick={() => handleAction(meetingService.archive, mId, "Sastanak arhiviran!")}>
                                                Arhiviraj
                                            </button>
                                        )}
                                    </div>
                                )}

                                {!hasPrivileges && m.status === 'OBJAVLJEN' && (
                                    <button className="auth-button primary small-btn" onClick={() => handleAction(meetingService.confirmParticipation, mId, "Sudjelovanje potvrđeno!")}>
                                        Sudjelovat ću
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}