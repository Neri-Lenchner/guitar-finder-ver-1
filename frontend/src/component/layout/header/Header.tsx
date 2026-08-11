import { JSX } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../../services/auth.service';
import './Header.css';

function Header(): JSX.Element {
    const navigate = useNavigate();
    const user = authService.getLoggedInUser();

    function handleLogout(): void {
        authService.logout();
        navigate('/home');
    }

    return (
        <nav className="header">
            <Link to="/home" className="header-logo">GuitarFinder</Link>
            <div className="header-links">
                <Link to="/home">Home</Link>
                {user && <Link to="/chatbot">GuitarBot</Link>}
                {user ? (
                    <>
                        <span className="header-username">Hey, {user.firstName}</span>
                        <button onClick={handleLogout} className="header-logout-btn">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Header;
