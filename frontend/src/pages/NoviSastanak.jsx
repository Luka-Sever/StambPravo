import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { meetingService } from '../services/meetingService';
import { useAuth } from '../context/AuthContext';

export default function NoviSastanak() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [meeting, setMeeting] = useState({
        meetingEndTime: '',
        meetingStartTime: '',
        meetingLocation: '',
        summary: '',
        title: '',
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

        if (!meeting.title || !meeting.meetingLocation || !meeting.meetingStartTime || !meeting.summary) {
            alert("Sva polja moraju biti popunjena!");
            return;
        }

        if (meeting.items.length === 0) {
            alert("Sastanak mora imati barem jednu točku dnevnog reda prije objave!");
            return;
        }

        try {
            const start = new Date(meeting.meetingStartTime);
            const end = new Date(start);
            end.setHours(start.getHours() + 1);

            const finalData = {
                ...meeting,
                building_id: user?.buildingId || 1,
                meetingStartTime: start.toISOString(),
                meetingEndTime: end.toISOString()
            };

            await meetingService.create(finalData);
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
                    <input type="text" value={meeting.meetingLocation} onChange={e => setMeeting({...meeting, meetingLocation: e.target.value})} required />
                </div>
                <div className="auth-field">
                    <label>VRIJEME</label>
                    <input type="datetime-local" value={meeting.meetingStartTime} onChange={e => setMeeting({...meeting, meetingStartTime: e.target.value})} required />
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
                        <label className="checkbox-label">
                            <input type="checkbox" checked={newItem.legal === 1} onChange={e => setNewItem({...newItem, legal: e.target.checked ? 1 : 0})}/>Pravni učinak
                        </label>
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