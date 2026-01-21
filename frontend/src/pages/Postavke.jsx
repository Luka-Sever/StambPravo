import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext.jsx';
import { changePassword } from '../services/authService.js';
import { addRepToBuilding } from '../services/buildingService'; 

export default function Postavke() {
    const navigate = useNavigate(); 
    const { user } = useAuth(); 
    
    const [data, setData] = useState({ current: '', new: '', confirm: '' });
    const [message, setMessage] = useState('');

    const [tenantEmail, setTenantEmail] = useState('');
    const [tenantMessage, setTenantMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (data.new.length < 8) {
            setMessage('Nova lozinka mora imati barem 8 znakova'); 
            return;
        }

        if (data.new !== data.confirm) {
            setMessage('Nove lozinke se ne podudaraju');
            return;
        }

        try {
            const changePasswordData = {
                username: user.username,
                oldPassword: data.current,
                newPassword: data.new
            }
            await changePassword(changePasswordData);
            alert("Lozinka uspješno promijenjena!");
            navigate('/');
        } catch (err) {
            setMessage(err.message || "Greška: Stara lozinka nije ispravna.");
        }
    };

    const handleAddTenant = async (e) => {
        e.preventDefault();
        setTenantMessage('');
        try {
            await addRepToBuilding({ buildingId: user.buildingId, repEmail: tenantEmail });
            setTenantMessage('Stanar uspješno dodan u zgradu!');
            setTenantEmail('');
        } catch (err) {
            setTenantMessage(err.message || 'Greška pri dodavanju stanara');
        }
    };

    return (
        <div className="auth-wrapper">
            <h1 className="page-title">POSTAVKE</h1>

            <div className="user-profile-header">
                <p>Prijavljeni ste kao: <strong>{user?.firstName} {user?.lastName}</strong></p>
                <p>Korisničko ime: <strong>{user?.username}</strong></p>
                <p>Uloga: <strong>{user?.role === 'REP' ? 'Predstavnik' : user?.role === 'ADMIN' ? 'Administrator' : 'Suvlasnik'}</strong></p>
                <p>ID zgrade: <strong>{user?.buildingId}</strong></p>
            </div>

            <div className="auth-container settings-stack">
                <h2 className="admin-title">PROMIJENI LOZINKU</h2>
                <div className="auth-card">  
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="auth-field">
                            <label>TRENUTNA LOZINKA</label>
                            <input type="password" value={data.current} onChange={e => setData({...data, current: e.target.value})} required />
                        </div>
                        
                        <div className="auth-field">
                            <label>NOVA LOZINKA</label>
                            <input type="password" value={data.new} onChange={e => setData({...data, new: e.target.value})} required />
                        </div>
                        
                        <div className="auth-field">
                            <label>POTVRDI NOVU LOZINKU</label>
                            <input type="password" value={data.confirm} onChange={e => setData({...data, confirm: e.target.value})} required />
                        </div>
                        
                        <div className="settings-logout-group">
                            <button className="auth-button primary small-btn" type="submit">SPREMI</button>
                            <button className="auth-button outline small-btn" type="button" onClick={() => navigate(-1)}>ODUSTANI</button>
                        </div>
                        
                        {message && <p className="status-message">{message}</p>}
                    </form>
                </div>

                {user?.role === 'REP' || user?.role === 'ADMIN' && (
                    <>
                        <h2 className="admin-title" style={{ marginTop: '40px' }}>DODAJ STANARA U ZGRADU</h2>
                        <div className="auth-card">
                            <form onSubmit={handleAddTenant} className="auth-form">
                                <div className="auth-field">
                                    <label>EMAIL STANARA</label>
                                    <input 
                                        type="email" 
                                        value={tenantEmail} 
                                        onChange={(e) => setTenantEmail(e.target.value)} 
                                        placeholder="Email stanara" 
                                        required 
                                    />
                                </div>
                                <button type="submit" className="auth-button primary small-btn">DODAJ STANARA</button>
                                {tenantMessage && <p className="status-message">{tenantMessage}</p>}
                            </form>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}