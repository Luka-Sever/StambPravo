import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { meetingService } from '../services/meetingService';

export default function NoviSastanak() {
    const navigate = useNavigate();
    
    const [meeting, setMeeting] = useState({
        title: '',
        summary: '',
        meeting_location: '',
        meeting_start_time: '',
        status: 'Pending',
        items: []
    });

    const [newItem, setNewItem] = useState({ title: '', summary: '', legal: 0 });

    const handleAddItem = () => {
        if (!newItem.title || !newItem.summary) {
            alert("Točka mora imati naslov i opis!");
            return;
        }
        
        const updatedItems = [
            ...meeting.items, 
            { 
                ...newItem, 
                item_number: meeting.items.length + 1, 
                status: 'Pending' 
            }
        ];
        
        setMeeting({ ...meeting, items: updatedItems });
        setNewItem({ title: '', summary: '', legal: 0 });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await meetingService.create(meeting);
            alert("Sastanak uspješno kreiran!");
            navigate('/sastanci');
        } catch (err) {
            alert("Greška pri spremanju: " + err.message);
        }
    };

    return (
        <div className="page-container">
            <h1 className="admin-title">Novi Sastanak</h1>
            <form onSubmit={handleSubmit} className="auth-form wide-form">
                <div className="auth-field">
                    <label>NASLOV</label>
                    <input type="text" value={meeting.title} onChange={e => setMeeting({...meeting, title: e.target.value})} required />
                </div>
                <div className="auth-field">
                    <label>MJESTO</label>
                    <input type="text" value={meeting.meeting_location} onChange={e => setMeeting({...meeting, meeting_location: e.target.value})} required />
                </div>
                <div className="auth-field">
                    <label>VRIJEME</label>
                    <input type="datetime-local" value={meeting.meeting_start_time} onChange={e => setMeeting({...meeting, meeting_start_time: e.target.value})} required />
                </div>
                <div className="auth-field">
                    <label>OPIS</label>
                    <input type="text" value={meeting.summary} onChange={e => setMeeting({...meeting, summary: e.target.value})} required />
                </div>

                <div className="items-section">
                    <h3>Točke dnevnog reda</h3>
                    <div className="add-item-box">
                        <input type="text" placeholder="Naslov točke" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} />
                        <input type="text" placeholder="Opis točke" value={newItem.summary} onChange={e => setNewItem({...newItem, summary: e.target.value})} />
                        <button type="button" className="auth-button outline small-btn" onClick={handleAddItem}>Dodaj točku</button>
                    </div>
                    {meeting.items.map((it, idx) => (
                        <div key={idx} className="item-preview-card">
                            {it.item_number}. {it.title} {it.legal === 1 && <b>(Pravni)</b>}
                        </div>
                    ))}
                </div>
                <button type="submit" className="auth-button primary">SPREMI SASTANAK</button>
            </form>
        </div>
    );
}