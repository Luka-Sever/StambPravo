
import { useNavigate } from 'react-router-dom';

export default function NotLoggedIn({ notLoggedIn }) {
    const navigate = useNavigate()
    if (notLoggedIn) {
        return (
            <div id="notLoggedIn">
                <p>Niste prijavljeni! Prijavite se za pristup aplikaciji.</p>
                <button onClick={() => navigate('/login')}>Prijavi se</button>
            </div>
        );
    }
    return null;
}