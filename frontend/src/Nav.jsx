import { Link } from 'react-router-dom';

export default function Nav() {
    return (
        <nav>
            <Link to="/">Naslovnica</Link>
            <Link to="/obavijesti">Obavijesti</Link>
            <Link to="/diskusije">Diskusije</Link>
            <Link to="/sastanci">Sastanci</Link>
        </nav>
    );
}