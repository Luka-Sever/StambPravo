import { useLocation, useNavigate } from 'react-router-dom';
import logo from './assets/logo.png';
import { useAuth } from './context/AuthContext.jsx';

export default function Head() {
    const navigate = useNavigate()
    const location = useLocation()
    const { isAuthenticated, user, logout } = useAuth()
    
    const displayName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : null
    const isAdmin = user?.role === 'ADMIN'
    const isAuthRoute = location.pathname === '/login'

    return (
        <div id="head">
            <img src={logo} className='logo' alt="logo" onClick={() => navigate('/')} style={{cursor: 'pointer'}} />
            <div>
                {isAuthenticated ? (
                    <>
                        {isAdmin && (
                            <button onClick={() => navigate('/admin')} style={{ marginRight: '10px' }}>
                                Admin
                            </button>
                        )}
                        <span className="user-label">{displayName || 'Korisnik'}</span>
                        <button onClick={logout} style={{ marginLeft: 10 }}>Odjavi se</button>
                    </>
                ) : !isAuthRoute ? (
                    <button onClick={() => navigate('/login')}>Prijavi se</button>
                ) : null}
            </div>
        </div>
    );
}