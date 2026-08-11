import { JSX } from 'react';
import HomeCarousel from '../HomeCarousel/HomeCarousel';
import './HomePage.css';

function HomePage(): JSX.Element {
    return (
        <div className="home-page">
            <div className="home-hero">
                <h1>Welcome to GuitarFinder</h1>
                <p>Find guitars, gear, and expert advice — all in one place.</p>
            </div>
            <HomeCarousel />
        </div>
    );
}

export default HomePage;
