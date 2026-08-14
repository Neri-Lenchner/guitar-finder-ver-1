import { JSX } from 'react';
import HomeCarousel from '../HomeCarousel/HomeCarousel';
import homeLogo from '../../assets/guitar-finder-welcome-logo-1-Photoroom.png';
import homeTagline from '../../assets/find-guitars-gear-and-expert-advice-all-in-one-place-Photoroom.png';
import './HomePage.css';

function HomePage(): JSX.Element {
    return (
        <div className="home-page">
            <div className="home-hero">
                <img src={homeLogo} alt="Welcome to GuitarFinder" className="home-logo" />
                <img src={homeTagline} alt="Find guitars, gear, and expert advice — all in one place" className="home-tagline" />
            </div>
            <HomeCarousel />
        </div>
    );
}

export default HomePage;
