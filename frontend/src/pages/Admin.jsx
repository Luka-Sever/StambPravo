import { useState } from 'react';
import '../App.css';
import { createUser } from '../services/adminService';

function AdminPage() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('');
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

        if (!username.match(/^[a-zA-Z0-9_-]+$/) || username.length < 5) {
            setMessage("Korisnicko ime ne smije sadrzavati simbole i mora imati barem 5 znakova");
            return;
        }

        if (!(firstName.match(/^[a-zA-Z]+$/) && lastName.match(/^[a-zA-Z]+$/))) {
            setMessage("Ime i prezime ne smiju sadrzavati brojeve ili simbole");
            return;
        }

        try {
            const newUser = { email, username, firstName, lastName, password, role};
            await createUser(newUser);
            setMessage(`Korisnik ${username} je uspješno kreiran!`);
            setEmail('');
            setUsername('');
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
                            type="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
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
                            <option value="" disabled hidden>Odaberite ulogu</option>
                            <option value="CO_OWNER">Suvlasnik</option>
                            <option value="REP">Predstavnik</option>
                        </select>
                    </div>

                    <button type="submit" className="auth-button dark">
                        KREIRAJ KORISNIKA
                    </button>

                    {message && (
                        <p className="status-message" aria-live="polite">
                            {message}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}

export default AdminPage;