import { JSX, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../../services/auth.service';
import { appConfig } from '../../../utils/app-config';
import defaultAvatar from '../../../assets/default-avatar.png';
import './Header.css';

function Header(): JSX.Element {
    const navigate = useNavigate();
    const user = authService.getLoggedInUser();
    const [query, setQuery] = useState('');

    function handleLogout(): void {
        authService.logout();
        navigate('/home');
    }

    function handleSearch(): void {
        if (!query.trim()) return;
        navigate(`/guitars?search=${encodeURIComponent(query.trim())}`);
        setQuery('');
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
        if (e.key === 'Enter') handleSearch();
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
            {user && (
                <div className="header-search">
                    <input
                        type="text"
                        className="header-search-input"
                        placeholder="Search brand or model..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button className="header-search-btn" onClick={handleSearch}>Search</button>
                </div>
            )}
            <div className="header-links">
                <Link to="/home">Home</Link>
                {user && <Link to="/guitars">Guitars</Link>}
                {user && <Link to="/search">Find Stores</Link>}
                {user && <Link to="/chatbot">GuitarBot</Link>}
                {user && <Link to="/watchlist">My Guitars</Link>}
                {user ? (
                    <button onClick={handleLogout} className="header-logout-btn">Logout</button>
                ) : (
                    <Link to="/login" className="header-login-btn">Login</Link>
                )}
            </div>
        </nav>
    );
}

export default Header;
