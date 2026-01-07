import { useState } from 'react';
import { createUser } from '../services/adminService';

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
        <div style={{ padding: '2rem' }}>
            <h2>Dodaj novog korisnika</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Ime" required />
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Prezime" required />
                <input type="password" value={password} onChange={(e) => set(e.target.value)} placeholder="Password" required />
                <input type="Confirm Password" value={confirmPassword} onChange={(e) => set(e.target.value)} placeholder="Confirm Password" required />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="CO_OWNER">Suvlasnik</option>
                    <option value="REP">Predstavnik</option>
                </select>
                <button type="submit">Kreiraj korisnika</button>
            </form>
            {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
        </div>
    );
}

export default AdminPage;
