import { JSX, useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { authService } from '../../../services/auth.service';
import headerLogo from '../../../assets/guitar-finder-logo-1-Photoroom.png';
import './Header.css';

function Header(): JSX.Element {
    const navigate = useNavigate();
    const user = authService.getLoggedInUser();
    const [query, setQuery] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const navRef = useRef<HTMLElement>(null);

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
        if (e.key === 'Enter') { handleSearch(); close(); }
    }

    useEffect(() => {
        document.body.classList.toggle('menu-open', menuOpen);
        return () => document.body.classList.remove('menu-open');
    }, [menuOpen]);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuOpen && navRef.current && !navRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuOpen]);

    function close() { setMenuOpen(false); }

    return (
        <nav className="header" ref={navRef}>
            <div className="header-left">
                <NavLink to="/home" className="header-logo" onClick={close}>
                    <img src={headerLogo} alt="GuitarFinder" className="header-logo-img" />
                </NavLink>
                {user && (
                    <NavLink to="/edit-profile" className="header-avatar-link" onClick={close}>
                        <span className="header-greeting">Hello and Welcome </span>
                        <span className="header-username">{user.firstName}</span>
                    </NavLink>
                )}
            </div>
            {user && (
                <div className="header-search">
                    <div className="header-search-input-wrapper">
                        <input
                            type="text"
                            className="header-search-input"
                            placeholder="Search brand or model..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <svg className="header-search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </div>
                    <button className="header-search-btn" onClick={handleSearch}>Search</button>
                    <NavLink to="/chatbot" className="header-chatbot-link" onClick={close}>GuitarGod</NavLink>
                </div>
            )}
            <button className="header-hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <div className={`header-links${menuOpen ? ' header-links--open' : ''}`}>
                {user && (
                    <div className="header-search-mobile">
                        <div className="header-search-input-wrapper">
                            <input
                                type="text"
                                className="header-search-input"
                                placeholder="Search brand or model..."
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <svg className="header-search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </div>
                        <button className="header-search-btn" onClick={() => { handleSearch(); close(); }}>Search</button>
                    </div>
                )}
                {user && <NavLink to="/chatbot" className="header-chatbot-link" onClick={close}>GuitarGod</NavLink>}
                <NavLink to="/home" onClick={close}>Home</NavLink>
                {user && <NavLink to="/guitars" onClick={close}>Guitars</NavLink>}
                {user && <NavLink to="/search" onClick={close}>Find Stores</NavLink>}
                {user && <NavLink to="/watchlist" onClick={close}>My Guitars</NavLink>}
                {user && <NavLink to="/stats" onClick={close}>Statistics</NavLink>}
                {user ? (
                    <button onClick={() => { handleLogout(); close(); }} className="header-logout-btn">Logout</button>
                ) : (
                    <NavLink to="/login" className="header-login-btn" onClick={close}>Login</NavLink>
                )}
            </div>
        </nav>
    );
}

export default Header;
