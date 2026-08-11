import { JSX } from 'react';
import spaceGuitar from '../../assets/super-guitar-in-space.jpg';
import './HomePage.css';

function HomePage(): JSX.Element {
    return (
        <div className="home-page" style={{ backgroundImage: `url(${spaceGuitar})` }}>
            <h1>Welcome to GuitarFinder</h1>
            <p>Find guitars, gear, and expert advice — all in one place.</p>
        </div>
    );
}

export default HomePage;
