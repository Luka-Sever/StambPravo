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

    const handleSubmit = async (e) => {
        e.preventDefault();        

        if (!meeting.title || !meeting.meetingLocation || !meeting.meetingStartTime || !meeting.summary) {
            alert("Sva polja moraju biti popunjena!");
            return;
        }

        try {
            const start = new Date(meeting.meetingStartTime);
            const end = new Date(start);
            start.setHours(start.getHours() + 1);
            end.setHours(start.getHours() + 1);

            const finalData = {
                ...meeting,
                building_id: user?.buildingId || 1,
                meetingStartTime: start.toISOString(),
                meetingEndTime: end.toISOString()
            };

            await meetingService.create(finalData);
            alert("Sastanak uspješno planiran! Sada mu možete dodati točke dnevnog reda.");
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
                
                <button type="submit" className="auth-button primary">KREIRAJ SASTANAK</button>
            </form>
        </div>
    );
}