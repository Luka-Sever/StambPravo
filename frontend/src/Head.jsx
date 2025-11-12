import { useLocation, useNavigate } from 'react-router-dom';
import logo from './assets/logo.png';
import { useAuth } from './context/AuthContext.jsx';

export default function Head() {
    const navigate = useNavigate()
    const location = useLocation()
    const { isAuthenticated, user, logout } = useAuth()
    const displayName = user
        ? `${[user.firstName, user.lastName].filter(Boolean).join(' ')}`.trim()
        : null
    const displayRole = user?.role ? ` (${user.role})` : ''
    const isAuthRoute = location.pathname === '/login'
    return (
        <div id="head">
            <img src={logo} className='logo'></img>
            <div>
                {isAuthenticated ? (
                    <>
                        <span className="user-label">{`${displayName || 'Korisnik'}${displayRole}`}</span>
                        <button id="login" onClick={logout} style={{ marginLeft: 10 }}>Odjavi se</button>
                    </>
                ) : !isAuthRoute ? (
                    <>
                        <button id="login" onClick={() => navigate('/login')}>Prijavi se</button>
                    </>
                ) : null}
            </div>
        </div>
    );

} 