import { NavLink } from 'react-router-dom';

export default function Nav() {
    return (
        <nav>
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : undefined)}>
                Naslovnica
            </NavLink>
            <NavLink to="/obavijesti" className={({ isActive }) => (isActive ? 'active' : undefined)}>
                Obavijesti
            </NavLink>
            <NavLink to="/diskusije" className={({ isActive }) => (isActive ? 'active' : undefined)}>
                Diskusije
            </NavLink>
            <NavLink to="/sastanci" className={({ isActive }) => (isActive ? 'active' : undefined)}>
                Sastanci
            </NavLink>
        </nav>
    );
}