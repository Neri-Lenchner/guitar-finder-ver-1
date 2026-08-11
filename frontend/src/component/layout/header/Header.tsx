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
            <div className="header-left">
                <Link to="/home" className="header-logo">GuitarFinder</Link>
                {user && (
                    <Link to="/edit-profile" className="header-avatar-link">
                        <img
                            src={user.profileImage ? `${appConfig.apiAddress}/uploads/${user.profileImage}` : defaultAvatar}
                            alt={user.firstName}
                            className="header-avatar"
                        />
                        <span className="header-greeting">Hello and Welcome </span>
                        <span className="header-username">{user.firstName}</span>
                    </Link>
                )}
            </div>
            <div className="header-links">
                <Link to="/home">Home</Link>
                <Link to="/guitars">Guitars</Link>
                <Link to="/search">Find Stores</Link>
                {user && <Link to="/chatbot">GuitarBot</Link>}
                {user && <Link to="/watchlist">My Guitars</Link>}
                {user ? (
                    <button onClick={handleLogout} className="header-logout-btn">Logout</button>
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
