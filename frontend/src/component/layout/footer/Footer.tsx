import { JSX } from 'react';
import { Link } from 'react-router-dom';
import { footerColumns } from '../../../utils/footer-links';
import guitarGod from '../../../assets/guitar-god.png';
import footerLogo from '../../../assets/guitar-finder-logo-1-Photoroom.png';
import './Footer.css';

function Footer(): JSX.Element {
    return (
        <footer className="site-footer">
            <div className="footer-top">
                <div className="footer-brand">
                    <img src={footerLogo} alt="GuitarFinder" className="footer-logo" />
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
                <img src={guitarGod} alt="" aria-hidden="true" className="footer-guitar" />
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

                    {/* PRS */}
                    <svg className="payment-logo" viewBox="0 0 80 38" aria-label="PRS Guitars">
                        <rect width="80" height="38" rx="5" fill="#1a0a2e"/>
                        <text x="40" y="25" textAnchor="middle" fill="#c084fc" fontSize="16" fontWeight="bold" fontFamily="Georgia, serif" letterSpacing="3">PRS</text>
                    </svg>

                    {/* Gretsch */}
                    <svg className="payment-logo" viewBox="0 0 80 38" aria-label="Gretsch">
                        <rect width="80" height="38" rx="5" fill="#f59e0b"/>
                        <text x="40" y="25" textAnchor="middle" fill="#111111" fontSize="11" fontWeight="bold" fontFamily="Georgia, serif" letterSpacing="1">GRETSCH</text>
                    </svg>

                    {/* ESP */}
                    <svg className="payment-logo" viewBox="0 0 80 38" aria-label="ESP Guitars">
                        <rect width="80" height="38" rx="5" fill="#111111"/>
                        <text x="40" y="25" textAnchor="middle" fill="#e63946" fontSize="17" fontWeight="bold" fontFamily="Arial, sans-serif" letterSpacing="4">ESP</text>
                    </svg>

                    {/* Epiphone */}
                    <svg className="payment-logo" viewBox="0 0 80 38" aria-label="Epiphone">
                        <rect width="80" height="38" rx="5" fill="#1a1a1a"/>
                        <text x="40" y="25" textAnchor="middle" fill="#c9a84c" fontSize="10" fontWeight="bold" fontFamily="Georgia, serif" letterSpacing="1">EPIPHONE</text>
                    </svg>

                    {/* Jackson */}
                    <svg className="payment-logo" viewBox="0 0 80 38" aria-label="Jackson Guitars">
                        <rect width="80" height="38" rx="5" fill="#000000"/>
                        <text x="40" y="25" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="Arial, sans-serif" letterSpacing="1.5">JACKSON</text>
                    </svg>

                    {/* Schecter */}
                    <svg className="payment-logo" viewBox="0 0 80 38" aria-label="Schecter">
                        <rect width="80" height="38" rx="5" fill="#111827"/>
                        <text x="40" y="25" textAnchor="middle" fill="#60a5fa" fontSize="10" fontWeight="bold" fontFamily="Arial, sans-serif" letterSpacing="1">SCHECTER</text>
                    </svg>

                    {/* Rickenbacker */}
                    <svg className="payment-logo" viewBox="0 0 80 38" aria-label="Rickenbacker">
                        <rect width="80" height="38" rx="5" fill="#7c2d12"/>
                        <text x="40" y="19" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="Arial, sans-serif" letterSpacing="0.5">RICKEN</text>
                        <text x="40" y="30" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="Arial, sans-serif" letterSpacing="0.5">BACKER</text>
                    </svg>

                    {/* Guild */}
                    <svg className="payment-logo" viewBox="0 0 80 38" aria-label="Guild">
                        <rect width="80" height="38" rx="5" fill="#14532d"/>
                        <text x="40" y="25" textAnchor="middle" fill="#4ade80" fontSize="14" fontWeight="bold" fontFamily="Georgia, serif" letterSpacing="2">GUILD</text>
                    </svg>

                    {/* Takamine */}
                    <svg className="payment-logo" viewBox="0 0 80 38" aria-label="Takamine">
                        <rect width="80" height="38" rx="5" fill="#2e1a4e"/>
                        <text x="40" y="25" textAnchor="middle" fill="#c084fc" fontSize="9" fontWeight="bold" fontFamily="Arial, sans-serif" letterSpacing="1">TAKAMINE</text>
                    </svg>

                    {/* Music Man */}
                    <svg className="payment-logo" viewBox="0 0 80 38" aria-label="Music Man">
                        <rect width="80" height="38" rx="5" fill="#1e3a5f"/>
                        <text x="40" y="19" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold" fontFamily="Arial, sans-serif" letterSpacing="1">MUSIC</text>
                        <text x="40" y="30" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold" fontFamily="Arial, sans-serif" letterSpacing="1">MAN</text>
                    </svg>

                    {/* Charvel */}
                    <svg className="payment-logo" viewBox="0 0 80 38" aria-label="Charvel">
                        <rect width="80" height="38" rx="5" fill="#7a0000"/>
                        <text x="40" y="25" textAnchor="middle" fill="#fca5a5" fontSize="11" fontWeight="bold" fontFamily="Arial, sans-serif" letterSpacing="1.5">CHARVEL</text>
                    </svg>

                    {/* Dean */}
                    <svg className="payment-logo" viewBox="0 0 80 38" aria-label="Dean Guitars">
                        <rect width="80" height="38" rx="5" fill="#0a0a0a"/>
                        <text x="40" y="25" textAnchor="middle" fill="#facc15" fontSize="16" fontWeight="bold" fontFamily="Arial, sans-serif" letterSpacing="3">DEAN</text>
                    </svg>

                    {/* BC Rich */}
                    <svg className="payment-logo" viewBox="0 0 80 38" aria-label="BC Rich">
                        <rect width="80" height="38" rx="5" fill="#1a0a2e"/>
                        <text x="40" y="25" textAnchor="middle" fill="#a855f7" fontSize="13" fontWeight="bold" fontFamily="Arial, sans-serif" letterSpacing="2">B.C.RICH</text>
                    </svg>

                    {/* D'Angelico */}
                    <svg className="payment-logo" viewBox="0 0 80 38" aria-label="D'Angelico">
                        <rect width="80" height="38" rx="5" fill="#3d2a00"/>
                        <text x="40" y="19" textAnchor="middle" fill="#fbbf24" fontSize="8" fontWeight="bold" fontFamily="Georgia, serif" letterSpacing="0.5">D'ANGELICO</text>
                        <text x="40" y="30" textAnchor="middle" fill="#fde68a" fontSize="7" fontFamily="Georgia, serif" letterSpacing="0.5">New York</text>
                    </svg>

                    {/* Washburn */}
                    <svg className="payment-logo" viewBox="0 0 80 38" aria-label="Washburn">
                        <rect width="80" height="38" rx="5" fill="#0f2744"/>
                        <text x="40" y="25" textAnchor="middle" fill="#93c5fd" fontSize="9" fontWeight="bold" fontFamily="Arial, sans-serif" letterSpacing="1">WASHBURN</text>
                    </svg>

                    {/* Ovation */}
                    <svg className="payment-logo" viewBox="0 0 80 38" aria-label="Ovation">
                        <rect width="80" height="38" rx="5" fill="#1c1c1c"/>
                        <text x="40" y="25" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="bold" fontFamily="Georgia, serif" letterSpacing="2">OVATION</text>
                    </svg>

                    {/* Kramer */}
                    <svg className="payment-logo" viewBox="0 0 80 38" aria-label="Kramer">
                        <rect width="80" height="38" rx="5" fill="#000000"/>
                        <text x="40" y="25" textAnchor="middle" fill="#f97316" fontSize="12" fontWeight="bold" fontFamily="Arial, sans-serif" letterSpacing="1.5">KRAMER</text>
                    </svg>

                    {/* Godin */}
                    <svg className="payment-logo" viewBox="0 0 80 38" aria-label="Godin">
                        <rect width="80" height="38" rx="5" fill="#1e3a2f"/>
                        <text x="40" y="25" textAnchor="middle" fill="#6ee7b7" fontSize="14" fontWeight="bold" fontFamily="Georgia, serif" letterSpacing="2">GODIN</text>
                    </svg>

                    {/* Squier */}
                    <svg className="payment-logo" viewBox="0 0 80 38" aria-label="Squier">
                        <rect width="80" height="38" rx="5" fill="#111111"/>
                        <text x="40" y="25" textAnchor="middle" fill="#fb923c" fontSize="12" fontWeight="bold" fontFamily="Arial, sans-serif" letterSpacing="1.5">SQUIER</text>
                    </svg>

                    {/* Parker */}
                    <svg className="payment-logo" viewBox="0 0 80 38" aria-label="Parker Guitars">
                        <rect width="80" height="38" rx="5" fill="#0c0c0c"/>
                        <text x="40" y="25" textAnchor="middle" fill="#a3e635" fontSize="13" fontWeight="bold" fontFamily="Arial, sans-serif" letterSpacing="2">PARKER</text>
                    </svg>

                    {/* Reverend */}
                    <svg className="payment-logo" viewBox="0 0 80 38" aria-label="Reverend Guitars">
                        <rect width="80" height="38" rx="5" fill="#2d1a00"/>
                        <text x="40" y="25" textAnchor="middle" fill="#fdba74" fontSize="9" fontWeight="bold" fontFamily="Arial, sans-serif" letterSpacing="1">REVEREND</text>
                    </svg>

                    {/* Collings */}
                    <svg className="payment-logo" viewBox="0 0 80 38" aria-label="Collings Guitars">
                        <rect width="80" height="38" rx="5" fill="#3b2a1a"/>
                        <text x="40" y="25" textAnchor="middle" fill="#fef3c7" fontSize="11" fontWeight="bold" fontFamily="Georgia, serif" letterSpacing="1.5">COLLINGS</text>
                    </svg>

                    {/* Duesenberg */}
                    <svg className="payment-logo" viewBox="0 0 80 38" aria-label="Duesenberg">
                        <rect width="80" height="38" rx="5" fill="#1a1a2e"/>
                        <text x="40" y="19" textAnchor="middle" fill="#c084fc" fontSize="8" fontWeight="bold" fontFamily="Georgia, serif" letterSpacing="0.5">DUESEN</text>
                        <text x="40" y="30" textAnchor="middle" fill="#c084fc" fontSize="8" fontWeight="bold" fontFamily="Georgia, serif" letterSpacing="0.5">BERG</text>
                    </svg>

                    {/* Hagstrom */}
                    <svg className="payment-logo" viewBox="0 0 80 38" aria-label="Hagstrom">
                        <rect width="80" height="38" rx="5" fill="#003366"/>
                        <text x="40" y="25" textAnchor="middle" fill="#ffd700" fontSize="10" fontWeight="bold" fontFamily="Arial, sans-serif" letterSpacing="1">HAGSTROM</text>
                    </svg>

                    {/* Strandberg */}
                    <svg className="payment-logo" viewBox="0 0 80 38" aria-label="Strandberg">
                        <rect width="80" height="38" rx="5" fill="#0a0a0a"/>
                        <text x="40" y="19" textAnchor="middle" fill="#e2e8f0" fontSize="8" fontWeight="bold" fontFamily="Arial, sans-serif" letterSpacing="0.5">STRAND</text>
                        <text x="40" y="30" textAnchor="middle" fill="#e2e8f0" fontSize="8" fontWeight="bold" fontFamily="Arial, sans-serif" letterSpacing="0.5">BERG</text>
                    </svg>

                    {/* Suhr */}
                    <svg className="payment-logo" viewBox="0 0 80 38" aria-label="Suhr Guitars">
                        <rect width="80" height="38" rx="5" fill="#1a1a1a"/>
                        <text x="40" y="25" textAnchor="middle" fill="#f59e0b" fontSize="18" fontWeight="bold" fontFamily="Georgia, serif" letterSpacing="3">SUHR</text>
                    </svg>

                    {/* Tom Anderson */}
                    <svg className="payment-logo" viewBox="0 0 80 38" aria-label="Tom Anderson">
                        <rect width="80" height="38" rx="5" fill="#1e1b4b"/>
                        <text x="40" y="19" textAnchor="middle" fill="#a5b4fc" fontSize="7" fontWeight="bold" fontFamily="Arial, sans-serif" letterSpacing="0.5">TOM</text>
                        <text x="40" y="30" textAnchor="middle" fill="#a5b4fc" fontSize="7" fontWeight="bold" fontFamily="Arial, sans-serif" letterSpacing="0.5">ANDERSON</text>
                    </svg>

                    {/* Kiesel */}
                    <svg className="payment-logo" viewBox="0 0 80 38" aria-label="Kiesel Guitars">
                        <rect width="80" height="38" rx="5" fill="#0f172a"/>
                        <text x="40" y="25" textAnchor="middle" fill="#38bdf8" fontSize="13" fontWeight="bold" fontFamily="Arial, sans-serif" letterSpacing="2">KIESEL</text>
                    </svg>

                    {/* Mayones */}
                    <svg className="payment-logo" viewBox="0 0 80 38" aria-label="Mayones">
                        <rect width="80" height="38" rx="5" fill="#1c0a00"/>
                        <text x="40" y="25" textAnchor="middle" fill="#fb923c" fontSize="11" fontWeight="bold" fontFamily="Georgia, serif" letterSpacing="1.5">MAYONES</text>
                    </svg>
                </div>
                <span className="footer-copy">© {new Date().getFullYear()} GuitarFinder. All rights reserved.</span>
            </div>
        </footer>
    );
}

export default Footer;
