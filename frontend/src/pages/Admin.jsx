import { useState } from 'react';
import { createUser } from '../services/adminService';

function AdminPage() {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState('CO_OWNER');
    const [message, setMessage] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();
        setMessage('');
        try {
            const newUser = { email, firstName, lastName, role };
            await createUser(newUser);
            setMessage(`Korisnik ${email} je uspješno kreiran!`);
            setEmail('');
            setFirstName('');
            setLastName('');
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
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="CO_OWNER">Suvlasnik</option>
                    <option value="REPRESENTATIVE">Predstavnik</option>
                    <option value="ADMIN">Admin</option>
                </select>
                <button type="submit">Kreiraj korisnika</button>
            </form>
            {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
        </div>
    );
}

export default AdminPage;