import { useEffect, useState } from 'react';

export default function Diskusija() {
    const [discussions, setDiscussions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const apiKey = import.meta.env.VITE_STANBLOG_API_KEY;

        (async () => {
            try {
                setLoading(true);
                setError(null);

                // relative path to the backend endpoint
                const res = await fetch(apiKey + '/diskusije', {
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

    if (loading) return <div className="page-container">Učitavanje diskusija...</div>;

    const formatDate = (iso) => {
        if (!iso) return '';
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return iso;
        return d.toLocaleString('hr-HR');
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
                                <a className="auth-link" href={d.link} target="_blank" rel="noreferrer">
                                    Otvori diskusiju
                                </a>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
