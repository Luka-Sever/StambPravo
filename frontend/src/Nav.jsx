import { NavLink } from 'react-router-dom';

export default function Nav() {
    return (
        <nav>
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : undefined)}>
                Naslovnica
            </NavLink>
            <NavLink to="/arhiva" className={({ isActive }) => (isActive ? 'active' : undefined)}>
                Arhiva
            </NavLink>
            <NavLink to="/diskusija" className={({ isActive }) => (isActive ? 'active' : undefined)}>
                Diskusije
            </NavLink>
            <NavLink to="/sastanci" className={({ isActive }) => (isActive ? 'active' : undefined)}>
                Sastanci
            </NavLink>
        </nav>
    );
}