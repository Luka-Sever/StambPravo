import { useState } from 'react';
import { createUser } from '../services/adminService';
import '../App.css';

function AdminPage() {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('CO_OWNER');
    const [message, setMessage] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();
        setMessage('');

        if (password.length < 8) {
            setMessage('Lozinka mora imati najmanje 8 znakova');
            return;
        }

        if (password !== confirmPassword) {
            setMessage('Lozinke se ne podudaraju');
            return;
        }

        try {
            const newUser = { email, firstName, lastName, password, role};
            await createUser(newUser);
            setMessage(`Korisnik ${email} je uspješno kreiran!`);
            setEmail('');
            setFirstName('');
            setLastName('');
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error('Greška pri kreiranju korisnika:', error);
            setMessage(`Dogodila se greška: ${error.message}`);
        }
    }

    return (
        <div className="auth-container">
            <h2 className="admin-title">Kreiraj korisnika</h2>
            
            <div className="auth-card">
                
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="auth-field">
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Email" 
                            required 
                        />
                    </div>
                    
                    <div className="auth-field">
                        <input 
                            type="text" 
                            value={firstName} 
                            onChange={(e) => setFirstName(e.target.value)} 
                            placeholder="Ime" 
                            required 
                        />
                    </div>

                    <div className="auth-field">
                        <input 
                            type="text" 
                            value={lastName} 
                            onChange={(e) => setLastName(e.target.value)} 
                            placeholder="Prezime" 
                            required 
                        />
                    </div>

                    <div className="auth-field">
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Lozinka" 
                            required 
                        />
                    </div>

                    <div className="auth-field">
                        <input 
                            type="password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            placeholder="Potvrdi lozinku" 
                            required 
                        />
                    </div>

                    <div className="auth-field">
                        <label className="label-text">Uloga:</label>
                        <select 
                            className="role-select"
                            value={role} 
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="CO_OWNER">Suvlasnik</option>
                            <option value="REP">Predstavnik</option>
                            <option value="ADMIN">Administrator</option>
                        </select>
                    </div>

                    <button type="submit" className="auth-button dark">
                        KREIRAJ KORISNIKA
                    </button>
                </form>

                {message && <p className="status-message">{message}</p>}
            </div>
        </div>
    );
}

export default AdminPage;