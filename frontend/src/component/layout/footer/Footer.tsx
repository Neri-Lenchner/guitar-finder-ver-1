import { JSX } from 'react';
import { Link } from 'react-router-dom';
import { footerColumns } from '../../../utils/footer-links';
import './Footer.css';

function Footer(): JSX.Element {
    return (
        <footer className="site-footer">
            <div className="footer-top">
                <div className="footer-brand">
                    <span className="footer-logo">GuitarFinder</span>
                    <p className="footer-tagline">Your AI-powered guitar discovery platform.</p>
                </div>

                {footerColumns.map(col => (
                    <div key={col.heading} className="footer-col">
                        <h4 className="footer-col-heading">{col.heading}</h4>
                        <ul className="footer-col-list">
                            {col.items.map(item => (
                                <li key={item.label}>
                                    <Link to={item.path} className="footer-link">{item.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="footer-divider" />

            <div className="footer-bottom">
                <div className="footer-payments">
                    {/* Fender */}
                    <svg className="payment-logo" viewBox="0 0 80 38" aria-label="Fender">
                        <rect width="80" height="38" rx="5" fill="#111111"/>
                        <text x="40" y="25" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="Arial, sans-serif" letterSpacing="2">FENDER</text>
                    </svg>

                    {/* Gibson */}
                    <svg className="payment-logo" viewBox="0 0 80 38" aria-label="Gibson">
                        <rect width="80" height="38" rx="5" fill="#1a1a1a"/>
                        <text x="40" y="26" textAnchor="middle" fill="#c9a84c" fontSize="15" fontWeight="bold" fontFamily="Georgia, serif" letterSpacing="1">Gibson</text>
                    </svg>

                    {/* Taylor */}
                    <svg className="payment-logo" viewBox="0 0 80 38" aria-label="Taylor Guitars">
                        <rect width="80" height="38" rx="5" fill="#2c3e50"/>
                        <text x="40" y="25" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="Georgia, serif" letterSpacing="2">TAYLOR</text>
                    </svg>

                    {/* Martin */}
                    <svg className="payment-logo" viewBox="0 0 80 38" aria-label="Martin Guitars">
                        <rect width="80" height="38" rx="5" fill="#8B0000"/>
                        <text x="40" y="25" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="Arial, sans-serif" letterSpacing="2">MARTIN</text>
                    </svg>

                    {/* Ibanez */}
                    <svg className="payment-logo" viewBox="0 0 80 38" aria-label="Ibanez">
                        <rect width="80" height="38" rx="5" fill="#000000"/>
                        <text x="40" y="25" textAnchor="middle" fill="#e63946" fontSize="13" fontWeight="bold" fontFamily="Arial, sans-serif" letterSpacing="1.5">IBANEZ</text>
                    </svg>

                    {/* Yamaha */}
                    <svg className="payment-logo" viewBox="0 0 80 38" aria-label="Yamaha">
                        <rect width="80" height="38" rx="5" fill="#FFFFFF" stroke="#e0e0e0"/>
                        <text x="40" y="25" textAnchor="middle" fill="#4a0080" fontSize="11" fontWeight="bold" fontFamily="Arial, sans-serif" letterSpacing="1.5">YAMAHA</text>
                    </svg>
                </div>
                <span className="footer-copy">© {new Date().getFullYear()} GuitarFinder. All rights reserved.</span>
            </div>
        </footer>
    );
}

export default Footer;
