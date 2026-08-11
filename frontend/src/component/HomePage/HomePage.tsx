import { JSX } from 'react';
import fenderGuitar from '../../assets/fender-guitar.png';
import HomeCarousel from '../HomeCarousel/HomeCarousel';
import './HomePage.css';

function HomePage(): JSX.Element {
    return (
        <div className="home-page">
            <img src={fenderGuitar} className="home-fender-bg" alt="" aria-hidden="true" />
            <div className="home-hero">
                <h1>Welcome to GuitarFinder</h1>
                <p>Find guitars, gear, and expert advice — all in one place.</p>
            </div>
            <HomeCarousel />
        </div>
    );
}

export default HomePage;
