import { JSX } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../../services/auth.service';
import { appConfig } from '../../../utils/app-config';
import defaultAvatar from '../../../assets/default-avatar.png';
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
                        <Link to="/edit-profile" className="header-avatar-link">
                            <img
                                src={user.profileImage ? `${appConfig.apiAddress}/uploads/${user.profileImage}` : defaultAvatar}
                                alt={user.firstName}
                                className="header-avatar"
                            />
                            <span className="header-username">Hey, {user.firstName}</span>
                        </Link>
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
