import { JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import guitars from '../../data/guitars.json';
import fenderGuitar from '../../assets/guitar-god.png';
import './HomeCarousel.css';

const BRAND_LOGOS: Record<string, JSX.Element> = {
    fender:   <svg viewBox="0 0 110 44"><rect width="110" height="44" rx="6" fill="#8B0000"/><text x="55" y="31" textAnchor="middle" fill="#FFFFFF" fontSize="22" fontWeight="bold" fontFamily="'Dancing Script', cursive">Fender</text></svg>,
    gibson:   <svg viewBox="0 0 110 44"><rect width="110" height="44" rx="6" fill="#1a1a1a"/><text x="55" y="30" textAnchor="middle" fill="#c9a84c" fontSize="18" fontWeight="bold" fontFamily="Georgia, serif" fontStyle="italic" letterSpacing="0.5">Gibson</text></svg>,
    taylor:   <svg viewBox="0 0 110 44"><rect width="110" height="44" rx="6" fill="#2c3e50"/><text x="55" y="28" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold" fontFamily="Georgia, serif" letterSpacing="2.5">TAYLOR</text></svg>,
    martin:   <svg viewBox="0 0 110 44"><rect width="110" height="44" rx="6" fill="#8B0000"/><text x="55" y="28" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold" fontFamily="Arial, sans-serif" letterSpacing="2.5">MARTIN</text></svg>,
    prs:      <svg viewBox="0 0 110 44"><rect width="110" height="44" rx="6" fill="#1a0a2e"/><text x="55" y="30" textAnchor="middle" fill="#c084fc" fontSize="18" fontWeight="bold" fontFamily="Georgia, serif" letterSpacing="4">PRS</text></svg>,
    ibanez:   <svg viewBox="0 0 110 44"><rect width="110" height="44" rx="6" fill="#000000"/><text x="55" y="28" textAnchor="middle" fill="#e63946" fontSize="12" fontWeight="bold" fontFamily="Arial, sans-serif" letterSpacing="2">IBANEZ</text></svg>,
    yamaha:   <svg viewBox="0 0 110 44"><rect width="110" height="44" rx="6" fill="#4a0080"/><text x="55" y="28" textAnchor="middle" fill="#d8b4fe" fontSize="11" fontWeight="bold" fontFamily="Arial, sans-serif" letterSpacing="2">YAMAHA</text></svg>,
    gretsch:  <svg viewBox="0 0 110 44"><rect width="110" height="44" rx="6" fill="#f59e0b"/><text x="55" y="28" textAnchor="middle" fill="#111111" fontSize="11" fontWeight="bold" fontFamily="Georgia, serif" letterSpacing="1.5">GRETSCH</text></svg>,
    esp:      <svg viewBox="0 0 110 44"><rect width="110" height="44" rx="6" fill="#111111"/><text x="55" y="30" textAnchor="middle" fill="#e63946" fontSize="19" fontWeight="bold" fontFamily="Arial, sans-serif" letterSpacing="5">ESP</text></svg>,
    epiphone: <svg viewBox="0 0 110 44"><rect width="110" height="44" rx="6" fill="#1a1a1a"/><text x="55" y="28" textAnchor="middle" fill="#c9a84c" fontSize="10" fontWeight="bold" fontFamily="Georgia, serif" letterSpacing="1.5">EPIPHONE</text></svg>,
    schecter: <svg viewBox="0 0 110 44"><rect width="110" height="44" rx="6" fill="#111827"/><text x="55" y="28" textAnchor="middle" fill="#60a5fa" fontSize="10" fontWeight="bold" fontFamily="Arial, sans-serif" letterSpacing="1.5">SCHECTER</text></svg>,
    jackson:  <svg viewBox="0 0 110 44"><rect width="110" height="44" rx="6" fill="#000000"/><text x="55" y="28" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="Arial, sans-serif" letterSpacing="2">JACKSON</text></svg>,
};

const BRAND_STYLES: Record<string, { bg: string; text: string; accent: string }> = {
    fender:   { bg: 'linear-gradient(135deg, #7a0000 0%, #111111 100%)', text: '#ffffff', accent: '#ff4444' },
    gibson:   { bg: 'linear-gradient(135deg, #1a1a1a 0%, #2e2200 100%)', text: '#c9a84c', accent: '#e8c46a' },
    taylor:   { bg: 'linear-gradient(135deg, #1a2a3e 0%, #2c3e50 100%)', text: '#ffffff', accent: '#5ba3d9' },
    martin:   { bg: 'linear-gradient(135deg, #5a0000 0%, #2d0000 100%)', text: '#ffffff', accent: '#ff8080' },
    prs:      { bg: 'linear-gradient(135deg, #1a0a2e 0%, #3b1060 100%)', text: '#c084fc', accent: '#d8aaff' },
    ibanez:   { bg: 'linear-gradient(135deg, #111111 0%, #3d0000 100%)', text: '#ffffff', accent: '#e63946' },
    yamaha:   { bg: 'linear-gradient(135deg, #12003a 0%, #1a1a2e 100%)', text: '#ffffff', accent: '#a855f7' },
    gretsch:  { bg: 'linear-gradient(135deg, #7a5800 0%, #c27a0a 100%)', text: '#111111', accent: '#111111' },
    esp:      { bg: 'linear-gradient(135deg, #0a0a0a 0%, #2d0000 100%)', text: '#e63946', accent: '#ff6b6b' },
    epiphone:   { bg: 'linear-gradient(135deg, #1a1a1a 0%, #2e2200 100%)', text: '#c9a84c', accent: '#e8c46a' },
    schecter:   { bg: 'linear-gradient(135deg, #111827 0%, #1e3a5f 100%)', text: '#60a5fa', accent: '#93c5fd' },
    jackson:    { bg: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)', text: '#ffffff', accent: '#e5e7eb' },
    rickenbacker: { bg: 'linear-gradient(135deg, #5c1a00 0%, #7c2d12 100%)', text: '#ffffff', accent: '#fdba74' },
    guild:      { bg: 'linear-gradient(135deg, #1a2e1a 0%, #14532d 100%)', text: '#ffffff', accent: '#4ade80' },
    takamine:   { bg: 'linear-gradient(135deg, #1c1c2e 0%, #2e1a4e 100%)', text: '#ffffff', accent: '#c084fc' },
    musicman:   { bg: 'linear-gradient(135deg, #0a1a2e 0%, #1e3a5f 100%)', text: '#ffffff', accent: '#38bdf8' },
    charvel:    { bg: 'linear-gradient(135deg, #1a0000 0%, #7a0000 100%)', text: '#ffffff', accent: '#fca5a5' },
    dean:       { bg: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a00 100%)', text: '#facc15', accent: '#fde047' },
    bcrich:     { bg: 'linear-gradient(135deg, #1a0a2e 0%, #0f0f0f 100%)', text: '#a855f7', accent: '#d8b4fe' },
    dangelico:  { bg: 'linear-gradient(135deg, #1a1200 0%, #3d2a00 100%)', text: '#fbbf24', accent: '#fde68a' },
};

function HomeCarousel(): JSX.Element {
    const navigate = useNavigate();
    const carouselBrands = guitars.slice(0, 12);
    const quantity = carouselBrands.length;

    return (
        <div className="home-carousel-3d">
            <div className="carousel-3d-scene">
                <div className="carousel-3d-context">
                <img src={fenderGuitar} className="carousel-guitar-bg" alt="" aria-hidden="true" />
                <div
                    className="carousel-3d-slider"
                    style={{ '--quantity': quantity } as React.CSSProperties}
                >
                    {carouselBrands.map((brand, i) => {
                        const style = BRAND_STYLES[brand.id] ?? { bg: '#1a1a2e', text: '#ffffff', accent: '#16a34a' };
                        const logo = BRAND_LOGOS[brand.id];
                        return (
                            <div
                                key={brand.id}
                                className="carousel-3d-item"
                                style={{ '--position': i + 1 } as React.CSSProperties}
                                onClick={() => navigate('/guitars')}
                            >
                                <div className="brand-3d-card" style={{ background: style.bg }}>
                                    <div className="brand-3d-logo">{logo}</div>
                                    <span className="brand-3d-meta" style={{ color: style.accent }}>
                                        {brand.country} · Est. {brand.founded}
                                    </span>
                                    <span className="brand-3d-count" style={{ color: style.text }}>
                                        {brand.models.length} Models
                                    </span>
                                    <span className="brand-3d-cta" style={{ borderColor: style.accent, color: style.accent }}>
                                        Browse
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
                </div>
            </div>
        </div>
    );
}

export default HomeCarousel;
