import { JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import guitars from '../../data/guitars.json';
import './HomeCarousel.css';

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
    epiphone: { bg: 'linear-gradient(135deg, #1a1a1a 0%, #2e2200 100%)', text: '#c9a84c', accent: '#e8c46a' },
};

function HomeCarousel(): JSX.Element {
    const navigate = useNavigate();
    const quantity = guitars.length;

    return (
        <div className="home-carousel-3d">
            <h2 className="home-carousel-3d-title">Explore Guitar Brands</h2>
            <div className="carousel-3d-scene">
                <div
                    className="carousel-3d-slider"
                    style={{ '--quantity': quantity } as React.CSSProperties}
                >
                    {guitars.map((brand, i) => {
                        const style = BRAND_STYLES[brand.id] ?? { bg: '#1a1a2e', text: '#ffffff', accent: '#16a34a' };
                        return (
                            <div
                                key={brand.id}
                                className="carousel-3d-item"
                                style={{ '--position': i + 1 } as React.CSSProperties}
                                onClick={() => navigate('/guitars')}
                            >
                                <div className="brand-3d-card" style={{ background: style.bg }}>
                                    <div className="brand-3d-initial" style={{ color: style.accent }}>
                                        {brand.name.charAt(0)}
                                    </div>
                                    <span className="brand-3d-name" style={{ color: style.text }}>{brand.name}</span>
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
    );
}

export default HomeCarousel;
