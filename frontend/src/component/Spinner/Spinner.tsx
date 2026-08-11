import { JSX } from 'react';
import './Spinner.css';

interface SpinnerProps {
    text?: string;
}

function Spinner({ text = 'Loading...' }: SpinnerProps): JSX.Element {
    return (
        <div className="spinner-container">
            <div className="spinner" />
            <p className="spinner-text">{text}</p>
        </div>
    );
}

export default Spinner;
