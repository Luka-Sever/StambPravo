import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { meetingService } from '../services/meetingService';

export default function Sastanci() {
    const { user } = useAuth();
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);

    const canCreate = user?.role === 'ADMIN' || user?.role === 'REP';
    const isRepresentative = user?.role === 'REP';

    useEffect(() => {
        loadMeetings();
    }, []);

    const loadMeetings = async () => {
        try {
            const data = await meetingService.getAll();
            setMeetings(data);
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

    if (loading) return <div className="page-container">Učitavanje...</div>;

    return (
        <div className="page-container">
            <h1 className="admin-title">Sastanci stanara</h1>

            {canCreate && (
                <div className="admin-actions mb-20">
                    <button 
                        className="auth-button primary" 
                        onClick={() => window.location.href='/sastanci/novi'}
                    >
                        + KREIRAJ NOVI SASTANAK
                    </button>
                </div>
            )}

            <div className="meeting-list">
                {meetings.length === 0 ? (
                    <p>Trenutno nema dostupnih sastanaka</p>
                ) : (
                    meetings.map(m => (
                        <div key={m.id} className={`meeting-card status-${m.status?.toLowerCase() || 'pending'}`}>
                            <div className="meeting-header">
                                <h3>{m.title || "naslov"}</h3>
                                <span className="status-badge">{m.status}</span>
                            </div>
                            
                            <p className="meeting-summary">{m.summary || "opis sastanka"}</p>
                            
                            <div className="meeting-info">
                                <span className="info-item">
                                    📅 {m.meetingStartTime ? new Date(m.meetingStartTime).toLocaleString('hr-HR') : "Invalid Date"}
                                </span>
                                <span className="info-item">📍 {m.meetingLocation || "lokacija"}</span>
                            </div>

                            <div className="meeting-footer">
                                <button className="auth-button outline small-btn">
                                    Detalji
                                </button>
                                
                                {isRepresentative && m.status === 'PLANIRAN' && (
                                    <button 
                                        className="auth-button dark small-btn"
                                        onClick={() => handleAction(meetingService.publish, m.id, "Sastanak objavljen!")}
                                    >
                                        Objavi
                                    </button>
                                )}

                                {m.status === 'OBJAVLJEN' && (
                                    <div className="participation-area">
                                        <button 
                                            className="auth-button primary small-btn"
                                            onClick={() => handleAction(meetingService.confirmParticipation, m.id, "Sudjelovanje potvrđeno!")}
                                        >
                                            Sudjelovat ću
                                        </button>
                                        <span className="count-label">Prijavljeno: {m.participationCount || 0}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}