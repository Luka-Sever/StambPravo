import { useState, useEffect } from 'react';
import { get } from '../services/httpClient';

export default function Diskusije() {
    const [discussions, setDiscussions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Dohvaćamo diskusije iz baze podataka
        get('/api/discussions')
            .then(data => {
                setDiscussions(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Greška:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="page-container">Učitavanje diskusija...</div>;

    return (
        <div className="page-container">
            <h1 className="admin-title">StanBlog - Diskusije</h1>
            <div className="discussion-grid">
                {discussions.length === 0 ? (
                    <p>Trenutno nema otvorenih diskusija.</p>
                ) : (
                    discussions.map(d => (
                        <div key={d.id} className="discussion-card">
                            <h3>{d.title}</h3>
                            <p>{d.summary}</p>
                            <span className="status-badge">{d.status}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}