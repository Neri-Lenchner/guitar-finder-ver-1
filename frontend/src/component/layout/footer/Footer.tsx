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
                    {/* Visa */}
                    <svg className="payment-logo" viewBox="0 0 60 38" aria-label="Visa">
                        <rect width="60" height="38" rx="5" fill="#1A1F71"/>
                        <text x="30" y="26" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="bold" fontStyle="italic" fontFamily="Arial, sans-serif">VISA</text>
                    </svg>

                    {/* Mastercard */}
                    <svg className="payment-logo" viewBox="0 0 60 38" aria-label="Mastercard">
                        <rect width="60" height="38" rx="5" fill="#252525"/>
                        <circle cx="24" cy="19" r="11" fill="#EB001B"/>
                        <circle cx="36" cy="19" r="11" fill="#F79E1B"/>
                        <path d="M30 10.2a11 11 0 0 1 0 17.6A11 11 0 0 1 30 10.2z" fill="#FF5F00"/>
                    </svg>

                    {/* PayPal */}
                    <svg className="payment-logo" viewBox="0 0 60 38" aria-label="PayPal">
                        <rect width="60" height="38" rx="5" fill="#F7F7F7"/>
                        <text x="10" y="17" fill="#003087" fontSize="9" fontWeight="bold" fontFamily="Arial, sans-serif">Pay</text>
                        <text x="10" y="28" fill="#009CDE" fontSize="9" fontWeight="bold" fontFamily="Arial, sans-serif">Pal</text>
                        <circle cx="46" cy="13" r="8" fill="#009CDE" opacity="0.25"/>
                        <circle cx="46" cy="22" r="8" fill="#003087" opacity="0.25"/>
                        <text x="43" y="24" fill="#003087" fontSize="13" fontWeight="bold" fontFamily="Arial, sans-serif">P</text>
                    </svg>

                    {/* American Express */}
                    <svg className="payment-logo" viewBox="0 0 60 38" aria-label="American Express">
                        <rect width="60" height="38" rx="5" fill="#2E77BC"/>
                        <text x="30" y="16" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="bold" fontFamily="Arial, sans-serif" letterSpacing="0.5">AMERICAN</text>
                        <text x="30" y="27" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="bold" fontFamily="Arial, sans-serif" letterSpacing="1">EXPRESS</text>
                    </svg>

                    {/* Apple Pay */}
                    <svg className="payment-logo" viewBox="0 0 60 38" aria-label="Apple Pay">
                        <rect width="60" height="38" rx="5" fill="#000000"/>
                        <text x="27" y="24" fill="#FFFFFF" fontSize="11" fontWeight="500" fontFamily="Arial, sans-serif">Pay</text>
                        <path d="M16 13.5c.8-1 .7-2.3.7-2.3s-1.2.1-2 .9c-.7.7-.8 1.9-.8 1.9s1.2 0 2.1-.5z" fill="white"/>
                        <path d="M16.6 14.2c-1.1 0-1.6.7-2.4.7-.8 0-1.5-.6-2.3-.6-1.2 0-2.4.7-3 1.8-.8 1.4-.7 4 .8 6.3.5.7 1.1 1.5 1.9 1.5.8 0 1-.5 2-.5s1.2.5 2 .5c.8 0 1.4-.8 1.9-1.5.4-.6.6-1.1.8-1.7-2-.8-2.3-3.7-.3-4.8-.7-.9-1.5-1.7-1.4-1.7z" fill="white"/>
                    </svg>

                    {/* Google Pay */}
                    <svg className="payment-logo" viewBox="0 0 60 38" aria-label="Google Pay">
                        <rect width="60" height="38" rx="5" fill="#FFFFFF" stroke="#E0E0E0"/>
                        <text x="10" y="25" fill="#4285F4" fontSize="15" fontWeight="bold" fontFamily="Arial, sans-serif">G</text>
                        <text x="24" y="25" fill="#3C4043" fontSize="12" fontFamily="Arial, sans-serif">Pay</text>
                    </svg>
                </div>
                <span className="footer-copy">© {new Date().getFullYear()} GuitarFinder. All rights reserved.</span>
            </div>
        </footer>
    );
}

export default Footer;
