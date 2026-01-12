import { useState, useEffect } from 'react';
import { get } from '../services/httpClient';

export default function Obavijesti() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        get('/api/news')
            .then(data => {
                setNews(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Greška pri dohvaćanju obavijesti:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="page-container">Učitavanje...</div>;

    return (
        <div className="page-container">
            <h1 className="admin-title">Obavijesti</h1>
            
            <div className="news-list">
                {news.length === 0 ? (
                    <p className="empty-message">Trenutno nema novih obavijesti u bazi.</p>
                ) : (
                    news.map(item => (
                        <div key={item.id} className={item.important ? "news-item important" : "news-item"}>
                            <div className="news-header">
                                <h3 className="news-title">{item.title}</h3>
                                <span className="news-date">
                                    {new Date(item.date).toLocaleDateString('hr-HR')}
                                </span>
                            </div>
                            <p className="news-content">{item.content}</p>
                            {item.important && <span className="important-badge">VAŽNO</span>}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}