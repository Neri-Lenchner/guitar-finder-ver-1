import { JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
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

    return (
        <div className="home-carousel-wrapper">
            <h2 className="home-carousel-title">Explore Guitar Brands</h2>
            <Swiper
                modules={[Autoplay, Navigation, Pagination]}
                slidesPerView={4}
                spaceBetween={20}
                loop={true}
                autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                navigation={true}
                pagination={{ clickable: true }}
                breakpoints={{
                    320:  { slidesPerView: 1 },
                    640:  { slidesPerView: 2 },
                    900:  { slidesPerView: 3 },
                    1200: { slidesPerView: 4 },
                }}
                className="home-swiper"
            >
                {guitars.map(brand => {
                    const style = BRAND_STYLES[brand.id] ?? { bg: '#1a1a2e', text: '#ffffff', accent: '#16a34a' };
                    return (
                        <SwiperSlide key={brand.id}>
                            <div
                                className="brand-slide-card"
                                style={{ background: style.bg }}
                                onClick={() => navigate('/guitars')}
                            >
                                <div className="brand-slide-initial" style={{ color: style.accent }}>
                                    {brand.name.charAt(0)}
                                </div>
                                <div className="brand-slide-info">
                                    <span className="brand-slide-name" style={{ color: style.text }}>{brand.name}</span>
                                    <span className="brand-slide-meta" style={{ color: style.accent }}>
                                        {brand.country} · Est. {brand.founded}
                                    </span>
                                    <span className="brand-slide-count" style={{ color: style.text }}>
                                        {brand.models.length} Models
                                    </span>
                                </div>
                                <div className="brand-slide-cta" style={{ borderColor: style.accent, color: style.accent }}>
                                    Browse Models
                                </div>
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    );
}

export default HomeCarousel;
