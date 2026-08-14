import { JSX } from 'react';
import HomeCarousel from '../HomeCarousel/HomeCarousel';
import homeLogo from '../../assets/guitar-finder-welcome-logo-1-Photoroom.png';
import './HomePage.css';

function HomePage(): JSX.Element {
    return (
        <div className="home-page">
            <div className="home-hero">
                <img src={homeLogo} alt="Welcome to GuitarFinder" className="home-logo" />
            </div>
            <HomeCarousel />
        </div>
    );
}

export default HomePage;
