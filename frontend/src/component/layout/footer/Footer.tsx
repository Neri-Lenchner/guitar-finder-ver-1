import { JSX } from 'react';
import './Footer.css';

function Footer(): JSX.Element {
    return (
        <footer className="footer">
            <p>GuitarFinder &copy; {new Date().getFullYear()}</p>
        </footer>
    );
}

export default Footer;
