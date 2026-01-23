import { useEffect, useState} from 'react';
import '../App.css';
import { createUser } from '../services/adminService';
import { addRepToBuilding, createBuilding, getAllBuildings } from '../services/buildingService';

function AdminPage() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [buildingId, setBuildingId] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('');
    const [message, setMessage] = useState('');
    const [buildings, setBuildings] = useState([]);


    // Nova stanja za zgradu
    const [address, setAddress] = useState('');
    const [cityId, setCityId] = useState('');
    const [buildingMessage, setBuildingMessage] = useState('');
    // Nova stanja za dodavanje predstavnika
    const [repEmail, setRepEmail] = useState('');
    const [buildingIdForRep, setBuildingIdForRep] = useState('');
    const [repMessage, setRepMessage] = useState('');


    useEffect(() => {
        fetchBuildings();
    }, []);

    async function fetchBuildings() {
        try {
            const data = await getAllBuildings();
            setBuildings(data);
        } catch (error) {
            console.error('Error fetching buildings:', error);
        }
    }

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

            const bId = buildingId === '' ? null : Number(buildingId);
            const newUser = { email, username, firstName, lastName, buildingId: bId, password, role: role};

            await createUser(newUser);
            setMessage(`Korisnik ${username} je uspješno kreiran!`);
            setEmail('');
            setUsername('');
            setFirstName('');
            setLastName('');
            setBuildingId('')
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error('Greška pri kreiranju korisnika:', error);
            setMessage(`Dogodila se greška: ${error.message}`);
        }
    }

    // Dodavanje nove zgrade
    async function handleCreateBuilding(e) {
        e.preventDefault();
        setBuildingMessage('');
        if (!address || !cityId) {
            setBuildingMessage('Adresa i grad su obavezni');
            return;
        }
        try {
            const newBuilding = { address, cityId, repEmail }
            await createBuilding(newBuilding);
            setBuildingMessage('Zgrada uspješno kreirana!');
            setAddress('');
            setCityId('');
            setRepEmail('');
            fetchBuildings();

        } catch (err) {
            setBuildingMessage(err.message || 'Greška pri kreiranju zgrade');
        }
    }

    // Dodavanje predstavnika zgradi
    async function handleAddRep(e) {
        e.preventDefault();
        setRepMessage('');
        if (!buildingIdForRep || !repEmail) {
            setRepMessage('ID zgrade i email predstavnika su obavezni');
            return;
        }
        try {
            await addRepToBuilding({ buildingId: Number(buildingIdForRep), repEmail });
            setRepMessage('Predstavnik uspješno dodan zgradi!');
            setBuildingIdForRep('');
            setRepEmail('');
        } catch (err) {
            setRepMessage(err.message || 'Greška pri dodavanju predstavnika');
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
                        <label className="label-text">Zgrada:</label>
                        <select 
                            className="role-select"
                            value={buildingId} 
                            onChange={(e) => setBuildingId(e.target.value)}
                        >
                            <option value="">Odaberite zgradu</option>
                            {buildings.map(building => (
                                <option key={building.buildingId} value={building.buildingId}>
                                    {building.address} - {building.cityId}
                                </option>
                            ))}
                        </select>
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

            <h2 className="admin-title">Kreiraj zgradu</h2>
            <div className="auth-card">
                <form onSubmit={handleCreateBuilding} className="auth-form">
                    <div className="auth-field">
                        <input
                            type="text"
                            value={address} onChange={e => setAddress(e.target.value)}
                            placeholder="Adresa"
                            required
                        />
                    </div>
                    <div className="auth-field">
                        <input
                            type="number"
                            step="any"
                            value={cityId} onChange={e => setCityId(e.target.value)}
                            placeholder="Poštanski broj"
                            required
                        />
                    </div>

                    <button type="submit" className="auth-button dark">KREIRAJ ZGRADU</button>
                    {buildingMessage && <p className="status-message">{buildingMessage}</p>}
                </form>
            </div>

            <h2 className="admin-title">Dodaj predstavnika zgradi</h2>
            <div className="auth-card">
                <form onSubmit={handleAddRep} className="auth-form">
                    <div className="auth-field">
                        <label className="label-text">Zgrada:</label>
                        <select
                            className="role-select"
                            value={buildingIdForRep}
                            onChange={e => setBuildingIdForRep(e.target.value)}
                            required
                        >
                            <option value="">Odaberite zgradu</option>
                            {buildings.map(building => (
                                <option key={building.buildingId} value={building.buildingId}>
                                    {building.address} - {building.cityId}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="auth-field">
                        <input type="email" value={repEmail} onChange={e => setRepEmail(e.target.value)} placeholder="Email predstavnika" required />
                    </div>
                    <button type="submit" className="auth-button dark">DODAJ PREDSTAVNIKA</button>
                    {repMessage && <p className="status-message">{repMessage}</p>}
                </form>
            </div>
        </div>
    );
}

export default AdminPage;